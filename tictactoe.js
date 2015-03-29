/*  TABLE OF CONTENTS
		1. Board Stuff
		2. Buttons
		3. Display Stuff
		4. Game Logic
		5. Global Variables
		6. Local Storage
		7. Moves
		8. Window Load
*/


// ################## BOARD STUFF ###############################


function clearBoard() {
	//set every square back to ""
	$.each(board, function(index, row) {
			row[0].css("background-color","rgba(255, 255, 255,0.6)").html("");
			row[1].css("background-color","rgba(255, 255, 255,0.6)").html("");
			row[2].css("background-color","rgba(255, 255, 255,0.6)").html("");
		});

	//reset Game Over message
	$("#result").addClass('hide').html("");

	//save board to localStorage
	saveGame();

	//clear the countdown if it's running
	clearInterval(countDownTimer);

	//if vs computer, reset to player 1's turn
	if(gameMode === "vsComputer") {
		currentPlayerCount = 0;
		checkCurrentPlayer();
		showPlayerTurn();
	};

	showPlayerTurn();
};

function isBoardBlank() {
	var count = 0;
	$.each(board, function(index, row) {
			if (row[0].html() !== "") {count++};
			if (row[1].html() !== "") {count++};
			if (row[2].html() !== "") {count++};
		});
	return (count === 0)? true : false;
};

function isBoardFull() {
	var count = 0;
		//check each row
		$.each(board, function(index, row) {
			//see if any squares in that row are blank
			if (row[0].html() !== "" && row[1].html() !== "" && row[2].html() !== ""){
				count++;
			};
		});

		if (count === 3) {
			return true;
		};
};





// ######################### BUTTONS ###################################

$('#regularGame').on('click', function() {
	gameMode = "regular";
	//store this in localStorage
	localStorage.setItem('gameMode', JSON.stringify(gameMode) );

	clearBoard();
	showButtons();
	currentPlayerCount = 0;
	checkCurrentPlayer();
	showPlayerTurn();


});

$('#speedGame').on('click', function() {
	gameMode = "speedGame";
	//store this in localStorage
	localStorage.setItem('gameMode', JSON.stringify(gameMode) );
	clearBoard();
	showButtons();
	currentPlayerCount = 0;
	checkCurrentPlayer();
	showPlayerTurn();
});
$('#vsComputer').on('click', function() {
	gameMode = "vsComputer";
	//store this in localStorage
	localStorage.setItem('gameMode', JSON.stringify(gameMode) );

	clearBoard();
	showButtons();
	currentPlayerCount = 0;
	checkCurrentPlayer();
	showPlayerTurn();

});

$('#clearBoard').on('click', clearBoard);

$('#mainMenuButton').on('click', showButtons);
$('#resumeGame').on('click', function() {
	showButtons();
});

// spin screen
$('#rotate').on('click', function() {
	$('html').addClass('rotate');
	$('body').css({
		'background-image': 'none',
		'background-color': 'transparent'});
	$('audio')[0].play();
});


// ##################### DISPLAY STUFF ################################

function countDown() {
	if (timeLimit > 0) {
		$('#result').removeClass('hide').html(timeLimit);
		timeLimit--;
	} else {
		$('#result').removeClass('hide').html("Too Slow!");
		changeMove();
		timeLimit = 3;
	};
};

function showButtons() {
	$('#mainMenuButton').toggleClass('hide');
	$('#clearBoard').toggleClass('hide');
	$('#mainMenu').toggleClass('hide');
	clearInterval(countDownTimer);
};

function showPlayerTurn() {
	//update the display to show whose turn it is
	if (checkCurrentPlayer() === player1) {
		$('#player1').css("visibility", "visible");
		$('#player2').css("visibility", "hidden");
	} else {
		$('#player1').css("visibility", "hidden");
		$('#player2').css("visibility", "visible");
	};
};

function updateScoreBoard() {
	//add win to the scoreboard
	(currentPlayer === player1)? player1Wins++ : player2Wins++;

	//save the new scores to localStorage
	localStorage.setItem('player1Wins', JSON.stringify(player1Wins));
	localStorage.setItem('player2Wins', JSON.stringify(player2Wins));

	// display the new score
	$('#player1Wins p').html(player1Wins);
	$('#player2Wins p').html(player2Wins);
};



// ################## GAME LOGIC #########################

function checkWin() {
	for(var i = 0; i < winningCombos.length; i++) {

		// check each winning combo
		if (winningCombos[i][0].html() == winningCombos[i][1].html() && winningCombos[i][0].html() == winningCombos[i][2].html() ) {

			// someone has won, but make sure it's not 3 blanks
			if(winningCombos[i][0].html() !== "") {
				//change color of winning squares
				winningCombos[i][0].css("background-color", "rgb(55, 247, 184)");
				winningCombos[i][1].css("background-color", "rgb(55, 247, 184)");
				winningCombos[i][2].css("background-color", "rgb(55, 247, 184)");
				$('#player1').css("visibility", "hidden");
				$('#player2').css("visibility", "hidden");
				return true};
		};
	};
};

function checkTie() {
		// if each row is full and no one has won
		if (isBoardFull() && !checkWin()) {
			$('#player1').css("visibility", "hidden");
			$('#player2').css("visibility", "hidden");
			return true;
		};
};

