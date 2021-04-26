const Router = require('./router')

import faunadb from 'faunadb';
import {customFetch, getFaunaError} from './utils.js';



const faunaClient = new faunadb.Client({
  secret: FAUNA_SECRET,
  fetch: customFetch
});

const {Create, Collection, Match, Index, Get, Ref, Paginate, Sum, Delete, Add, Select, Let, Var, Update} = faunadb.query;

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */

function handler(request) {
  const init = {
      headers: { 'content-type': 'application/json' },
  }
  const body = JSON.stringify({ some: 'json' })
  return new Response(body, init)
}

async function handleRequest(request) {
  const r = new Router()
  // Replace with the appropriate paths and handlers
  r.get('.*/bar', () => new Response('responding for /bar'))

  r.get('/', () => new Response('Hello worker!')) // return a default message for the root route

  const resp = await r.route(request)
  return resp
}