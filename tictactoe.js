var player1 = "X";
var player2 = "O";
var currentPlayerCount = 1;
var currentPlayer;

var player1Wins = 0;
var player2Wins = 0;

var board = [
	[$('td').eq(0), $('td').eq(1),$('td').eq(2)],
	[$('td').eq(3), $('td').eq(4),$('td').eq(5)],
	[$('td').eq(6), $('td').eq(7),$('td').eq(8)],
];

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


function setPiece(idx, currentPlayer) {
	//place the new piece
	$('td').eq(idx).html(currentPlayer);
	currentPlayerCount++;

	//change the display to show whose turn it is
		$('#player1').toggleClass('hide');
		$('#player2').toggleClass('hide');
};

function checkWin() {
	for(var i = 0; i < winningCombos.length; i++) {

		// check each winning combo
		if (winningCombos[i][0].html() == winningCombos[i][1].html() && winningCombos[i][0].html() == winningCombos[i][2].html()) {

			//exclude blanks
		if(winningCombos[i][0].html() == "") {return};

			// someone has won
			$('#result').html("GAME OVER ");

			//change color of winning squares
			winningCombos[i][0].css("background-color", "green")
			winningCombos[i][1].css("background-color", "green")
			winningCombos[i][2].css("background-color", "green")

			//hide player names
			$('#player1').addClass('hide');
			$('#player2').addClass('hide');
			return true;
		};
	};
};

function checkTie() {
		var count = 0;

		//check each row
		_.each(board, function(row) {
			//see if any squares in that row are blank
			if (row[0].html() !== "" && row[1].html() !== "" && row[2].html() !== ""){
				count++;
			}
		});
		// if each row is full and no one has won
		if (count === 3 && !checkWin()) {
			$('#result').html("It's a tie!");
			$('#player1').addClass('hide');
			$('#player2').addClass('hide');
		}
}



$('#board').on('click', 'td', function() {

	//get square clicked
	var idx = $("td").index(this);

	// make sure you're not overriding an existing piece, and the game is still going
	if ($('td').eq(idx).html() === "" && checkWin() !== true){

		//check currentPlayer
		currentPlayer = (currentPlayerCount%2 === 0)? player1 : player2;
		setPiece(idx, currentPlayer);
		checkWin();
		checkTie();
	};

});


$(document).ready(function() {
	//set score tally
	$('#player1Wins p').html(player1Wins);
	$('#player2Wins p').html(player2Wins);
})