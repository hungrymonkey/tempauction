const { handlePostBody } = require('./handlePostBody.js')
const faunadb = require('faunadb');
const { Create, Collection, Equals, Filter, Get, GTE, If, Index, Lambda, Let, Match, Max, Now, Paginate, Select, Var} = faunadb.query;
const { validateEmail } = require('../utils.js');

export async function handleCreateBid(request, fqlClient) {
	const { headers } = request;
	const contentType = headers.get("content-type") || "";
	const init = {
		headers: { 'content-type': 'application/json' },
	}
	
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
		let is_number = Number.isInteger(args['bid_amount']);
		let valid_email = validateEmail(args['email']);
		let bider_name = typeof args['name'] === "string";
		if( !(is_number && valid_email && bider_name)) {
			var body = JSON.stringify({
				contentType: headers.get("content-type"), 
				error_message: "argumented Validation Failed",
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
		let bidAmount = args['bid_amount']
		let emailString = args["email"]
		try {
			let results = await fqlClient.query(
				Let(
					{
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
						amount: Select(["data", 0, 0], Var("maxBid")),
						bid: Get(Select(["data", 0, 2], Var("maxBid"))),
						bidIncrement: Select(["data","bid_increment"], Get(Select(["data", 0, 1], Var("maxBid"))))
					  },
					  If(
						GTE(Var("amount"), bidAmount),
						Var("bid"),
						If(
						  Equals(Select(["data", "email"], Var("bid")), emailString),
						  Var("bid"),
						  Create(Collection("bid"), {
							data: {
							  email: emailString,
							  name: nameString,
							  amount: bidAmount,
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