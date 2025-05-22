window.$ = jQuery;

$(document).on('click', '.load-more .button', function(){

	var button = $(this),
        post_type = button.data('post-type'),
		data = {
			'action': 'load_more',
			'query': load_more.posts,
			'page' : load_more.current_page,
			'nonce': load_more.nonce
		};

	$.ajax({
		url : load_more.ajaxurl,
		data : data,
		type : 'POST',
		beforeSend : function ( xhr ) {
			button.text('Loading..');
		},
		success : function( data ){
			if( data ) {
				button.text( 'View more..' );
				$('.' + post_type + '-list').append(data);

				load_more.current_page++;
				if ( load_more.current_page == load_more.max_page )
					button.remove();

                $('.animate').each(function(){
                    var obj = $(this);
                    new ScrollMagic.Scene({triggerElement: $(this)[0], duration: 100, triggerHook: 0.9})
                        .on('enter', function(e){
                            obj.removeClass('animate').addClass('animated');
                        })
                        .addTo(controller);
                });

			} else {
				button.remove();
			}
		}
	});
});