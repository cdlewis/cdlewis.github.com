
jQuery( document ).ready( function( $ ) {
    $( '#mobile_menu' ).click( function( event ) {
        event.preventDefault();
        $( '#user_nav' ).toggleClass( 'active' );
    } );
    $( 'pre' ).addClass( 'prettyprint' );
    prettyPrint();

    // print xckd 148
    console.log( '------------------------------------------------\n|                  My Hobby:                   |\n|             Mispronouncing Words             |\n|                                              |\n|  Yeah, did you see what he                   |\n|  said on his wobsite?                        |\n|      \\                         ...His what?  |\n|    Wobsite.                         /        |\n|        \\                     ...I think you  |\n|      Why don\'t you write     mean "website"  |\n|      about it in                /            |\n|      your blag?                /             |\n|           \\                   /              |\n|            O                 O               |\n|           \\|/               \\|/              |\n|            /\\                /\\              |\n|----------------------------------------------|\n' );
} );
