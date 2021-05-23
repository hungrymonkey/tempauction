export default function json2formEncoded(json) {
	return new URLSearchParams(Object.entries(json)).toString();
}