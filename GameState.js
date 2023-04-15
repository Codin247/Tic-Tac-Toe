class GameState {
  constructor(boardString) {
    if (!boardString) {
      this.board = '         ';
    } else {
      this.board = boardString;
    }
    this.turn = 'X';
    this.errored = false;
    this.summary = [];
    this.winnerIdx = -1;
  }

  applyAction(action) {
    // return a new state by applying the action.
    const move = action.actionString;
    console.error(move);
    //0 0
    this.summary.push({
      player: this.turn,
      move: move,
    });

    //transform the move into an index
    try {
      const x = parseInt(move[0]);
      const y = parseInt(move[2]);
      const index = y * 3 + x;

      if (isNaN(index) || index < 0 || index > 8 || this.board[index] !== ' ') {
        throw new Error('Invalid move');
      }

      const newBoardString = this.board.slice(0, index) + this.turn + this.board.slice(index + 1);

      const newState = new GameState(newBoardString);
      newState.summary = this.summary;
      newState.turn = this.turn;
      newState.errored = this.errored;
      newState.changeTurn();
      return newState;
    } catch (err) {
      console.error(err);
      this.summary.at(-1).error = true;
      this.winnerIdx = this.turn === 'X' ? 1 : 0;
      this.errored = true;
      return this;
    }
  }

  changeTurn() {
    this.turn = this.turn === 'X' ? 'O' : 'X';
  }

  isGameOver() {
    // check if the game is over
    // return true if it is over
    // return false if it is not over

    return this.errored || this.isWin() || this.isBoardFull();
  }

  isWin() {
    // rows, columns, diagonals
    const allChecks = [
      // rows
      this.board[0] !== ' ' && this.board[0] === this.board[1] && this.board[1] === this.board[2],
      this.board[3] !== ' ' && this.board[3] === this.board[4] && this.board[4] === this.board[5],
      this.board[6] !== ' ' && this.board[6] === this.board[7] && this.board[7] === this.board[8],
      // columns
      this.board[0] !== ' ' && this.board[0] === this.board[6] && this.board[3] === this.board[6],
      this.board[1] !== ' ' && this.board[1] === this.board[4] && this.board[4] === this.board[7],
      this.board[2] !== ' ' && this.board[2] === this.board[5] && this.board[5] === this.board[8],
      // diagonals
      this.board[0] !== ' ' && this.board[0] === this.board[4] && this.board[4] === this.board[8],
      this.board[2] !== ' ' && this.board[2] === this.board[4] && this.board[4] === this.board[6],
    ];
    const someoneWon = allChecks.some(check => check);
    if (someoneWon) {
      this.winnerIdx = this.turn === 'X' ? 1 : 0;
    }
    return someoneWon;
  }

  isBoardFull() {
    const isBoardFull = this.board.indexOf(' ') === -1;
    if (isBoardFull) {
      this.winnerIdx = -1;
    }
    return isBoardFull;
  }

  getInputs() {
    return this.board;
  }
}

module.exports = GameState;
