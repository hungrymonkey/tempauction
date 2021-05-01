

export async function fetchAllAuctions() {
	const DB_URL = 'https://tempauction.tedchang2010.workers.dev/getallauctions';
	const response = await fetch(DB_URL);
	const data = await response.json();
	console.log("**** fetched: all auctions " + JSON.stringify(data).length  )
	return data["result"];
}
