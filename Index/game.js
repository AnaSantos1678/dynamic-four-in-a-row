class GameVariables {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.currentPlayer = 1;
    this.boardState = Array.from({ length: rows }, () => Array(columns).fill(0));
    this.scores = { 1: 0, 2: 0 };
    this.gameOver = false;
    this.player1Color = "Blue";
    this.player2Color = "Red";
  }

  reset() {
    this.gameOver = false;
    this.currentPlayer = 1;
    this.boardState = Array.from({ length: this.rows }, () => Array(this.columns).fill(0));
  }

  resetGame() {
    this.reset();
    this.scores = { 1: 0, 2: 0 };
    localStorage.removeItem("scores");
    updateScoreDisplay(this.scores);
  }

  checkForGameOver() {
    const winner = this.checkForFourInARow(this.boardState);
    if (winner) {
      this.gameOver = true;
      this.scores[winner.player]++;
      updateScore(winner.player, this.scores);

      const messageEl = document.getElementById("winnerMessage");
      const winnerColor = winner.player === 1 ? gameVariables.player1Color : gameVariables.player2Color;
      const winnerText = `Winner is ${winnerColor}!`;
      messageEl.textContent = winnerText;
      messageEl.classList.add("show-winner");
    } else {
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }
  }

  checkForFourInARow(board) {
    const rows = board.length;
    const cols = board[0].length;
    const numOfBalls = 4;

    const areSameAndNotNull = (values) =>
      values.every((value) => value && value === values[0]);

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

}
let gameVariables;

function startGame() {
  
  const rows = parseInt(document.getElementById("rows").value);
  const columns = parseInt(document.getElementById("columns").value);
  gameVariables = new GameVariables(rows, columns);

  loadScores();
  initializeBoard();
  updateScoreDisplay(gameVariables.scores);

  document.getElementById("currentTurn").textContent = `${gameVariables.player1Color}'s Turn`;
}

function initializeBoard() {
  const board = document.getElementById("balls");
  board.innerHTML = "";

  for (let r = 0; r < gameVariables.rows; r++) {
    const rowEl = document.createElement("div");
    rowEl.className = "row";

    for (let c = 0; c < gameVariables.columns; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", () => dropPiece(c));
      rowEl.appendChild(cell);
    }

    board.appendChild(rowEl);
    setTimeout(() => rowEl.classList.add("drawn"), r * 150);
  }

  document.getElementById("winnerMessage").classList.remove("show-winner");
  document.getElementById("winnerMessage").textContent = "";
}

function dropPiece(col) {
  if (gameVariables.gameOver) return;

  for (let row = gameVariables.rows - 1; row >= 0; row--) {
    if (gameVariables.boardState[row][col] === 0) {
      gameVariables.boardState[row][col] = gameVariables.currentPlayer;

      const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
      cell.classList.add(gameVariables.currentPlayer === 1 ? "PLAYER" : "OPPONENT", "animated");

      gameVariables.checkForGameOver();
      document.getElementById("currentTurn").textContent = `${gameVariables.currentPlayer === 1 ? gameVariables.player1Color : gameVariables.player2Color}'s Turn`;

      return;
    }
  }

  alert("Column is full! Try another one.");
}
function updateScore(winnerPlayer, scores) {
  localStorage.setItem("scores", JSON.stringify(scores));
  updateScoreDisplay(scores);
}

function updateScoreDisplay(scores) {
  const p1 = gameVariables.player1Color;
  const p2 = gameVariables.player2Color;
  document.getElementById("scoreBoard").textContent = `${p1}: ${scores[1]} - ${p2}: ${scores[2]}`;
}

function loadScores() {
  const savedScores = localStorage.getItem("scores");
  if (savedScores) {
    gameVariables.scores = JSON.parse(savedScores);
  }
}
function playAgainGame() {
  gameVariables.reset();
  initializeBoard();
  updateScoreDisplay(gameVariables.scores);
}

function resetGame() {
  gameVariables.resetGame();
  initializeBoard();
}

