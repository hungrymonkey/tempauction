
const faunadb = require('faunadb');
const {Get, Index, Lambda,  Map, Match, Paginate, Var} = faunadb.query;

export async function handleGetAllAuctions(request, fqlClient) {
	const { headers } = request;
	const contentType = headers.get("content-type") || "";
	const init = {
		headers: { 'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': 'http://localhost:3000',
		'Access-Control-Allow-Methods': 'GET',
		"Access-Control-Allow-Headers" : "Content-Type"
		},
		status: 500
	}
	try {
		let results = await fqlClient.query(
			Map(
				Paginate(
					Match(Index("all_auctions"))
				),
				Lambda("X", Get(Var("X")))
			)
		)
		var body = JSON.stringify({result: results["data"], error_code: 0});
		init["status"] = 200
	} catch (exception) {
		console.log(exception)
		var body = JSON.stringify({
			contentType: headers.get("content-type"), 
			error_message: "auction not found",
			error_code: 502,
			endpoint: "createbid",
			arguments: args
		})
		
	}
	return new Response(body, init)
	//var result = "TODO";
}