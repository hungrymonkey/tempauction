<?php
/*
Plugin Name: aaae 2021 auction
Description: The auction widget it built with reactjs and uses a cors cloudflare workers backend
Version: 1.0
*/



function enqueue_scripts(){
   wp_enqueue_script('react-17', 'https://unpkg.com/react@17/umd/react.production.min.js', [], '17.0.2');
   wp_enqueue_script('react-dom-17', 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js', [], '17.0.2');
   wp_enqueue_script('aaae-auction_widget', plugin_dir_url( __FILE__ ) . 'index.js', [], '1.0', true);         
}
add_action('wp_enqueue_scripts', 'enqueue_scripts');

function handle_shortcode() {
    return 'My Latest Posts Widget';
}
add_shortcode('aaae-auction', 'handle_shortcode');

?>
