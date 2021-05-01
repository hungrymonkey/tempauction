

export async function fetchAllAuctions() {
	const DB_URL = 'https://tempauction.tedchang2010.workers.dev/getallauctions';
	const response = await fetch(DB_URL);
	const data = await response.json();
	console.log("**** fetched: " + JSON.stringify(data))
	return JSON.stringify(data);
}