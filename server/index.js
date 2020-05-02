const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { Game } = require('./game');

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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id);
  socket.on('join', (data, callback) => {
    // join with player data: { id?, game?, name }
    let game;
    let player;
    try {
      if (!data.game) {
        game = new Game();
        console.log('game', game);
        player = game.master(data, socket);
      } else {
        game = Game.get(data.game);
        if (!game) throw new Error(`Game #${data.game} does not exist.`);
        player = game.player(data, socket)
      }
      console.log(player);
      callback(player);
    } catch (e) { callback(e) }
  })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});