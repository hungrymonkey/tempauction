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
      "auction": Select( "ref", Get(Match(Index("auction_by_name"), "dummy")))
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
4. Sorted by amount
```
CreateIndex({
  name: "bid_by_amount_desc",
  source: Collection("bid"),
  terms: [
    { field: ["ref"] }
  ],
  values:  [
    { field: [ "data", "amount" ], reverse: true },
    { field: [ "data", "auction" ] },
    { field: [ "ref" ] },
    { field: [ "data", "timestamp" ] },
    { field: [ "data", "email" ] },
    { field: [ "data", "name" ] }
  ]
})

Paginate(Match(Index("bid_by_amount_desc")))
```
