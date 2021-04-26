const Router = require('./router')

import faunadb from 'faunadb';
import {customFetch, getFaunaError} from './utils.js';

import { handleGetMaxBid } from './post/handleGetMaxBid.js';


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
  //request.route
  const body = JSON.stringify({ some: 'json', url: request.url, json: request.cf, invalid: NOTSECRET })
  return new Response(body, init)
}

async function handleRequest(request) {
  const r = new Router()
  // Replace with the appropriate paths and handlers
  r.get('.*/bar', () => new Response('responding for /bar'))
  r.get('.*/foo', request => handler(request))
  r.post('.*/getmaxbid', request => handleGetMaxBid(request, faunaClient))
  r.get('/', () => new Response('Hello worker!')) // return a default message for the root route

  const resp = await r.route(request)
  return resp
}