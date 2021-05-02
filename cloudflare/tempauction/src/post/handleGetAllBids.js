const { handlePostBody } = require('./handlePostBody.js')
const faunadb = require('faunadb');
const {Equals,  Filter, Get, Index, Lambda, Let,  Map, Match, Merge, Paginate, Select, Var} = faunadb.query;


export async function handleGetAllBids(request, fqlClient) {
	const { headers } = request;
	const contentType = headers.get("content-type") || "";
	const init = {
		headers: {
			'content-type': 'application/json',
			'Access-Control-Allow-Origin': 'http://localhost:3000',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers' : "Content-Type",
			'status': 404
		}
	}
	if (contentType.includes("application/json") || contentType.includes("form")) {
		var args = await handlePostBody(request);
	} else {
		let body = JSON.stringify({
			contentType: headers.get("content-type"), 
			error_message: "contentType unsupported",
			error_code: 200,
			endpoint: "getallbids",
			supportedContentTypes: ["application/x-www-form-urlencoded", "application/json"]
		});
		return new Response(body, init)
	}
	if ( args.hasOwnProperty('auction') ) {
		try {
			let results = await fqlClient.query(
				Map(
					Filter(
						Paginate(Match(Index("bid_by_amount_desc"))),
						Lambda("Y", 
							Let({ auctionRef: Select(1, Var("Y"))},
								Equals(Select(["data", "name"], Get(Var("auctionRef"))), args["auction"])
							)
						)
					),
					Lambda(
					"X", Let({
							auction: Get(Select(1, Var("X"))), bid: Get(Select(2, Var("X")))
						},
						Merge(
							Merge(Select(["data"], Var("bid")), {"ts": Select("ts", Var("bid"))}),
							Merge( 
								{"auction_end": Select(["data", "auction_end"], Var("auction")) },
								{"auction_name": Select(["data", "name"], Var("auction")) }
							),
						)
					)
					)
				)
			)
			if( results["data"].length > 0) {
				init["status"] = 200;
				var body = JSON.stringify({result: results["data"], error_code: 0});
			} else {
				let results = await fqlClient.query(Get(Match(Index("auction_by_name"), args["auction"])))
				if(results.ts > 0){
					init["status"] = 200;
					var body = JSON.stringify({
						contentType: headers.get("content-type"), 
						error_message: args["auction"] + " has zero bids",
						results: [],
						error_code: 0,
						endpoint: "getallbids",
						arguments: args
					})
				}
			}
		} catch (exception) {
			console.log(exception)
			var body = JSON.stringify({
				contentType: headers.get("content-type"), 
				error_message: "auction not found",
				error_code: 202,
				endpoint: "getallbids",
				arguments: args
			})
			return new Response(body, init)
		}
		//var result = "TODO";
	} else {
		var body = JSON.stringify({
			contentType: headers.get("content-type"), 
			error_message: "auction argument not found",
			error_code: 201,
			endpoint: "getallbids",
			arguments: args
		})

	}
	return new Response(body, init)
}