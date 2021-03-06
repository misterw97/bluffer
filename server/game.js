const crypto = require("crypto");
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

    id;
    masterId;
    players;
    state;

    constructor() {
        this.players = {};
        this._newState();
    }

    _resetPlayersDoneState() {
        for (let id in this.players) {
            this.players[id].done = false;
        }
    }

    _newState() {
        const lastCount = (!!this.state && this.state.count >= 0) ? this.state.count : -1;
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
        const player = { ...data, id: playerId, game: this.id, score: 0 };
        this.players[playerId] = player;
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
            case State.votes:
                this._handleVotesData(data);
                break;
            case State.results:
                this._resetPlayersDoneState();
                this._newState();
                this._save();
                break;
        }
        this.emitState();
    }

    _handleVotesData() {
        const lock = this.state.lock;

        const votes = lock.votes;
        const answers = lock.answers;
        const bluffs = lock.bluffs;

        const extAnswers = {};

        for (let hash in answers) {
            extAnswers[hash] = {
                hash,
                value: answers[hash],
                authors: [],
                votes: [],
                good: bluffs[0] === hash
            }
        }
        const goodHash = lock.bluffs[0];
        for (let player in votes) {
            extAnswers[votes[player]].votes.push(this.players[player]);
            if (votes[player] === goodHash) this.players[player].score += 1;
        }
        for (let player in bluffs) {
            if (player == 0) continue;
            const author = this.players[player];
            extAnswers[bluffs[player]].authors.push(author);
            if (bluffs[player] !== goodHash)
                author.score += 2 * extAnswers[bluffs[player]].votes.length;
        }
        this.state.data.answers = Object.values(extAnswers);
        this.state.state = State.results;
        this._resetPlayersDoneState();
        this._save();
        this.emitScores();
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
        const lock = this.state.lock;
        lock.bluffs[0] = data.answer;
        for (let player in lock.bluffs) {
            const text = lock.bluffs[player];
            const hash = this._hash(text);
            lock.answers[hash] = text;
            lock.bluffs[player] = hash;
        }
        this.state.data.answers = Object.entries(lock.answers)
            .map((a) => ({ hash: a[0], value: a[1] })).sort((a, b) => a.hash > b.hash ? 1 : -1);
        this.state.state = State.votes;
        this._resetPlayersDoneState();
        this._save();
        this.emitScores();
    }

    _hash(data) {
        return crypto.createHash("sha1").update(data).digest("hex");
    }

    updatePlayerBluff(playerId, bluff, fromMaster = false) {
        const player = this.getPlayer(playerId);
        if (!player)
            throw new Error(`Cannot find player #${player.id}.`);
        this.state.lock.bluffs[player.id] = bluff;
        const hash = this._hash(bluff);
        player.answerId = hash;
        player.done = !fromMaster;
        this._save();
        this.emitScores();
        if (fromMaster)
            Game.io.to(player.socket).emit('bluff', {
                hash,
                bluff
            });
        else
            Game.io.to(this.getMaster().socket).emit('bluff', {
                player,
                bluff
            });
        return hash;
    }

    registerVote(playerId, answerId) {
        const player = this.getPlayer(playerId);
        if (!player)
            throw new Error(`Cannot find player #${player.id}.`);
        if (player.answerId == answerId)
            throw new Error('A player cannot vote for himself');
        const lock = this.state.lock.votes;
        lock[player.id] = answerId;
        player.voteId = answerId;
        player.done = true;
        this._save();
        this.emitScores();
        return 'OK: ' + answerId;
    }

    master(...data) {
        return this.player(...data, true);
    }

    player({ name, id }, socket, isMaster = false) {
        let player;
        if (!id)
            player = this._createPlayer({ name, isMaster });
        else
            player = this.players[id];
        if (!player)
            throw new Error(`Player #${id} not found.`);
        player.socket = socket.id;
        player.score = player.score || 0;
        if (isMaster)
            this.masterId = player.id;
        this._save();
        socket.join(this.id);
        return player;
    }

    getPlayer(id) {
        return this.players[id];
    }

    getMaster() {
        return this.getPlayer(this.masterId);
    }

    emitState(socket = Game.io.to(this.id)) {
        socket.emit('state', { ...this.state, lock: undefined });
    }

    emitScores(socket = Game.io.to(this.id)) {
        const scores = [];
        const game = this;
        Object.keys(this.players).forEach(playerId => {
            const player = game.players[playerId];
            if (!player.isMaster && player.name !== 'Partie') scores.push({ ...player, answerId: undefined });
        });
        socket.emit('scores', scores);
    }

    async _save() {
        await setGame(this.id, this);
    }

    static mapFromDB(data) {
        const game = new Game();
        Object.assign(game, data);
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
