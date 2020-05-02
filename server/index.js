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
  let game;
  let player;
  // join with player data: { id?, game?, name }
  socket.on('join', async (data, callback) => {
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
      console.log('player', player);
      callback(player);
      game.emitState(socket);
      game.emitScores(socket);
    } catch (e) {
      console.error(e);
    }
  })

  socket.on('data', (data) => {
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
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
