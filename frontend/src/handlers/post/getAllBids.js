
export async function getAllBids(name) {
	const DB_URL = 'https://tempauction.tedchang2010.workers.dev/getallbids';
	
	const response = await fetch(DB_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: "auction=" + name 
	});
	const data = await response.json();
	console.log("**** fetched: all auctions " + JSON.stringify(data).length  )
	return data["result"];
}
