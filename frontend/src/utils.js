
export function dateToUTC(dateObj) {
	let y = dateObj.getUTCFullYear();
	let m = (dateObj.getUTCMonth()+1).toString().padStart(2,'0');
	let d = dateObj.getUTCDate().toString().padStart(2,'0');
	let h = dateObj.getUTCHours().toString().padStart(2,'0');
	let min = dateObj.getUTCMinutes().toString().padStart(2,'0');
	let s = dateObj.getUTCSeconds().toString().padStart(2,'0');
	return `${y}-${m}-${d}T${h}:${min}:${s}Z`;
  }
  
export function UTCtoDate(utcString) {
	let d = new Date();
	d.setTime(Date.parse(utcString))
	return d;
}

export function formatLocalDate(dateObj) {
	const options = {
		year: 'numeric', month: 'numeric', day: 'numeric',
		hour: 'numeric', minute: 'numeric', second: 'numeric',
		hour12: true,
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		timeZoneName: 'short'
	}
	//return dateObj.toString()
	return new Intl.DateTimeFormat('en-US', options).format(dateObj)
}