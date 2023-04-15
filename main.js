const GameRoom = require('./GameRoom');

const PLAY = 'play';

const matchState = new GameRoom(2);

process.stdin.on('data', (data) => {
    const message = JSON.parse(data.toString().trim());
    messageHandler(message);
});

async function messageHandler(message) {
    console.error('Message received: ' + JSON.stringify(message));
    switch (message.type) {
        case PLAY:
            const players = message.players;
            for (let i = 0; i < players.length; i++) {
                const player = players[i];
                matchState.joinGame(player);
            }
            console.error('Game started');
            const finalSummary = await matchState.playGame();
            console.error('Game ended');
            console.log(JSON.stringify({
                ...finalSummary
            }));

            break;
        default:
            console.log('Unknown message type: ' + message.type);
    }
}