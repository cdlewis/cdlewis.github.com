jQuery( document ).ready( function( $ ) {
    // responsive menu button

    $( '#mobile_menu' ).click( function( event ) {
        event.preventDefault();
        $( '#sidebar' ).toggleClass( 'menu_active' );
    } );

    $( '#river' ).click( function( event ) {
        if( $( '#sidebar' ).hasClass( 'menu_active' ) ) {
            $( '#sidebar' ).removeClass( 'menu_active' );
        }
    } );

    // prettify code
    $( 'pre' ).addClass( 'prettyprint' );
    prettyPrint();

    // print xckd 148
    console.log( '------------------------------------------------\n|                  My Hobby:                   |\n|             Mispronouncing Words             |\n|                                              |\n|  Yeah, did you see what he                   |\n|  said on his wobsite?                        |\n|      \\                         ...His what?  |\n|    Wobsite.                         /        |\n|        \\                     ...I think you  |\n|      Why don\'t you write     mean "website"  |\n|      about it in                /            |\n|      your blag?                /             |\n|           \\                   /              |\n|            O                 O               |\n|           \\|/               \\|/              |\n|            /\\                /\\              |\n|----------------------------------------------|\n' );
} );
