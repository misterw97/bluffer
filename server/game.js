const { getGame, setGame } = require('./datasource');
const { randomInt } = require('./utils');

const State = {
    waiting: 'w',
    question: 'q',
    answers: 'a',
    votes: 'v',
    results: 'r'
}

const MIN_LENGTH = 3;

class Game {
    constructor() {
        this.players = {};
        this._newState();
    }

    _newState() {
        const lastCount = (this.state ? this.state.count : undefined) || 0;
        this.state = {
            state: State.question,
            count: lastCount + 1,
            data: {},
            lock: {
                answers: {},
                bluffs: {},
                votes: {}
            }
        };
    }

    async _generateId() {
        const id = randomInt(100000, 999999);
        if (!!await getGame(id))
            return this._generateId();
        this.id = id;
        await this._save();
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

    pass(data) {
        switch (this.state.state) {
            case State.question:
                this._handleQuestionData(data);
                break;
            case State.answers:
                this._handleAnswerData(data);
                break;
        }
        game.emitState();
    }

    _handleQuestionData(data) {
        if (!data.question || data.question.length < MIN_LENGTH)
            throw new Error('missing question or length under ' + MIN_LENGTH);
        this.state.data = {
            question: data.question
        };
        this.state.state = State.answers;
        this._save();
    }

    _handleAnswerData(data) {
        if (!data.answer || data.answer.length < MIN_LENGTH)
            throw new Error('missing question or length under ' + MIN_LENGTH);
        // TODO: mix answers and hash them 
        //data.answer
        this.state.data = {
            answers: [data.answer]
        };
        this.state.state = State.votes;
        this._save();
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
        socket.join(this.id);
        return player;
    }

    emitState(socket = Game.io.to(this.id)) {
        console.log('game state', this.state);
        socket.emit('state', { ...this.state, lock: undefined });
    }

    emitScores(socket = Game.io.to(this.id)) {
        const scores = {};
        const game = this;
        Object.keys(this.players).forEach(playerId => {
            const player = game.players[playerId];
            scores[player.id] = player.score || 0;
        });
        console.log('game scores', scores);
        socket.emit('scores', scores);
    }

    async _save() {
        await setGame(this.id, this);
    }

    static mapFromDB(data) {
        const game = new Game();
        game.players = data.players;
        game.state = data.state;
        game.id = data.id;
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

    static boot(io) {
        this.io = io;
    }
}

module.exports = { Game };
