const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { Game } = require('./game');
Game.boot(io);

const getPlayer = (roomId, id) => {
  const room = getRoom(roomId);
  if (!room)
    throw new Error(`Room #${roomId} does not exist.`);
  return room.players[id];
}

const setPlayer = (roomId, id, value = {}) => {
  const room = getRoom(roomId);
  if (!room)
    throw new Error(`Room #${roomId} does not exist.`);
  room.players[id] = value;
  return true;
}

const createPlayer = () => {
  playerId = randomInt(10000000, 99999999);
  if (!!getPlayer(playerId))
    return createPlayer();
  setPlayer(playerId);
  return playerId;
}

app.use(express.static(__dirname + '/../dist'));

io.on('connection', (socket) => {
  console.log(`a user connected: ${socket.id}`);
  let gameId;
  let playerId;
  // join with player data: { id?, game?, name }
  socket.on('join', async (data, callback) => {
    let game, player;
    console.log('join', data);
    try {
      if (!data.game) {
        game = await Game.generate();
        player = game.master(data, socket);
      } else {
        game = await Game.getFromDB(data.game);
        if (!game) throw new Error(`Game #${data.game} does not exist.`);
        player = game.player(data, socket)
        game.emitScores();
      }
      gameId = game.id;
      playerId = player.id;
      callback(player);
      game.emitState(socket);
    } catch (e) {
      console.error(e);
    }
  })

  socket.on('data', async (data) => {
    const game = await Game.getFromDB(gameId);
    const player = game.getPlayer(playerId);
    if (!player.isMaster) {
      console.warn('A non-master sent data!');
      return;
    };
    try {
      game.pass(data);
    } catch (e) {
      console.error(e);
    }
  });

  socket.on('message', async (data) => {
    const game = await Game.getFromDB(gameId);
    const player = game.getPlayer(playerId);
    if (!player.isMaster) {
      console.warn('A non-master sent data!');
      return;
    };
    game.updatePlayerBluff(data.to, data.message, true);
  });

  socket.on('bluff', async (data, callback) => {
    try {
      const game = await Game.getFromDB(gameId);
      const hash = game.updatePlayerBluff(playerId, data);
      callback(hash);
    } catch (e) { console.error(e); }
  });

  socket.on('vote', async (data, callback) => {
    try {
      const game = await Game.getFromDB(gameId);
      const result = game.registerVote(playerId, data);
      console.log('vote', result);
      callback(result);
    } catch (e) { console.error(e); }
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
