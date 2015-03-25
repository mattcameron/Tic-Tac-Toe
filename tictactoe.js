var player1 = "X";
var player2 = "O";
var currentPlayerCount = 0;
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
];


function setPiece(square, currentPlayer) {
	//place the new piece
	$(square).html(currentPlayer);
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
		if(winningCombos[i][0].html() === "") {return};

		//change color of winning squares
			winningCombos[i][0].css("background-color", "green");
			winningCombos[i][1].css("background-color", "green");
			winningCombos[i][2].css("background-color", "green");

			// someone has won
			$('#result').html("GAME OVER ");
			return true;
		}
	}
	return false;
};

function checkTie() {
		var count = 0;

		//check each row
		$.each(board, function(index, row) {
			//see if any squares in that row are blank
			if (row[0].html() !== "" && row[1].html() !== "" && row[2].html() !== ""){
				count++;
			};
		});
		// if each row is full and no one has won
		if (count === 3 && !checkWin()) {
			$('#result').html("It's a tie!");
		};
};

function updateScoreBoard() {
	//add win to the scoreboard
	(currentPlayer === player1)? player1Wins++ : player2Wins++;
	$('#player1Wins p').html(player1Wins);
	$('#player2Wins p').html(player2Wins);
}



function clearBoard() {
	//set every square back to ""
	$.each(board, function(index, row) {
			row[0].css("background-color","white").html("");
			row[1].css("background-color","white").html("");
			row[2].css("background-color","white").html("");
		});

	//reset Game Over message
	$("#result").html("");
}


// actions to be taken when a square is selected
$('#board td').on( {
 	mouseenter: function() {
 		if ($(this).html() === "" && !checkWin()) {
			$(this).css("background-color", "grey");
		}
	},
	mouseleave: function() {
		if (!checkWin() ) {
			$(this).css("background-color", "white");
		}
	},
	click: function() {
		// make sure we're not overriding an existing piece, and the game is still going
		if ($(this).html() === "" && !checkWin() ){
			//get currentPlayer
			currentPlayer = (currentPlayerCount%2 === 0)? player1 : player2;
			setPiece(this, currentPlayer);
			if (checkWin()) {updateScoreBoard()};
			checkTie();
		};

		//make the background white
		if (!checkWin() ) {
			$(this).css("background-color", "white");
		}
	}
});


// player clicks clearBoard button
$('#clearBoard').on('click', clearBoard);


$(document).ready(function() {
	//set score tally
	$('#player1Wins p').html(player1Wins);
	$('#player2Wins p').html(player2Wins);
})