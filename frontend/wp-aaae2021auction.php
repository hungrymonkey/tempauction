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
define( 'AAAE_AUCTION_WIDGET_ENQUEUE_PATH', plugins_url("/widget/build/", __FILE__) );
require_once( AAAE_AUCTION_INCLUDES . '/enqueue.php' );



//https://developer.wordpress.org/reference/functions/add_rewrite_rule/
/*
function aaae_action_rewrite_route(){
    add_rewrite_rule('^2021-silent-auction/(.+)?', ,'top')
}*/
//add_action('init', 'aaae_action_rewrite_route');

//https://developer.wordpress.org/reference/functions/shortcode_atts/
function handle_shortcode( $atts ) {
    $default_atts = array();
    $args = shortcode_atts( $default_atts, $atts );
    return "<div id='aaae-auction-2021'></div>";
    //return "<div>aaae-auction-shortcode</div>";
}
add_shortcode('aaae-auction', 'handle_shortcode');

?>
