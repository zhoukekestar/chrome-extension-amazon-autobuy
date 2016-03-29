;( function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define("alertMsg", [ "jquery" ], factory );
	} else {
		factory( jQuery );
	}
}( function( $ ) {
	$.alertMsg = function( options ) {

		if ( typeof( options ) == "string" ) {

			// If options is string, set default value and overwrite options's content.
			options = $.extend( {}, $.alertMsg.defaults, { content:options } );
		} else {

			// Mix defaults and options
			options = $.extend( {}, $.alertMsg.defaults, options );
		}

		var alertMsgCSS = {
			"color": "#FFF",
			"font-size": "18px",
			"background-color": "rgba(0, 0, 0, 0.8)",
			"border-radius": "10px",
			"box-sizing": "border-box",
			"text-align": "center",
			"z-index": "99999",
			"word-break": "break-word",
			"padding": "12px",
			"position": "fixed",
			"left": "50%",
			"top": "50%",
			"text-shadow": "none",
			"width": options.width,
		    "margin-left": ( -options.width / 2 ),
		    "opacity": 0
		};

		// Add html to body, then show it.
		$( options.body ).append( '<div class="alert-msg-content" style="display:none">' + options.content + '</div>' );
		$( ".alert-msg-content" ).css( alertMsgCSS ).show();

		// middle height
		$( ".alert-msg-content" ).css( {"margin-top": ( -$(".alert-msg-content").outerHeight() / 2) } );

		// Show & Hide.
		$( ".alert-msg-content" ).animate( { opacity: 1 }, "slow" );
		if ( options.autohide ) {
			
			setTimeout( function() {
				$( ".alert-msg-content" ).animate( { opacity: 0 }, "slow", function() {
					$( ".alert-msg-content" ).remove();
					if (typeof options.done == "function")
						options.done();
				});
			}, options.time );
		}
	};

	$.alertMsg.defaults = {
        width: 160,
        content: "?",
        done: null,
        time:2200,
        autohide: true,
        body: "body",
        debug: false
    };

	$.alertMsg.remove = function( done ) {
		$( ".alert-msg-content" ).animate( { opacity: 0 }, "slow", function() {
			$( ".alert-msg-content" ).remove();
			done === null ? "" : done();
		} );
	};
	
	return $;
}));