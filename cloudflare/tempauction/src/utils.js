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
export function dateToUTC(dateObj) {
  let y = dateObj.getUTCFullYear();
  let m = (dateObj.getUTCMonth()+1).toString().padStart(2,'0');
  let d = dateObj.getUTCDate().toString().padStart(2,'0');
  let h = dateObj.getUTCHours().toString().padStart(2,'0');
  let min = dateObj.getUTCMinutes().toString().padStart(2,'0');
  let s = dateObj.getUTCSeconds().toString().padStart(2,'0');
  return `${y}-${m}-${d}T${h}:${min}:${s}Z`;
}

function UTCtoDate(utcString) {
  let d = new Date();
  d.setTime(Date.parse(utcString))
  return d;
}
export function validateBidAmount(num) { return Number.isInteger(num); }

export function validateEmail(email) {
  //http://emailregex.com/
  let email_re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email_re.test(email);
}