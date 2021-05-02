
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