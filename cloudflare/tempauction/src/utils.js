export function customFetch (url, params) {
  const signal = params.signal;
  delete params.signal;

  const abortPromise = new Promise((resolve) => {
    if (signal) {
      signal.onabort = resolve
    }
  });
  return Promise.race([abortPromise, fetch(url, params)])
}

export function getFaunaError (error) {

  const {code, description} = error.requestResult.responseContent.errors[0];
  let status;

  switch (code) {
    case 'instance not found':
      status = 404;
      break;
    case 'instance not unique':
      status = 409;
      break;
    case 'permission denied':
      status = 403;
      break;
    case 'unauthorized':
    case 'authentication failed':
      status = 401;
      break;
    default:
      status = 500;
  }
  return {code, description, status};
}
function dateToUTC(dateObj) {
  let y = dateObj.getUTCFullYear();
  let m = dateObj.getUTCMonth().toString().padStart(2,'0');
  let d = dateObj.getUTCDay().toString().padStart(2,'0');
  let h = dateObj.getUTCHours().toString().padStart(2,'0');
  let min = dateObj.getUTCMinutes().toString().padStart(2,'0');
  let s = dateObj.getUTCSeconds().toString().padStart(2,'0');
  return `${y}-${m}-${d}T${h}:${min}:${s}Z`;
}
//TODO: Needs to covert dateobj from epoch

export function UTCtoDate(utcString) {
  return Date.parse(utcString);
}