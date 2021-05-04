
const faunadb = require('faunadb');
const { 
		Format, Get, Index, Lambda, 
		Map, Match, Merge, 
		Paginate, Select, Var
	} = faunadb.query;


export async function handleGetAllAuctions(request, fqlClient) {
	const { headers } = request;
	const contentType = headers.get("content-type") || "";
	const init = {
		headers: { 'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': 'http://localhost:3000',
		'Access-Control-Allow-Methods': 'GET',
		"Access-Control-Allow-Headers" : "Content-Type"
		},
		status: 404
	}
	try {
		let results = await fqlClient.query(
			Map(
				Paginate(
					Match(Index("all_auctions"))
				),
				Lambda("X", 
				  Merge(Get(Var("X")), 
					{ "data": Merge( Select(["data"], Get(Var("X"))), 
					  {"auction_end": Format('%T', Select(["data", "auction_end"], Get(Var("X")) ))}
					)}
				  )
				)
			)
		)
		var body = JSON.stringify({result: results["data"], error_code: 0});
		init["status"] = 200
	} catch (exception) {
		console.log(exception)
		var body = JSON.stringify({
			error_message: "auction not found",
			error_code: 502,
			results: [],
			endpoint: "createbid",
		})
		
	}
	return new Response(body, init)
	//var result = "TODO";
}