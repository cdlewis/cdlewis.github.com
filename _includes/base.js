// menu functionality

function toggle_menu() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.getAttribute('class')) {
    close_menu();
  } else {
    sidebar.setAttribute('class', 'menu_active');
  }
}

function close_menu() {
  document.getElementById('sidebar').setAttribute('class', '');
}

// print xckd 148
console.log( '------------------------------------------------\n|                  My Hobby:                   |\n|             Mispronouncing Words             |\n|                                              |\n|  Yeah, did you see what he                   |\n|  said on his wobsite?                        |\n|      \\                         ...His what?  |\n|    Wobsite.                         /        |\n|        \\                     ...I think you  |\n|      Why don\'t you write     mean "website"  |\n|      about it in                /            |\n|      your blag?                /             |\n|           \\                   /              |\n|            O                 O               |\n|           \\|/               \\|/              |\n|            /\\                /\\              |\n|----------------------------------------------|\n' );
