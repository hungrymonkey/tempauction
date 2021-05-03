const { handlePostBody } = require('./handlePostBody.js')
const faunadb = require('faunadb');
const { Add, Create, Collection, Equals, Filter, Get, GT, GTE, If, Index, Lambda, Let, Match, Max, Now, Paginate, Select, ToInteger, Var} = faunadb.query;
const { validateEmail } = require('../utils.js');

export async function handleCreateBid(request, fqlClient) {
	const { headers } = request;
	const contentType = headers.get("content-type") || "";
	const init = {
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			'Access-Control-Allow-Origin': 'http://localhost:3000',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers' : "Content-Type, Origin",
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
		let is_number = Number.isInteger(bidAmount);
		let valid_email = validateEmail(args['email']);
		let bider_name = typeof args['name'] === "string";
		if( !(is_number && valid_email && bider_name)) {
			var body = JSON.stringify({
				contentType: headers.get("content-type"), 
				error_message: "argument Validation Failed",
				error_code: 504,
				endpoint: "createbid",
				arguments: args
			})
			return new Response(body, init)
		}

		try {
			var auction_ref = await fqlClient.query(Get(Match(Index("auction_by_name"), "dummy")));
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
		}
		let auctionString = args['auction']
		let nameString = args['name']
		let emailString = args["email"]
		try {
			let results = await fqlClient.query(
				Let({
					  newBid: ToInteger(bidAmount),
					  newEmail: emailString,
					  newBid: bidAmount, 
					  newName: nameString,
					  maxBid: Max(
						Filter(
						  Paginate(Match(Index("bid_by_amount_desc"))),
						  Lambda(
							"Y",
							Let(
							  { auctionRef: Select(1, Var("Y")) },
							  Equals(Select(["data", "name"], Get(Var("auctionRef"))), auctionString)
							)
						  )
						)
					  )
					},
					Let(
					  {
						oldBidAmount: Select(["data", 0, 0], Var("maxBid")),
						bid: Get(Select(["data", 0, 2], Var("maxBid"))),
						bidIncrement: Select(["data","bid_increment"], Get(Select(["data", 0, 1], Var("maxBid"))))
					  },
					  If(GT(Add(Var("oldBidAmount"), Var("bidIncrement")), Var("newBid")), { data: {
							error_message : "bid increment too small",
							minium_bid : Add(Var("oldBidAmount"), Var("bidIncrement")),
							arguments: args,
							error_code : 510
						}},
						If(Equals(Select(["data", "email"], Var("bid")), emailString), { data: { 
									error_message: "email is bidding twice",
									arguments: args,
									error_code : 511
							}},
							If(GT(Select(["data", "timestamp"], Var("bid")), Now()),
								{ data: {error_message : "bidder trying to move back in time", error_code:512 }},
								Create(Collection("bid"), {
									data: {
										email: Var("newEmail"),
										name: Var("newEmail"),
										amount: Var("newBid"),
										timestamp:  Now(),
										auctionRef: Select(
											"ref",
											Get(Match(Index("auction_by_name"), auctionString))
										)
									}
								})
							)
						  )
						)
					  
					)
				)
			)
			/*
			let results2 = await fqlClient.query(
				Let({
					Arr: Filter(
						Paginate(Match(Index("bid_by_amount_desc"))),
						Lambda(
							"Y",
							Let(
								{ auctionRef: Select(1, Var("Y")) },
								Equals(Select(["data", "name"], Get(Var("auctionRef"))), "mummy")
							)
						)
						)
					},
					If(IsEmpty(Var("Arr")), {
							"message" : "empty"
						},{
							"message" : "not empty"
						}
					)
				)
			)*/
			console.log(results)
			  
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