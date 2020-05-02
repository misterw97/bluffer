const { getGame, setGame } = require('./datasource');
const { randomInt } = require('./utils');

class Game {
    constructor() {
        this._generateId();
        this.players = {};
        this.state = {
            id: 'q',
            name: 'question'
        };
    }

    _generateId() {
        this.id = randomInt(100000, 999999);
        if (!!getGame(this.id))
            return this._generateId();
        setGame(this.id, this);
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
        const player = this.player(...data);
        player.isMaster = true;
        return player;
    }

    player({ name, id }, socket) {
        let player;
        if (!id) {
            player = this._createPlayer({ name });
        } else {
            player = this.players[id];
        }
        if (!player)
            throw new Error(`Player #${id} not found.`);
        player.socket = socket.id;
        this.emitState();
        socket.join(this.id);
        return player;
    }
    
    emitState(socket = Game.io.to(this.id)) {
        console.log('game', this.state);
        socket.emit('state', this.state);
    }

    static get(id) {
        return getGame(id);
    }

    static boot(io) {
        this.io = io;
    }
}

module.exports = { Game };