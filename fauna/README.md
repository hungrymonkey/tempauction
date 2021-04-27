# Fauna DB Setup


## Tables

```
CreateCollection({name: "auction"});
CreateCollection({name: "bid"});
```

## Indexes

### Ref
```
CreateIndex({
  name: "all_bids",
  source: Collection("bid")
})
CreateIndex({
  name: "all_auctions",
  source: Collection("auction")
})

```
### Auction_name
```
CreateIndex({
  name:   "auction_by_name",
  source: Collection("auction"),
  terms:  [{ field: [ "data", "name" ] }],
  unique: true
})
CreateIndex({
  name: "bid_by_auctionRef",
  source: Collection("bid"),
  terms:  [{ field: [ "data", "auctionRef" ] }]
})
CreateIndex({
  name: "bid_by_timestamp",
  source: Collection("bid"),
  terms:  [{ field: [ "data", "timestamp" ] }]
})

```
### Insert
```
Create(
  Collection("auction"),
  {
    data: {
      "name": "dummy",
      "auction_end": 1619247411
    }
  }
)
Create(
  Collection("bid"),
  {
    data: {
      "email": "dummy@example.com",
      "name": "dummy",
      "amount": 100,
      "timestamp": Now(),
      "auctionRef": Select( "ref", Get(Match(Index("auction_by_name"), "dummy")))
    }
  }
)
Create(
  Collection("bid"),
  {
    data: {
      "email": "dummy2@example.com",
      "name": "dummy2",
      "amount": 200,
      "timestamp": Now(),
      "auctionRef": Select( "ref", Get(Match(Index("auction_by_name"), "dummy")))
    }
  }
)
Create(
  Collection("bid"),
  {
    data: {
      "email": "dummy3@example.com",
      "name": "dummy3",
      "amount": 300,
      "timestamp": Now(),
      "auctionRef": Select( "ref", Get(Match(Index("auction_by_name"), "dummy")))
    }
  }
)
```
### Update
1. Update by ref id
```
Update( Ref(Collection("bid"), '296247780316283405'),
  { data: { auction: "dummy" }});
```
https://docs.fauna.com/fauna/current/tutorials/crud?lang=javascript

### Query
1. Get all auctions

```
Map(
  Paginate(
    Match(Index("all_auctions"))
  ),
  Lambda("X", Get(Var("X")))
)
```

2. Get all bids

```
Map(
  Paginate(
      Match(Index("all_bids")),
  ),
  Lambda("X", Get(Var("X")))
)
```

3. Get all bids in an auction

```
Map(
  Paginate(
    Join(
        Match(Index("auction_by_name"), "dummy"),
        Index("bid_by_auctionRef")
    ),
  ),
  Lambda("X", Get(Var("X")))
)
```

4. Get all bids in an auction with auction_end

```
Map(
  Paginate(
    Join(
        Match(Index("auction_by_name"), "dummy"),
        Index("bid_by_auctionRef")
    ),
  ),
  Lambda("X",
    Let({
        auction: Select( "ref", Get(Match(Index("auction_by_name"), "dummy"))),
        bid:  Get(Var("X"))
    },
    Merge(Var('bid'), { auction: Get(Var("auction"))}))
  )
)
```

```json
{
  data: [
    {
      ref: Ref(Collection("bid"), "296803255821795848"),
      ts: 1619312492120000,
      data: {
        email: "dummy@example.com",
        name: "dummy",
        amount: 100,
        timestamp: Time("2021-04-25T01:01:32.023397Z"),
        auctionRef: Ref(Collection("auction"), "296247615765348877")
      },
      auction: {
        ref: Ref(Collection("auction"), "296247615765348877"),
        ts: 1618782592477000,
        data: {
          name: "dummy",
          auction_end: 1619247411
        }
      }
    },
    {
      ref: Ref(Collection("bid"), "296803268032463368"),
      ts: 1619312503760000,
      data: {
        email: "dummy2@example.com",
        name: "dummy2",
        amount: 200,
        timestamp: Time("2021-04-25T01:01:43.665543Z"),
        auctionRef: Ref(Collection("auction"), "296247615765348877")
      },
      auction: {
        ref: Ref(Collection("auction"), "296247615765348877"),
        ts: 1618782592477000,
        data: {
          name: "dummy",
          auction_end: 1619247411
        }
      }
    }
  ]
}
```

```
Map(
  Paginate(
    Join(
        Match(Index("auction_by_name"), "dummy"),
        Index("bid_by_auctionRef")
    ),
  ),
  Lambda("X",
    Let({
        auction: Select( "ref", Get(Match(Index("auction_by_name"), "dummy"))),
        bid:  Select(["data"], Get(Var("X"))),
        bidts: Select("ts", Get(Var("X")))
    },
    Merge(Merge(Var('bid'), { auction: Get(Var("auction"))}), {ts: Var("bidts")}))
  )
)
```

