const GameState = require('./GameState');
const GameAction = require('./GameAction');
const GameViewer = require('./GameViewer');
const spawn = require('child_process').spawn;

class GameRoom {
  constructor(numPlayers) {
    this.numPlayers = numPlayers;
    this.players = [];
    this.state = new GameState();
    this.turn = 0;
  }

  joinGame(player) {
    if (this.players.length >= this.numPlayers) {
      throw new Error('Cannot join game - game is full');
    }
    const cmdProcess = spawn('node', [player.codePath]);
    console.error('Spawned process for player: ' + player.codePath);
    player.process = cmdProcess;

    this.players.push(player);
  }

  async playGame() {
    if (this.players.length < this.numPlayers) {
      throw new Error('Cannot play game - game is not full');
    }
    // play the game and return a summary of the game.
    while (!this.state.isGameOver()) {
      // play a turn
      // send the input to the turnPlayer
      // get the output from the turnPlayer
      // apply the output to the state
      console.error('Game is not over.');
      const ip = this.state.getInputs();

      const turnPlayer = this.players[this.turn];
      turnPlayer.process.stdin.write(ip);
      console.error('Sent input to player: ' + ip);
      try {
        const op = await this.startTimer(1000);
        const action = new GameAction(op);
        this.state = this.state.applyAction(action);
      } catch (err) {
        if (err instanceof TimeoutError) {
          console.error('Player took too long to respond');
          this.state.summary.push({
            player: this.state.turn,
            move: 'timeout',
            error: true,
          });
          this.state.errored = true;
          //TODO handle timeout
        } else {
          console.error('Unknown error');
          this.state.errored = true;
          //TODO handle unknown error
        }
      }

      this.turn++;
      this.turn %= this.players.length;
      //TODO timeout after X seconds
    }

    // close all the player processes
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      player.process.kill();
    }

    // return the summary
    return {
      summary: this.state.summary,
      frames: GameViewer.summaryToGrid(this.state.summary),
      winner: this.state.winnerIdx,
    };
  }

  async startTimer(time) {
    return new Promise((resolve, reject) => {
      // send the input to the turnPlayer
      // get the output from the turnPlayer
      // return the output
      // after X seconds, reject the promise
      const turnPlayer = this.players[this.turn];
      turnPlayer.process.stderr.on('data', data => {
        console.error(`stderr: ${data}`);
      });

      setTimeout(() => {
        reject(new TimeoutError('Player took too long to respond'));
      }, time);

      turnPlayer.process.stdout.on('data', data => {
        const op = data.toString().trim();
        console.error('Received output from player: ' + op);
        resolve(op);
      });
    });
  }
}

class TimeoutError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = GameRoom;
