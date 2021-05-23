import landscape2021 from "../assets/aaae2021/japan-a-reverence-for-beauty.jpg"
import soft_all_2021 from "../assets/aaae2021/sofi-all-access-tour.jpg"
import soft_standard_2021 from "../assets/aaae2021/sofi-standard-tour.jpg"
import champagne2021 from "../assets/aaae2021/veuve-clicquot-champagne.jpg"

export default function auctionAssetLoader(auction_name) {
	let aaae_2021 = {
		"champagne": 0,
		"sofi-all-access-tour": 1,
		"sofi-standard-tour": 2,
		"landscape-book": 3
	}
	switch(aaae_2021[auction_name]) {
		case 0:
			return champagne2021
		case 1:
			return soft_all_2021
		case 2:
			return soft_standard_2021
		case 3:
			return landscape2021
		default:
			return null
	}
}