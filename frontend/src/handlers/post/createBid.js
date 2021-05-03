
import { json2formEncoded } from '../../utils';

export async function createBid(json) {

	const DB_URL = 'https://tempauction.tedchang2010.workers.dev/createbid';
	
	const response = await fetch(DB_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: json2formEncoded(json)
	});
	const data = await response.json();
	console.log("**** post: create bid " + JSON.stringify(data).length  )
	return data;
}
