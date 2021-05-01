


export function handleCreateBid(request) {
	const init = {
		headers: { 'content-type': 'application/json' },
	}
	
	const body = JSON.stringify({ some: 'json' })
	return new Response(body, init)
  }