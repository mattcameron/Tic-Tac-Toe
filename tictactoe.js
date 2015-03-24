var player1 = "X";
var player2 = "O";
var currentPlayerCount = 1;
var currentPlayer;

var winningCombos = [
	//rows
	[$('td').eq(0), $('td').eq(1),$('td').eq(2)],
	[$('td').eq(3), $('td').eq(4),$('td').eq(5)],
	[$('td').eq(6), $('td').eq(7),$('td').eq(8)],

	//columns
	[$('td').eq(0), $('td').eq(3),$('td').eq(6)],
	[$('td').eq(1), $('td').eq(4),$('td').eq(7)],
	[$('td').eq(2), $('td').eq(5),$('td').eq(8)],

	//diagonals
	[$('td').eq(0), $('td').eq(4),$('td').eq(8)],
	[$('td').eq(6), $('td').eq(4),$('td').eq(2)]
]

function checkWin() {
	for(var i = 0; i < winningCombos.length; i++) {

		// check each winning combo
		if (winningCombos[i][0].html() == winningCombos[i][1].html() && winningCombos[i][0].html() == winningCombos[i][2].html()) {

			//exclude blanks
		if(winningCombos[i][0].html() == "") {return};

			// someone has won
			$('#result').html("GAME OVER " + currentPlayer + " WON!");
			return true;
		};
	};
};


function setPiece(idx, currentPlayer) {
	$('td').eq(idx).html(currentPlayer);
	currentPlayerCount++;
};


$('#board').on('click', 'td', function() {
	//get square clicked
	var idx = $( "td" ).index(this);

	//check currentPlayer
	currentPlayer = (currentPlayerCount%2 === 0)? player1 : player2;
	setPiece(idx, currentPlayer);
	checkWin();
});
