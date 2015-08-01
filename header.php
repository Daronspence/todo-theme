<?php
/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package ToDo
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta charset="UTF-8">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700:latin' rel='stylesheet' type='text/css'>

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="hfeed site">
	<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'todo' ); ?></a>

	<header id="masthead" class="site-header" role="banner">
		<div class="site-branding">
			<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
			<p class="site-description"><?php bloginfo( 'description' ); ?></p>
		</div><!-- .site-branding -->

		<!--<nav id="site-navigation" class="main-navigation" role="navigation">
		 	<button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><?php esc_html_e( 'Primary Menu', 'todo' ); ?></button> 
			<?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu_id' => 'primary-menu' ) ); ?>
		</nav>--><!-- #site-navigation -->

		<div class="account-info">
			<div class="avatar-wrap">
				<?php echo get_avatar( get_current_user_id(), 200 ); ?>
				<div class="username">
					<?php echo get_user_meta( get_current_user_id(), 'nickname', true ); ?>
				</div>
			</div>
			
			<div class="loginout">

				<?php wp_loginout( '/' ); ?>
				<span class="sep"> | </span>
				<span class="edit-profile"><?php echo is_user_logged_in() ? '<span id="nickname-edit"></span><span id="nickname-save">Save Profile</span>' : wp_register( '', '', false ); ?></span></div>

			<button id="open-invite">Invite a Friend</button>

		</div>
	</header><!-- #masthead -->

	<div id="content" class="site-content">
