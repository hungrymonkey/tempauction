export async function handleGetAllAuctionsOptions(request) {
	const init = {
		headers: { 
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin': 'http://localhost:3000',
			"Access-Control-Allow-Methods": "OPTIONS,GET",
			"Access-Control-Allow-Headers" : "Content-Type, Origin, x-requested-with",
			"status" : 200
		}
	}
	return new Response(JSON.stringify({status: "OK"}), init);
}
