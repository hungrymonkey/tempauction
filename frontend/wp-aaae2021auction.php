<?php
/*
Plugin Name: aaae 2021 auction
Description: The auction widget it built with reactjs and uses a cors cloudflare workers backend
Version: 1.0
*/

function handle_shortcode() {
    return 'My Latest Posts Widget';
}
add_shortcode('auction_widget', 'handle_shortcode');


function enqueue_scripts(){
   global $post;
   if(has_shortcode($post->post_content, "auction_widget")){
      wp_enqueue_script('react', 'https://unpkg.com/react@17/umd/react.production.min.js', [], '17.0.2');
      wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js', [], '17.0.2');
      wp_enqueue_script('auction_widget', plugin_dir_url( __FILE__ ) . 'index.js', [], '1.0', true);         
   }           
}
add_action('wp_enqueue_scripts', 'enqueue_scripts');

?>
