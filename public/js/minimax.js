// const huPlayer = image;
// todo maybe the start of the score counter
// var scoreEl = document.querySelector("#nicScore")
// function setScoreText() {
    //     scoreEl.textContent =nicScore;
    // }
    // function scoreCounter() {
    //     if(gameWon.player) {
        //         wins++;
        //     } else if(gameWon.aiPlayer) {
            //         loss++;
            //     } else {
            //         ties++;
            //     }
            //     setScoreText();
            // }
                    
//! function to sample random cage quotes
// figure out how to make this work for the whole window in html
// onclick="randomCage()"
// var audio = new Audio('audio_file.mp3');
// audio.play();
// function randomCage() {                       
// }


//! switch the O for an image of cage's head how do i write this?
// const cageHead = cagehead.png;

// const huPlayer = imageRender();

// function imageRender(err,status){
//     var img = '<img src="/images/cagehead.png">';

//     if (err) {
//         console.log(err)
//       }
      
//     document.querySelectorAll('image-container').innerHTML = img
// }



// const huPlayer = document.getElementById('image-container'); 
// huPlayer.innerHTML = '<img src="/images/cagehead.png">'; 

var origBoard;
var playerScoreField = document.querySelector('.player-score');
var aiScoreField = document.querySelector('.ai-score');
var playerScore = 0
var aiScore = 0
let audio = new Audio('/sound/bunny.mp3')

const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, huPlayer)
        if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    if (player === huPlayer) {
        console.log(squareId)
        const currentCell = document.getElementById(squareId)
        const img = document.createElement("img");
        img.src = "/images/cagehead.png"
        img.width = "150"
        img.height = "150"
        // img.src = "http://www.java2s.com/ref/javascript/image4.png";
        currentCell.append(img)
    } else {
        const currentCell = document.getElementById(squareId)
        const img = document.createElement("img");
        img.src = "/images/xsymbol.png"
        img.width = "100"
        img.height = "100"
        currentCell.append(img)
    }
    // document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == huPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");

    if (gameWon.player = huPlayer){
        aiScore++;
        aiScoreField.innerText = aiScore;
        audio.play()
       
    } else {
        playerScore++;
        playerScoreField.innerText = playerScore;        
    }


}


function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "yellow";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquares();

    if (checkWin(newBoard, huPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}