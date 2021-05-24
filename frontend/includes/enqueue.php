<?php
// This file enqueues scripts and styles

defined( 'ABSPATH' ) or die( 'Direct script access diallowed.' );

add_action( 'init', function() {

  add_filter( 'script_loader_tag', function( $tag, $handle ) {
    if ( ! preg_match( '/^aaae-auction-/', $handle ) ) { return $tag; }
    return str_replace( ' src', ' async defer src', $tag );
  }, 10, 2 );

  add_action( 'wp_enqueue_scripts', function() {
	$asset_manifest = json_decode( file_get_contents( AAAE_AUCTION_ASSET_MANIFEST ), true )['files'];
	$base_asset_url = get_site_url();
    if ( isset( $asset_manifest[ 'main.css' ] ) ) {
      wp_enqueue_style( 'aaae-auction', $base_asset_url . $asset_manifest[ 'main.css' ] );
    }

    wp_enqueue_script( 'aaae-auction-runtime', $base_asset_url . $asset_manifest[ 'runtime-main.js' ], array(), null, true );

    wp_enqueue_script( 'aaae-auction-main', $base_asset_url . $asset_manifest[ 'main.js' ], array('aaae-auction-runtime'), null, true );

    foreach ( $asset_manifest as $key => $value ) {
      if ( preg_match( '@static/js/(.*)\.chunk\.js@', $key, $matches ) ) {
        if ( $matches && is_array( $matches ) && count( $matches ) === 2 ) {
          $name = "aaae-auction-" . preg_replace( '/[^A-Za-z0-9_]/', '-', $matches[1] );
          wp_enqueue_script( $name, $base_asset_url . $value, array( 'aaae-auction-main' ), null, true );
        }
      }

      if ( preg_match( '@static/css/(.*)\.chunk\.css@', $key, $matches ) ) {
        if ( $matches && is_array( $matches ) && count( $matches ) == 2 ) {
          $name = "aaae-auction-" . preg_replace( '/[^A-Za-z0-9_]/', '-', $matches[1] );
          wp_enqueue_style( $name, $base_asset_url . $value, array( 'aaae-auction' ), null );
        }
      }
    }
  });
});