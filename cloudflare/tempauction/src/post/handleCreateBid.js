
const { handlePostBody } = require('./handlePostBody.js')
const faunadb = require('faunadb');

const { Add, Equals, Filter, Lambda, Match, Max, Paginate } = faunadb.query;
const { Let, Select, Var} = faunadb.query;
const { Collection, Create, Get, Index } = faunadb.query;
const { Now, TimeDiff } = faunadb.query;
const { GT, LT, If, IsEmpty, ToInteger } = faunadb.query;
const { Format } = faunadb.query;
const { validateEmail, validateBidAmount } = require('../utils.js');

const { VALID_URL_SET } = require('../config.js');


export async function handleCreateBid(request, fqlClient) {
	const { headers } = request;
	const contentType = headers.get("content-type") || "";
	const origin = headers.get("origin") || "";
	const init = {
		headers: {
			'content-type': 'application/json',
			'Access-Control-Allow-Origin': VALID_URL_SET.has(origin) ? origin : "localhost:3000",
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers' : "Content-Type,Origin,Accept"
		},
		status: 400
	};
	
	if (contentType.includes("application/json") || contentType.includes("form")) {
		var args = await handlePostBody(request);
	} else {
		let body = JSON.stringify({
			contentType: headers.get("content-type"), 
			error_message: "contentType unsupported",
			error_code: 500,
			endpoint: "createbid",
			supportedContentTypes: ["application/x-www-form-urlencoded", "application/json"]
		});
		return new Response(body, init)
	}
	if ( args.hasOwnProperty('auction') && args.hasOwnProperty('bid_amount') && args.hasOwnProperty('email') && args.hasOwnProperty('name') ) {
		let bidAmount = Number.parseInt(args['bid_amount']);
		let is_number = validateBidAmount(bidAmount);
		let valid_email = validateEmail(args['email']);
		let bider_name = typeof args['name'] === "string";
		if( !(is_number && valid_email && bider_name)) {
			var body = JSON.stringify({
				contentType: headers.get("content-type"), 
				error_message: "Argument Validation Failed",
				error_code: 504,
				endpoint: "createbid",
				arguments: args
			})
			return new Response(body, init)
		}
		/*
		try {
			var auction_ref = await fqlClient.query(Get(Match(Index("auction_by_name"), args['auction'])));
			console.log(auction_ref);
		} catch (exception) {
			console.log(exception)
			var body = JSON.stringify({
				contentType: headers.get("content-type"), 
				error_message: "auction not found",
				error_code: 503,
				endpoint: "createbid",
				arguments: args
			})
			return new Response(body, init)
		}*/
		try {
			let results = await fqlClient.query(
				Let({
					  newBid: ToInteger(bidAmount),
					  newEmail: args["email"],
					  newName: args['name'],
					  auctionName: args['auction'],
					  allBids: Filter(
						Paginate(Match(Index("bid_by_amount_desc"))),
						Lambda(
						  "Y",
						  Let(
							{ auctionRef: Select(1, Var("Y")) },
								Equals(Select(["data", "name"], Get(Var("auctionRef"))), Var("auctionName"))
							)
						)
					  )
					},
					If( IsEmpty(Var("allBids")), 
						Create(Collection("bid"), {
							data: {
								email: Var("newEmail"),
								name: Var("newName"),
								amount: Var("newBid"),
								timestamp:  Now(),
								auctionRef: Select(
									"ref",
									Get(Match(Index("auction_by_name"), Var("auctionName")))
								)
							}
						}),
						Let({
							  maxBid: Max(Var("allBids")),
							  oldBidAmount: Select(["data", 0, 0], Var("maxBid")),
							  bid: Get(Select(["data", 0, 2], Var("maxBid"))),
							  bidIncrement: Select(["data","bid_increment"], Get(Select(["data", 0, 1], Var("maxBid")))),
							  auctionInfo: Get(Select(["data", 0, 1], Var("maxBid")))
							},
							If(GT(Add(Var("oldBidAmount"), Var("bidIncrement")), Var("newBid")), { data: {
								  error_message : "bid increment too small",
								  minium_bid : Add(Var("oldBidAmount"), Var("bidIncrement")),
								  arguments: args,
								  error_code : 510
							  }},
							  If(Equals(Select(["data", "email"], Var("bid")), Var("newEmail")), { data: { 
										  error_message: "email is bidding twice",
										  arguments: args,
										  error_code : 511
								  }},
								  If(GT(Select(["data", "timestamp"], Var("bid")), Now()),
									  { data: {error_message : "bidder trying to move back in time", error_code:512 }},
									  If(LT(Select(["data", "auction_end"], Var("auctionInfo")), Now()),
									  	{ data:  {
											  error_message : Format("Auction is over %d sec ago", TimeDiff(Select(["data", "auction_end"], Var("auctionInfo")), Now(), "seconds")), 
											  error_code:513
										}}, Create(Collection("bid"), {
												data: {
													email: Var("newEmail"),
													name: Var("newName"),
													amount: Var("newBid"),
													timestamp:  Now(),
													auctionRef: Select("ref", Var("auctionInfo"))
												}
											})
									  )
								  )
								)
							)
							
						)
					)
				)
			)
			init["status"] = 200
			if(results["data"].hasOwnProperty("error_message")) {
				var body = JSON.stringify(results["data"]);
			} else
				var body = JSON.stringify({result: results["data"], error_code: 0});
		} catch (exception) {
			console.log(exception)
			var body = JSON.stringify({
				contentType: headers.get("content-type"), 
				error_message: "auction not found",
				error_code: 502,
				endpoint: "createbid",
				arguments: args
			})
			return new Response(body, init)
		}
		//var result = "TODO";
	} else {
		var body = JSON.stringify({
			contentType: headers.get("content-type"), 
			error_message: "auction argument not found",
			error_code: 501,
			endpoint: "createbid",
			arguments: args
		})

	}
	return new Response(body, init)
  }