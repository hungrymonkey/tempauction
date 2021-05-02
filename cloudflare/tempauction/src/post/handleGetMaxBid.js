
const { handlePostBody } = require('./handlePostBody.js')
const faunadb = require('faunadb');
const {Equals,  Filter, Get, Index, Lambda, Let,  Map, Match, Max, Merge, Paginate, Select, Var} = faunadb.query;

export async function handleGetMaxBid(request, fqlClient) {
	const { headers } = request;
	const contentType = headers.get("content-type") || "";
	const init = {
		headers: {
			'content-type': 'application/json',
			'Access-Control-Allow-Origin': 'http://localhost:3000',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Headers' : "Content-Type"
		}
	}
	if (contentType.includes("application/json") || contentType.includes("form")) {
		var args = await handlePostBody(request);
	} else {
		let body = JSON.stringify({
			contentType: headers.get("content-type"), 
			error_message: "contentType unsupported",
			error_code: 100,
			endpoint: "getmaxbid",
			supportedContentTypes: ["application/x-www-form-urlencoded", "application/json"]
		});
		return new Response(body, init)
	}
	if ( args.hasOwnProperty('auction') ) {
		try {
			let results = await fqlClient.query(
				Map(
					Max(
					Filter(
						Paginate(Match(Index("bid_by_amount_desc"))),
						Lambda("Y", 
						Let({ auctionRef: Select(1, Var("Y"))},
							Equals(Select(["data", "name"], Get(Var("auctionRef"))), args["auction"])
						)
					)
					)),
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
			var body = JSON.stringify({result: results["data"][0]});
		} catch (exception) {
			console.log(exception)
			var body = JSON.stringify({
				contentType: headers.get("content-type"), 
				error_message: "auction not found",
				error_code: 102,
				endpoint: "getmaxbid",
				arguments: args
			})
			return new Response(body, init)
		}
		//var result = "TODO";
	} else {
		var body = JSON.stringify({
			contentType: headers.get("content-type"), 
			error_message: "auction argument not found",
			error_code: 101,
			endpoint: "getmaxbid",
			arguments: args
		})

	}
	return new Response(body, init)
}