const app = require('express')();
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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected with id: ' + socket.id);
  let game;
  let player;

  // join with player data: { id?, game?, name }
  socket.on('join', (data, callback) => {
    try {
      if (!data.game) {
        game = new Game(io);
        player = game.master(data, socket);
      } else {
        game = Game.get(data.game);
        if (!game) throw new Error(`Game #${data.game} does not exist.`);
        player = game.player(data, socket)
      }
      console.log('player', player);
      callback(player);
      game.emitState(socket);
    } catch (e) {
      console.error(e);
    }
  })

  socket.on('data', (data) => {
    game.state.state = 'a';
    game.state.data = data;
    console.log('new state', game.state);
    game.emitState();
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});