function checkCurrentPlayer() {
	currentPlayer = (currentPlayerCount%2 === 0)? player1 : player2;
	return currentPlayer;
};




// ################## GLOBAL VARIABLES ############################

//game types
var gameMode = "regular";

var player1 = "X";
var player2 = "O";
var won = false;

//speedGame stuff
var timeLimit = 3;
var countDownTimer;

//load stuff from localStorage if it exists, otherwise set to 0
var currentPlayerCount = (localStorage.getItem('currentPlayerCount'))? JSON.parse(localStorage.getItem('currentPlayerCount')) : 0;
var currentPlayer = checkCurrentPlayer();
var player1Wins = (localStorage.getItem('player1Wins'))? JSON.parse(localStorage.getItem('player1Wins')) : 0;
var player2Wins = (localStorage.getItem('player2Wins'))? JSON.parse(localStorage.getItem('player2Wins')) : 0;

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





// ################## LOCAL STORAGE #########################

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
	localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
};






// ######################## MOVES ##################################

function changeMove() {
	checkCurrentPlayer();
	currentPlayerCount++;
	showPlayerTurn();
};

function computerMove() {
	if (isBoardFull() ) {
		console.log("game's over idiot");
		return};

		$('#player1').html("X, your turn").css("visibility", "hidden");
		$('#player2').html("Computer is thinking").css("visibility", "visible");

	var square = Math.floor(Math.random() * 9 );
	//make sure square is not taken
	if ($('td').eq(square).html() === ""){
		setTimeout(function() {
			$('td').eq(square).html("O").css("background-color", "white");
			$('#player1').html("Your turn").css("visibility", "visible");
			$('#player2').html("O, your turn").css("visibility", "hidden");
			if (checkWin()) {
				$('#result').removeClass('hide').html('The computer won!');
			};
			saveGame();
		}, 1000);
	} else computerMove();
};

function setPiece(square, currentPlayer) {
	//place the new piece
	$(square).html(currentPlayer);

	//Change the player turn
	changeMove();

	//save the board to localStorage
	saveGame();
};

// actions to be taken when a square is selected
$('#board td').on( {
 	click: function() {
		// make sure we're not overriding an existing piece, and the game is still going
		if ($(this).html() === "" && !checkWin() ){

			//set the new piece
			if(gameMode === "vsComputer") {
				setPiece(this, player1);
			} else {
				setPiece(this, checkCurrentPlayer);
			}

			//return if the game is now over or tied after setting the new piece
			won = checkWin();
			if (won) {
				$('#result').removeClass('hide').html("GAME OVER ");
				clearInterval(countDownTimer);
				updateScoreBoard();
				return;
			};

			if (checkTie()) {
				$('#result').removeClass('hide').html("It's a tie!");
				clearInterval(countDownTimer);
				updateScoreBoard();
			}

			//start timer if it's a speedGame
			if (gameMode === "speedGame") {
				//clear timer first if one is already running
				if(countDownTimer >= 1 ) {
					clearInterval(countDownTimer);
				}
				//set new interval for countdown timer if game is still going
				if (!won && !checkTie() ) {
					timeLimit = 3;
					//call once to fire immediately
					countDown();
					countDownTimer = setInterval(countDown, 1000);
				};
			};
		};
		//reset the background color
		if (!won ) {
			$(this).css("background-color", "white");
		};

		//if playing vsComputer, make the computer's move
		if (gameMode === "vsComputer") {computerMove()};
	},
	mouseenter: function() {
		if (checkWin() !== true) {
	 		if ($(this).html() === "" && won !== true) {
				$(this).css("background-color", "rgba(23, 213, 142, 0.9)");
			};
		}
	},
	mouseleave: function() {
		if (checkWin() !== true) {
			($(this).html() === "")? $(this).css("background-color", "rgba(255, 255, 255,0.6)") : $(this).css("background-color", "white");
		}
	}
});





// ####################### WINDOW LOAD #############################

$(document).ready(function() {
	//create player wins totals in localStorage if it doesn't already exist
	if (!localStorage.getItem('player1Wins')) { localStorage.setItem('player1Wins', JSON.stringify(0)) };
	if (!localStorage.getItem('player2Wins')) { localStorage.setItem('player2Wins', JSON.stringify(0)) };

	//set score tally
	$('#player1Wins p').html(JSON.parse(localStorage.getItem('player1Wins') ));
	$('#player2Wins p').html(JSON.parse(localStorage.getItem('player2Wins') ));

	//set up board if it exists
	if (localStorage.getItem('board')) {
		var storedBoard = JSON.parse(localStorage.getItem('board'));
		for (var row=0; row < storedBoard.length; row++) {
			for(var sq=0; sq < 3; sq++) {
				board[row][sq].html(storedBoard[row][sq]);
				if (board[row][sq].html() !== "") {
					board[row][sq].css("background-color", "white");
				};
			};
			gameMode = JSON.parse(localStorage.getItem('gameMode'));
		};
		// also reset the board if the last game was over
		if ( checkWin() || checkTie() || isBoardBlank()) {
			clearBoard();
			$('#resume').hide();
		} else {
			//otherwise give the user the option to resume
			$('#resume').show();
		}

	} else {
		$('#resume').hide();
	};

	//setup the display to show whose turn it is
	showPlayerTurn();

})