```json
{
  data: [
    {
      name: "dummy",
      timestamp: Time("2021-04-25T01:01:32.023397Z"),
      email: "dummy@example.com",
      auction: {
        ref: Ref(Collection("auction"), "296247615765348877"),
        ts: 1618782592477000,
        data: {
          name: "dummy",
          auction_end: 1619247411
        }
      },
      auctionRef: Ref(Collection("auction"), "296247615765348877"),
      ts: 1619312492120000,
      amount: 100
    },
    {
      name: "dummy2",
      timestamp: Time("2021-04-25T01:01:43.665543Z"),
      email: "dummy2@example.com",
      auction: {
        ref: Ref(Collection("auction"), "296247615765348877"),
        ts: 1618782592477000,
        data: {
          name: "dummy",
          auction_end: 1619247411
        }
      },
      auctionRef: Ref(Collection("auction"), "296247615765348877"),
      ts: 1619312503760000,
      amount: 200
    }
  ]
}
```

5. Sorted by amount

```
CreateIndex({
  name: "bid_by_amount_desc",
  source: Collection("bid"),
  values:  [
    { field: [ "data", "amount" ], reverse: true },
    { field: [ "data", "auctionRef" ] },
    { field: [ "ref" ] },
  ]
})

Map(
  Paginate(Match(Index("bid_by_amount_desc"))),
  Lambda(
    "X", 
    Let({
      auctionRef: Select(1, Var("X")), bidRef: Select(2, Var("X"))
      },
      Merge(Get(Var("bidRef")), Select(["data"], Get(Var("auctionRef"))))
    )
  )
);
```
```
{
  data: [
    {
      name: "dummy",
      data: {
        email: "dummy3@example.com",
        name: "dummy3",
        amount: 300,
        timestamp: Time("2021-04-25T03:04:08.263530Z"),
        auctionRef: Ref(Collection("auction"), "296247615765348877")
      },
      ts: 1619319848350000,
      ref: Ref(Collection("bid"), "296810969400607245"),
      auction_end: 1619247411
    },
    {
      name: "dummy",
      data: {
        email: "dummy2@example.com",
        name: "dummy2",
        amount: 200,
        timestamp: Time("2021-04-25T01:01:43.665543Z"),
        auctionRef: Ref(Collection("auction"), "296247615765348877")
      },
      ts: 1619312503760000,
      ref: Ref(Collection("bid"), "296803268032463368"),
      auction_end: 1619247411
    }
  ]
}
```
6. Max Bid

```
Map(
  Max(Paginate(Match(Index("bid_by_amount_desc")))),
  Lambda(
    "X", 
    Let({
      auctionRef: Select(1, Var("X")), bidRef: Select(2, Var("X"))
      },
      Merge(Get(Var("bidRef")), Select(["data"], Get(Var("auctionRef"))))
    )
  )
)
```
### According to the Docs
FQL compares numbers first then references
https://docs.fauna.com/fauna/current/api/fql/functions/max?lang=go

```json
{
  data: [
    {
      name: "dummy",
      data: {
        email: "dummy3@example.com",
        name: "dummy3",
        amount: 300,
        timestamp: Time("2021-04-25T03:04:08.263530Z"),
        auctionRef: Ref(Collection("auction"), "296247615765348877")
      },
      ts: 1619319848350000,
      ref: Ref(Collection("bid"), "296810969400607245"),
      auction_end: 1619247411
    }
  ]
}
``
7 Create Bid ACID
```
Let(
  {
    maxBid: Max(
      Filter(
        Paginate(Match(Index("bid_by_amount_desc"))),
        Lambda(
          "Y",
          Let(
            { auctionRef: Select(1, Var("Y")) },
            Equals(Select(["data", "name"], Get(Var("auctionRef"))), "dummy")
          )
        )
      )
    )
  },
  Let(
    {
      amount: Select(["data", 0, 0], Var("maxBid")),
      bid: Get(Select(["data", 0, 2], Var("maxBid"))),
      timestamp: Now()
    },
    If(
      GT(Var("amount"), 700),
      Var("bid"),
      If(
        Equals(Select(["data", "email"], Var("bid")), "dummy4@example.com"),
        Var("bid"),
        Create(Collection("bid"), {
          data: {
            email: "dummy4@example.com",
            name: "dummy4",
            amount: 700,
            timestamp: Var("timestamp"),
            auctionRef: Select(
              "ref",
              Get(Match(Index("auction_by_name"), "dummy"))
            )
          }
        })
      )
    )
  )
)
```
