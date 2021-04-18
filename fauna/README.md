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
  name:   "bid_by_amount",
  source: Collection("bid"),
  terms:  [{ field: [ "data", "amount" ] }],
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
      "auction": Get(Match(Index("auction_by_name"), "dummy"))
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
      "auction": Get(Match(Index("auction_by_name"), "dummy"))
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
      "auction": Get(Match(Index("auction_by_name"), "dummy"))
    }
  }
)
```
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
    Match(Index("all_bids"))
  ),
  Lambda("X", Get(Var("X")))
)
```

