export async function handleCreateBidOptions(request) {
	const init = {
		headers: { 
			'Content-type': 'application/json',
			'Access-Control-Allow-Origin': 'http://localhost:3000',
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers" : "Content-Type, Origin",
			
		},
		status : 200
	}
	return new Response(JSON.stringify({status: "OK"}), init);
}
