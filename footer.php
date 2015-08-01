<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package ToDo
 */

?>

	<footer id="colophon" class="site-footer" role="contentinfo">
		<div class="site-info">
			Powered by <a href="<?php echo esc_url( __( 'http://wordpress.org/', 'todo' ) ); ?>"><?php printf( esc_html__( '%s', 'todo' ), 'WordPress' ); ?></a>
			<span class="sep"> &amp; </span>
			Crafted with <i class="fa fa-heart"><span class="screen-reader-text">Love</span></i> by <a href="https://github.com/Daronspence">Daron Spence</a>
		</div><!-- .site-info -->
	</footer><!-- #colophon -->

	</div><!-- #content -->

	<div class="popup mfp-hide">
		<h3>Invite a Friend!</h3>
		<p>Invite a friend and enjoy the feeling of being awesome!</p>
		<form method="POST" id="invite-friend" action"/index.php">
			<label>Email:
				<input id="friend-email" name="friend-email" type="email" placeholder="my-friend@gmail.com" required />
			</label>
			<input id="invite-submit" type="submit" value="Invite!">
		</form>
	</div>
	
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
