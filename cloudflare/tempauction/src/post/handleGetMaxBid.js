
import { handlePostBody } from './handlePostBody.js'
import faunadb from 'faunadb';
const {Match, Index, Get, Map, Max, Paginate, Lambda, Filter, Equals, Select, Let, Var} = faunadb.query;

export async function handleGetMaxBid(request, fqlClient) {
	const { headers } = request;
	const contentType = headers.get("content-type") || "";
	const init = {
		headers: { 'content-type': 'application/json' }
	}
	if (contentType.includes("application/json") || contentType.includes("form")) {
		var args = await handlePostBody(request);
		console.log(JSON.stringify(args))
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
		const results = await fqlClient.query(
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
				  "X", 
				  Let({
					auctionRef: Select(1, Var("X")), bidRef: Select(2, Var("X"))
					},
					Merge(Get(Var("bidRef")), Select(["data"], Get(Var("auctionRef"))))
				  )
				)
			)
		)
		//var result = "TODO";
		var body = JSON.stringify({result: results});
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