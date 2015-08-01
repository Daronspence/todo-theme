<?php
/**
 * Template Name: ToDo List
 */

get_header();

?>

<?php if ( is_user_logged_in() ) : ?>

	<h2>What do you need to do?</h2>
	<div id="messages"></div>

<form method="GET" action="/index.php" id="add-item-form">
	<input type="hidden" value="<?php echo get_current_user_id(); ?>" id="current-user" name="author" />
	<input type="text" class="add-item-input" id="add-item-input" name="todo-item-add" placeholder="Buy Milk" maxlength='140' required />
	<input type="submit" value="Add Item" id="add-item-submit" class="button" />
	<?php wp_nonce_field( 'add-item' ); ?>
</form>
<div id="on-load"><span>Loading Saved Items<div class="loading"></div><span></div>
<ul class="list-wrapper" id="list">
	

</ul>
<button id="clear-all" class="button">Clear All Items</button>

<template id="list-item-template">
	<li class='item'>
		<input type='checkbox' class='item-finished' {{checked}}>
		<input type='text' value='{{{value}}}' id='todo-id-{{id}}' data-id='{{id}}' maxlength='140' {{disabled}} />
		<button class='remove'>
			<i class='fa fa-times'></i>
			<span class='screen-reader-text'>Remove Item</span>
		</button>
	</li>
</template>

<?php else :?>

	<h2>Please <a href="/wp-login.php">Login</a> or <a href="wp-login.php?action=register">Sign-Up</a> to use this service.</h2>

<?php endif;

get_footer();