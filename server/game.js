const { getGame, setGame } = require('./datasource');
const { randomInt } = require('./utils');

class Game {
    constructor() {
        this.players = {};
        this.state = {
            id: 'q',
            name: 'question'
        };
    }

    async _generateId() {
        this.id = randomInt(100000, 999999);
        if (!!await getGame(this.id))
            return this._generateId();
        await setGame(this.id, this);
        return;
    }

    _createPlayer(data) {
        const playerId = randomInt(1000000, 9999999);
        if (!!this.players[playerId])
            return this._createPlayer(data);
        const player = { ...data, id: playerId, game: this.id };
        this.players[playerId] = player;
        return player;
    }

    master(...data) {
        const player = this.player(...data, true);
        return player;
    }

    player({ name, id }, socket, isMaster = false) {
        let player;
        if (!id) {
            player = this._createPlayer({ name, isMaster });
        } else {
            player = this.players[id];
        }
        if (!player)
            throw new Error(`Player #${id} not found.`);
        player.socket = socket.id;
        this._save();
        // socket.emit(this.state); TODO: emit it on 'game' channel as welcome message? onjoin?
        socket.join(this.id);
        return player;
    }

    async _save() {
        await setGame(this.id, this);
    }

    static mapFromDB(data) {
        const game = new Game();
        game.players = data.players;
        game.state = data.state;
        return game;
    }

    static async getFromDB(id) {
        const db = await getGame(id);
        return Game.mapFromDB(db);
    }

    static async generate() {
        const game = new Game();
        await game._generateId();
        return game;
    }
}

module.exports = { Game };