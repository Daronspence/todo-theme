/* jshint devel : true */
/* global _, jQuery, confirm */

var todo = (function( $ ){

	// Cache the DOM
	var $list = $('#list');
	var $form = $('#add-item-form');
	var $itemInput = $('#add-item-input');
	var $currentUserID = $('#current-user').val();
	var $clearAll = $('#clear-all');
	var $nonce = $('#_wpnonce').val();
	var $onLoadContainer = $('#on-load');
	var $messages = $('#messages');
	var $listItemTemplate = $('#list-item-template').html();
	var $nicknameEdit = $('#nickname-edit');
	var $inviteButton = $('#open-invite');

	var timer;

	function listItemHTML( value, id, finished ) {
		if ( id === undefined ){ // if id is missing
			id = '';
		}

		data = {
			value : value,
			id : id
		}

		if ( finished === 'closed' ){
			data.checked = 'checked';
			data.disabled = 'disabled';
		}

		return Mustache.render( $listItemTemplate, data );

	}

	function clearAllItems(){

		if ( $('#list').html().trim() === '' ){
			flashSuccess( "Cheatin' Huh?");
			return;
		}

		if ( ! confirm( 'Are you sure you want to delete all your To-Do Items?!?!' ) ){
			return;
		}

		$.each( $('.item') , function( key, val ){ 
			removeToDo( val, false ); 
		} );

		flashSuccess('All Items Removed');

		return true;

	}

	function flashSuccess( message ){
		
		$messages.append('<p class="success">' + message + '</p>');

		var $lastAdded;

		window.setTimeout( function(){
			$lastAdded = $messages.find( '.success' ).last();
			$lastAdded.addClass('in');

			window.setTimeout( function(){
				$lastAdded.removeClass('in');
				window.setTimeout( function(){
					$lastAdded.remove();
				}, 500 );
			}, 2000 );

		}, 50 );
		
	}

	function bindKeyUp(){

		$('.item input[type="text"]').off();

		$('.item input[type="text"]').on( 'keyup', { this: this } , function(){
			
			clearInterval(timer);  //clear any interval on key up

			var _this = this;

		    timer = setTimeout(function() {

		    	var id = $(_this).attr('data-id');
		    	var val = _.escape( $(_this).val() );

		    	$.ajax({
		    		type : 'POST',
		    		url  : '/index.php',
		    		data : {
		    			_wpnonce : $nonce,
		    			todo_item_edit : id,
		    			value : val,
		    			author : $currentUserID,
		    		},
		    		success : function( data ){
		    			if ( 'success' === data ){
		    				flashSuccess( 'Item Successfully Synced!');
		    			}
		    		}
		    	});

		    }, 500);

		} );

	}

	function formSubmit( e ){

		e.preventDefault();

		// escape input and trim to 140 characters
		var val = _.escape( $itemInput.val().substring(0, 140) );

		$list.prepend( listItemHTML( val ) );

		$itemInput.val('');

		var added = $('.item input[type="text"]').first();

		$.ajax({
			type : 'POST',
			url  : '/index.php',
			data : {
				author : $currentUserID,
				todo_item_add : $(added).val(),
				_wpnonce : $nonce
			},
			success : function( data ){
				data = JSON.parse(data);

				$(added).attr('id', 'todo-id-' + data.id );
				$(added).attr('data-id', data.id );

				flashSuccess( 'Item Successfully Added!' );
			}

		});

		bindKeyUp();

	}

	function removeToDo( el, message ){

		var $item;

		if ( $(this).attr('class') === 'item' ){
			$item = $(this); // make it a jQuery object
		} else if (  $(el).attr('class') === 'item' ) {
			$item = $(el);
		} else {
			$item = $(this).parent('li');
		} 

		var id = $item.children('input[type="text"]').attr('data-id');

		console.log( id );
		
		$.ajax({
			type : 'POST',
			url  : '/index.php',
			data : {
				_wpnonce : $nonce,
				todo_item_delete : id,
				author : $currentUserID,
			},
			success : function( data ){

				if ( 'success' === data ){
					$item.slideUp( 300 );
					
					window.setTimeout(function(){
						$item.remove();
					}, 1000 );
				}

				if ( false !== message ){
					flashSuccess( 'Item Successfully Removed!' );	
					return true;
				}
				
			}
		
		});

	}

	function itemFinished(){

		var textbox = $(this).siblings( 'input[type="text"]' );
		var data_id = $(this).siblings( 'input[type="text"]' ).attr( 'data-id' );

		if ( $( textbox ).prop('disabled') ){

			$( textbox ).prop('disabled', false );

			$.ajax({
				type : 'POST',
				url : '/index.php',
				data : {
					_wpnonce : $nonce,
					todo_item_finished : data_id,
					author : $currentUserID,
					finished : false
				},
				success : function( data ){
					// console.log( data );
					// console.log( 'Item Not Finished');
					flashSuccess( 'Item Successfully Updated!');
				},
				error : function( data ){
					alert( 'Something went wrong :( Try again later');
				}
			});

		} else {
			
			$( textbox ).prop('disabled', true );

			$.ajax({
				type : 'POST',
				url : '/index.php',
				data : {
					_wpnonce : $nonce,
					todo_item_finished : data_id,
					author : $currentUserID,
					finished : true
				},
				success : function( data ){
					// console.log( data );
					// console.log( 'Item Finished');
					flashSuccess( 'Item Successfully Updated!');
				},
				error : function( data ){
					alert( 'Something went wrong :( Try again later');
				}
			});
		
		}
	}

	function updateProfile(){

		var username = $('.username').html().trim();

		$('.username').html('<form id="username-form"><input type="text" value="' + username +'" id="edit-username" /></form>');

		$('#nickname-save').on( 'click', saveUsername );

		$('#username-form').on( 'submit', function( e ) {

			e.preventDefault();

			saveUsername();

		});

		$('.edit-profile').addClass('editing');

		$('#edit-username').focus();

	}

	function saveUsername(){

		var newUsername = _.escape( $('#edit-username').val().trim() );

		$('.username').html( newUsername );

		$nicknameEdit.html('Edit Profile');

		$.ajax({
			type : 'POST',
			url  : '/index.php',
			data : {
				_wpnonce : $nonce,
				updateUsername : newUsername,
				author : $currentUserID
			},
			success : function( data ){
				if ( 'success' === data ){
					flashSuccess( 'Username Updated!');
					$('.edit-profile').removeClass('editing');
				}
			}
		});	

	}

	$.ajax('/wp-json/wp/v2/posts?type=todos&filter[author]=' + $currentUserID , {
		success : function( data ){

			// i = return object
			// post = post objects
			$.each( data, function( i, post ){

				$($list).append( listItemHTML( post.title, post.ID, post.comment_status ) );

			} );

			window.setTimeout( function() {

				$($onLoadContainer).addClass('loaded');	

				window.setTimeout( function() {
					$onLoadContainer.remove();
				}, 500 );

			}, 200 );

			bindKeyUp();
			
		},
		error : function(){
			$( $onLoadContainer ).children( 'span' ).html( 'Oops! Something went wrong. :( <br> Try again later.' );
		}

	});

	var listRefresh = window.setInterval( function(){
		if ( undefined !== timer ){
			return;
		}

		$.ajax('/wp-json/wp/v2/posts?type=todos&filter[author]=' + $currentUserID , {
			success : function( data ){

				if ( data.length === 0 && $('.item').length > 0 ){
					location.reload();
				}

				data.reverse();

				// i = return object
				// post = post objects
				$.each( data, function( i, post ){

					if ( $('input[data-id=' + post.ID + ']').length === 1 ){
						return;
					}

					// $($list).prepend( "<li class='item'><input type='checkbox' class='item-finished'><input type='text' value='" + post.title + "' id='todo-id-" + post.ID + "' data-id='" + post.ID + "' '><button class='remove'><i class='fa fa-times'></i><span class='screen-reader-text'>Remove Item</span></button></li>" );
					
					$($list).prepend( listItemHTML( post.title, post.ID, post.comment_status ) );

					flashSuccess( 'New Item Synced Successfully!');

				} );

				if ( undefined !== timer ){
					return;
				}
				
				bindKeyUp();

			}

		});

	}, 5000 );


	// Event Delegation
	$form.on('submit', formSubmit );
	$list.delegate( '.remove', 'click', removeToDo  );
	$list.delegate( '.item-finished', 'click', itemFinished );
	$clearAll.on('click', clearAllItems );
	$nicknameEdit.on( 'click', updateProfile );


	$nicknameEdit.html('Edit Profile');

	$inviteButton.magnificPopup({
	  mainClass : 'mfp-invite',
	  items: {
	      src: '.popup',
	      type: 'inline',
	  }
	});

	return {
		currentUser : $currentUserID,
		flashSuccess : flashSuccess
	};

})( jQuery );