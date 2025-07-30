let currentPlayer = 1;
let boardState = [];
let scores = { 1: 0, 2: 0 };
let gameOver = false;

function startGame() {
  // scores = { 1: 0, 2: 0 }; // Reset scores
  // localStorage.removeItem("scores"); // Clear any saved scores
  // updateScoreDisplay();
  loadScores(); // Load scores from localStorage
  gameOver = false;
  currentPlayer = 1;

  const rows = parseInt(document.getElementById("rows").value);
  const columns = parseInt(document.getElementById("columns").value);
  const board = document.querySelector(".balls");
  
  board.innerHTML = "";
  boardState = Array.from({ length: rows }, () => Array(columns).fill(0));

  for (let r = 0; r < rows; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "row";

    for (let c = 0; c < columns; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", () => {
        const selectedCol = parseInt(cell.dataset.col);
        dropPiece(selectedCol);
      });

      rowEl.appendChild(cell);
    }
    board.appendChild(rowEl);

    setTimeout(() => {
  rowEl.classList.add("drawn");
}, r * 150);
  }

  currentPlayer = 1;

}
 
function dropPiece(col) {
  if (gameOver) return; 

  for (let row = boardState.length - 1; row >= 0; row--) {
    if (boardState[row][col] === 0) {
      boardState[row][col] = currentPlayer;

      const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
      cell.classList.add(currentPlayer === 1 ? "PLAYER" : "OPPONENT");
      cell.classList.add("animated");

      checkForGameOver();
      if (!gameOver) {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
      }
      return;
    }
  }
  alert("Column is full! Try another one.");
}

function checkForGameOver() {
    const winner = checkForFourInARow(boardState);
    if (winner) {
      gameOver = true;
      
      const messageEl = document.getElementById("winnerMessage");
      const winnerText = ` Winner is Player ${winner.player}!`;
      messageEl.textContent = winnerText;
      messageEl.classList.add("show-winner");

      //const winnerText = ` Winner is Player ${winner.player}!`;
      document.getElementById("winnerMessage").textContent = winnerText;
      
      // highlightWinningLine(winner.row, winner.column, winner.direction);
      updateScore(winner.player);
    }
  }

function checkForFourInARow(board) {
  const rows = board.length;
  const cols = board[0].length;
  const numOfBalls = 4;
  function areSameAndNotNull(values) {
    return values.every((value) => value && value === values[0]);
  }
  // Horizontal
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= cols - numOfBalls; c++) {
      if (!board[r][c]) continue;
      if (
        areSameAndNotNull([
          board[r][c],
          board[r][c + 1],
          board[r][c + 2],
          board[r][c + 3],
        ])
      ) {
        return { row: r, column: c, direction: 0, player: board[r][c] };
      }
    }
  }
  // Vertical
  for (let r = 0; r <= rows - numOfBalls; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c]) continue;
      if (
        areSameAndNotNull([
          board[r][c],
          board[r + 1][c],
          board[r + 2][c],
          board[r + 3][c],
        ])
      ) {
        return { row: r, column: c, direction: 90, player: board[r][c] };
      }
    }
  }
  // Diagonal 
  for (let r = 0; r <= rows - numOfBalls; r++) {
    for (let c = 0; c <= cols - numOfBalls; c++) {
      if (!board[r][c]) continue;
      if (
        areSameAndNotNull([
          board[r][c],
          board[r + 1][c + 1],
          board[r + 2][c + 2],
          board[r + 3][c + 3],
        ])
      ) {
        return { row: r, column: c, direction: 45, player: board[r][c] };
      }
    }
  }
  // Diagonal 
  for (let r = 0; r <= rows - numOfBalls; r++) {
    for (let c = numOfBalls - 1; c < cols; c++) {
      if (!board[r][c]) continue;
      if (
        areSameAndNotNull([
          board[r][c],
          board[r + 1][c - 1],
          board[r + 2][c - 2],
          board[r + 3][c - 3],
        ])
      ) {
        return { row: r, column: c, direction: -45, player: board[r][c] };
      }
    }
  }
  return null;
}

function updateScore(winnerPlayer) {
  scores[winnerPlayer]++;
  localStorage.setItem("scores", JSON.stringify(scores));
  // Update the score display
  const scoreBoard = document.getElementById("scoreBoard");
  scoreBoard.textContent = `Player 1: ${scores[1]} - Player 2: ${scores[2]}`;
  // document.getElementById("scoreBoard").textContent = `Player 1: ${scores[1]} - Player 2: ${scores[2]}`;
  updateScoreDisplay();
}

function updateScoreDisplay() {
  document.getElementById("scoreBoard").textContent = `Player 1: ${scores[1]} - Player 2: ${scores[2]}`;
}
function loadScores() {
  const savedScores = localStorage.getItem("scores");
  if (savedScores) {
    scores = JSON.parse(savedScores);
  }
  updateScoreDisplay();
}

function resetBoard() {
  currentPlayer = 1;
  gameOver = false;

  const rows = boardState.length;
  const cols = boardState[0].length;
  boardState = Array.from({ length: rows }, () => Array(cols).fill(0));

  const board = document.querySelector(".balls");
  board.innerHTML = "";

  for (let r = 0; r < rows; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "row";

    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", () => {
        const selectedCol = parseInt(cell.dataset.col);
        dropPiece(selectedCol);
      });

      rowEl.appendChild(cell);
    }
    board.appendChild(rowEl);

    setTimeout(() => {
      rowEl.classList.add("drawn");
    }, r * 150);
  }

  document.getElementById("winnerMessage").classList.remove("show-winner");
  document.getElementById("winnerMessage").textContent = "";

  updateScoreDisplay();
}

function playAgainGame() {
  resetBoard();
  gameOver = false;
  currentPlayer = 1;
  document.getElementById("winnerMessage").classList.remove("show-winner");
  document.getElementById("winnerMessage").textContent = "";
}

function resetGame() {
  resetBoard();
  scores = { 1: 0, 2: 0 };
  localStorage.removeItem("scores");
  updateScoreDisplay();
}


