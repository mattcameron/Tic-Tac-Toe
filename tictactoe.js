var player1 = "X";
var player2 = "O";
var currentPlayerCount = JSON.parse(localStorage.getItem('currentPlayerCount') || 0);
var currentPlayer = JSON.parse(localStorage.getItem('currentPlayer') || 0);

var player1Wins = JSON.parse(localStorage.getItem('player1Wins') || 0);
var player2Wins = JSON.parse(localStorage.getItem('player2Wins') || 0);

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

function saveGame() {
	// get the current board with pieces
	var game = [
		[ board[0][0].html(), board[0][1].html(), board[0][2].html() ],
		[ board[1][0].html(), board[1][1].html(), board[1][2].html() ],
		[ board[2][0].html(), board[2][1].html(), board[2][2].html() ]
	];

	//save the board to localStorage
	localStorage.setItem('board', JSON.stringify(game));

	//save the currentPlayerCount so the correct person starts on load
	localStorage.setItem('currentPlayerCount', JSON.stringify(currentPlayerCount) );

	//save currentPlayer
	localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer))
};

function checkCurrentPlayer() {
	currentPlayer = (currentPlayerCount%2 === 0)? player1 : player2;
	return currentPlayer;
}

function setPiece(square, currentPlayer) {
	//place the new piece
	$(square).html(currentPlayer);

	//clear the timers
	clearTimeout(timer);
	clearTimeout(countDownTimer);

	//update the display to show whose turn it is
	showPlayerTurn();

	//Change the player turn
	changeMove();

	//save the board to localStorage
	saveGame();
};

function changeMove() {
	checkCurrentPlayer();
	currentPlayerCount++;
	showPlayerTurn();

	//clear existing timer
	clearTimeout(countDownTimer);

	//start new timer
	startTimer();
};

var seconds = 5;

function countDown() {
	if (seconds > 0) {
		$('#result').html(seconds);
		seconds--;
	} else {
		changeMove();
	}
	var countDownTimer = setTimeout(countDown, 1000);
}

function startTimer() {
	seconds = 5;
	countDown();
	var timer = setTimeout(changeMove, 5000);
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
			return true;
		};
};

function updateScoreBoard() {
	//add win to the scoreboard
	(currentPlayer === player1)? player1Wins++ : player2Wins++;

	//save the new scores to localStorage
	localStorage.setItem('player1Wins', player1Wins);
	localStorage.setItem('player2Wins', player2Wins);

	// display the new score
	$('#player1Wins p').html(player1Wins);
	$('#player2Wins p').html(player2Wins);
}

function showPlayerTurn() {
	//update the display to show whose turn it is
	if (currentPlayer === player1) {
		$('#player1').css("visibility", "hidden");
		$('#player2').css("visibility", "visible");
	} else {
		$('#player1').css("visibility", "visible");
		$('#player2').css("visibility", "hidden");
	}
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

	//save the cleared board to localStorage
		saveGame();
}

function mainMenu() {
	console.log("exit");
};


// actions to be taken when a square is selected
$('#board td').on( {
 	click: function() {
		// make sure we're not overriding an existing piece, and the game is still going
		if ($(this).html() === "" && !checkWin() ){
			//get currentPlayer
			setPiece(this, checkCurrentPlayer);
			startTimer();
			if (checkWin()) {updateScoreBoard()};
			checkTie();
		};
		//make the background white
		if (!checkWin() ) {
			$(this).css("background-color", "white");
		}
	},
	mouseenter: function() {
 		if ($(this).html() === "" && !checkWin()) {
			$(this).css("background-color", "grey");
		}
	},
	mouseleave: function() {
		if (!checkWin() ) {
			$(this).css("background-color", "white");
		}
	}
});

// BUTTONS
$('#startSpeedGame').on('click', startTimer);
$('#clearBoard').on('click', clearBoard);
$('#mainMenu').on('click', mainMenu);


$(document).ready(function() {
	//create player wins totals in localStorage if it doesn't already exist
	if (!localStorage.getItem('player1Wins')) { localStorage.setItem('player1Wins', 0) };
	if (!localStorage.getItem('player2Wins')) { localStorage.setItem('player2Wins', 0) };

	//set score tally
	$('#player1Wins p').html(JSON.parse(localStorage.getItem('player1Wins') ));
	$('#player2Wins p').html(JSON.parse(localStorage.getItem('player2Wins') ));

	//set up board if it exists
	if (localStorage.getItem('board')) {
		var storedBoard = JSON.parse(localStorage.getItem('board'));
		for (var row=0; row < storedBoard.length; row++) {
			for(var sq=0; sq < 3; sq++) {
				board[row][sq].html(storedBoard[row][sq]);
			}
		}
		// also reset the board if the last game was over
		if ( checkWin() || checkTie() ) {clearBoard()};
	};

	//setup the display to show whose turn it is
	showPlayerTurn();


})