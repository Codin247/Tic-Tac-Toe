class GameAction {
    constructor(actionString, playerId) {
        this.actionString = actionString;
        this.playerId = playerId;
    }

    getActionString() {
        return this.actionString;
    }
}

module.exports = GameAction;