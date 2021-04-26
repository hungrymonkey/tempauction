/** 
 * rawHtmlResponse returns HTML inputted directly 
 * into the worker script 
 * @param {string} html
 */
function rawHtmlResponse(html) {
	const init = {
		headers: {
			"content-type": "text/html;charset=UTF-8",
		},
	}
	return new Response(html, init)
}
/**
 * handlePostBody reads in the incoming request body
 * Use await handlePostBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from 
 */
export async function handlePostBody(request){
	const { headers } = request
	const contentType = headers.get("content-type") || ""

	if (contentType.includes("application/json")) {
		return await request.json()
	} else if (contentType.includes("application/text")) {
		return await request.text()
	} else if (contentType.includes("text/html")) {
		return await request.text()
	} else if (contentType.includes("form")) {
		const formData = await request.formData()
		const body = {}
		for (const entry of formData.entries()) {
			body[entry[0]] = entry[1]
		}
		return body
	}  else {
		const myBlob = await request.blob()
		return myBlob
	}
}