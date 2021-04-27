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
//TODO: Needs to be zeropadded
export function dateToUTC(dateObj) {
  let y = dateObj.getUTCFullYear();
  let m = dateObj.getUTCMonth().toFixed(2);
  let d = dateObj.getUTCDay().toFixed(2);
  let h = dateObj.getUTCHours().toFixed(2);
  let m = dateObj.getUTCMinutes().toFixed(2);
  let s = dateObj.getUTCSeconds().toFixed(2);
  return `${y}-${m}-${d}T${h}:${m}:${s}Z`;
}
export function UTCtoDate(utcString) {
  return Date.parse(utcString);
}