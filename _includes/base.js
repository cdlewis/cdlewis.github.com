// menu functionality

function toggle_menu(override) {
  var sidebar = document.getElementById('sidebar');
  var nextClass = sidebar.getAttribute('class') ? '' : 'menu_active';
  sidebar.setAttribute('class', typeof override === 'undefined' ?  nextClass : override);
}

// print xckd 148
console.log( '------------------------------------------------\n|                  My Hobby:                   |\n|             Mispronouncing Words             |\n|                                              |\n|  Yeah, did you see what he                   |\n|  said on his wobsite?                        |\n|      \\                         ...His what?  |\n|    Wobsite.                         /        |\n|        \\                     ...I think you  |\n|      Why don\'t you write     mean "website"  |\n|      about it in                /            |\n|      your blag?                /             |\n|           \\                   /              |\n|            O                 O               |\n|           \\|/               \\|/              |\n|            /\\                /\\              |\n|----------------------------------------------|\n' );
