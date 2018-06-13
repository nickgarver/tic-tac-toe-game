// Use strict

// Get a reference to our canvas element through the DOM API
const canvas = document.getElementById("canvas");
// From our selected canvas element, get a 2d drawing context
const ctx = canvas.getContext("2d");
// Set display size (css pixels).
var size = 200;
var pixelScale = 2; // <--- Change to 1 on retina screens to see blurry canvas.
ctx.width = size * pixelScale;
ctx.height = size * pixelScale;
ctx.scale(pixelScale, pixelScale);

const playerX = "X";
const playerO = "O";
var winner = null;
var isBoardFilled = null;
var xScore = 0;
var oScore = 0;
const boardState = [
  [null, null, null], // Row 1
  [null, null, null], // Row 2
  [null, null, null] // Row 3
];

let playerTurn = "X";

function drawEmptyBoard() {
  playerTurn = playerX;
  winner = false;
  isBoardFilled = false;
  ctx.lineWidth=1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var a = 0; a < 3; a++) {
    for (var b = 0; b < 3; b++) {
      boardState[a][b] = null;
    }
  }

  // Vertical 1
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(200/pixelScale, 0);
  ctx.lineTo(200/pixelScale, 600/pixelScale);
  ctx.stroke();

  // Vertical 2
  ctx.beginPath();
  ctx.moveTo(400/pixelScale, 0);
  ctx.lineTo(400/pixelScale, 600/pixelScale);
  ctx.stroke();

  // Horizontal 1
  ctx.beginPath();
  ctx.moveTo(0, 200/pixelScale);
  ctx.lineTo(600/pixelScale, 200/pixelScale);
  ctx.stroke();

  // Horizontal 2
  ctx.beginPath();
  ctx.moveTo(0, 400/pixelScale);
  ctx.lineTo(600/pixelScale, 400/pixelScale);
  ctx.stroke();
}

function updatePlayerTurn() {
  if (playerTurn === playerX) {
    return (playerTurn = playerO);
  }

  playerTurn = playerX;
}

function drawOnSquare(x,y,playerTurn) {
  var scale = 3;
  scale = scale*20;
  ctx.lineWidth=15;
  ctx.lineCap = "round";
  boardState[x][y] = playerTurn;

  if (playerTurn == "X") {
    //draw x
    ctx.strokeStyle = "#5a8bee";
    ctx.beginPath();
    ctx.moveTo((x*200+scale)/pixelScale, (y*200+scale)/pixelScale);
    ctx.lineTo(((x*200)+200-scale)/pixelScale, ((y*200)+200-scale)/pixelScale);
    ctx.moveTo((x*200+scale)/pixelScale, ((y*200)+200-scale)/pixelScale);
    ctx.lineTo(((x*200)+200-scale)/pixelScale, (y*200+scale)/pixelScale);
    ctx.stroke();
  } else if (playerTurn == "O") {
    //draw o
    ctx.strokeStyle = "#83e631";
    ctx.beginPath();
    ctx.arc((x*200+100)/pixelScale,(y*200+100)/pixelScale,(scale/1.4)/2,0,2*Math.PI);
    ctx.stroke();
  }
}

function boardHasWinner(playerTurn) {
  var xCount = null;
  var yCount = null;
  var count = null

  //check diagonal
  if((boardState[0][0] == playerTurn && boardState[1][1] == playerTurn && boardState[2][2] == playerTurn) || boardState[2][0] == playerTurn && boardState[1][1] == playerTurn && boardState[0][2] == playerTurn){
    return true;
  }

  //check vertical & horizontal
  for (var a = 0; a < 3; a++) {
    xCount = 0;
    yCount = 0;
    for (var b = 0; b < 3; b++) {
      if(boardState[a][b] == playerTurn){
        xCount++
        if (xCount > 2) {
          return true;
        }
      }
      if(boardState[b][a] == playerTurn){
        yCount++
        if (yCount > 2) {
          return true;
        }
      }
      if (boardState[a][b] !== null) {
        count++
        if (count > 8) {
          isBoardFilled = true;
          return false
        }
      }
    }
  }
  return false;
}
//----------------------------------------------//
//-------------------- main --------------------//
//----------------------------------------------//

canvas.addEventListener("click", function(event) {
  // Extract coordinates and scale
  var { x, y } = event;
  var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;
  // console.log(canvas.height, rect.height);
  document.getElementById('fake').style.width= rect.width + "px";
  document.getElementById('fake').style.height= rect.height + "px";
  x = parseInt(((x - rect.left ) * scaleX)/200);
  y = parseInt(((y - rect.top ) * scaleY)/200);
  //bounce out
  if (winner) {
    console.log(playerTurn + " wins");
    return;
  } else if (boardState[x][y] !== null) {
    document.getElementById('popup').className = '';
    void document.getElementById("popup").offsetWidth;
    document.getElementById('popup').className = 'popup gang';
    console.log('Move Taken');
    return;
  } else if (isBoardFilled) {
    console.log('board is filled');
    return;
  }

  //runnit
  drawOnSquare(x,y,playerTurn);
  winner = boardHasWinner(playerTurn);
  if (winner) {
    document.getElementById('light').style.display='block';
    document.getElementById('top').innerHTML='PLAYER '+ playerTurn + ' WINS!';
    document.getElementById('fade').style.display='block';
    if (playerTurn == "X") {
      xScore++
      document.getElementById('xPlayer').innerHTML='X PLAYER - '+ xScore;
      playerTurn = playerX;
    } else {
      oScore++
      document.getElementById('oPlayer').innerHTML='O PLAYER - '+ oScore;
    }
    return;
  }
  if (isBoardFilled) {
    document.getElementById('light').style.display='block';
    document.getElementById('top').innerHTML='CAT GAME!';
    document.getElementById('fade').style.display='block';
    console.log('board is filled');
    return;
  }

  //// TODO: update data
  //// TODO: diplay winner
  //// TODO: change colors
  // If there is no winner, update the playerTurn and continue on
  updatePlayerTurn();
});

// When the page loads, draw our empty board
window.addEventListener("load", drawEmptyBoard);
window.addEventListener("load", shadowBoard);
window.addEventListener("resize", shadowBoard);

document.getElementById('light').addEventListener("click", function(event) {
  document.getElementById('light').style.display='none';
  document.getElementById('fade').style.display='none';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawEmptyBoard();
});

function shadowBoard() {
  var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;
  document.getElementById('fake').style.width= rect.width + "px";
  document.getElementById('fake').style.height= rect.height + "px";
}
