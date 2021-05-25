<?php
/*
 * Plugin Name: aaae 2021 auction
 * Description: The auction widget it built with reactjs and uses a cors cloudflare workers backend. Shortcode: [aaae-auction]
 * Author: Ted Chang
 * Version: 1.0.0
 */
// Guide https://www.digitalocean.com/community/tutorials/how-to-embed-a-react-application-in-wordpress-on-ubuntu-18-04
// https://developer.wordpress.org/reference/files/wp-includes/plugin.php/

defined( 'ABSPATH' ) or die( 'Direct script access diallowed.' );

define( 'AAAE_AUCTION_WIDGET_PATH', plugin_dir_path( __FILE__ ) . 'widget' );
define( 'AAAE_AUCTION_ASSET_MANIFEST', AAAE_AUCTION_WIDGET_PATH . '/build/asset-manifest.json' );
define( 'AAAE_AUCTION_INCLUDES', plugin_dir_path( __FILE__ ) . '/includes' );
//define( 'AAAE_AUCTION_WIDGET_ENQUEUE_PATH', plugins_url("/widget/build/", __FILE__) );
require_once( AAAE_AUCTION_INCLUDES . '/enqueue.php' );



//https://developer.wordpress.org/reference/functions/add_rewrite_rule/
//https://wordpress.stackexchange.com/questions/231362/how-to-rewrite-the-url
//https://wordpress.stackexchange.com/questions/141072/how-does-routing-on-wordpress-work/141087#141087
//https://roots.io/routing-wp-requests/
function aaae_action_rewrite_route(){
    global $wp_rewrite;
    add_rewrite_rule(
        '^2021-silent-auction/auction/(.+?)/?$',
        'index?pagename=2021-silent-auction&auctionid=$matches[1]','top');
        $wp_rewrite->flush_rules();
}
add_action('init', 'aaae_action_rewrite_route');

//https://codex.wordpress.org/Shortcode_API
//https://developer.wordpress.org/reference/functions/shortcode_atts/
function handle_shortcode( $atts ) {
    $default_atts = array('auctionid' => '');
    $args = shortcode_atts( $default_atts, $atts );
    console.log(implode(",", $args));
    return "<div id='aaae-auction-2021' auctionid={$args['auctionid']}></div>";
}
add_shortcode('aaae-auction', 'handle_shortcode');

?>
