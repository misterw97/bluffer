const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const data = {
  rooms: {},
  players: {},
};

const getRoom = (id) => {
  return data.rooms[id];
}

const setRoom = (id, value = {}) => {
  data.rooms[id] = value;
  return true;
}

const getPlayer = (id) => {
  return data.players[id];
}

const setPlayer = (id, value = {}) => {
  data.players[id] = value;
  return true;
}

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const createRoom = () => {
  roomId = randomInt(100000, 999999);
  if (!!getRoom(roomId))
    return createRoom();
  setRoom(roomId);
  return roomId;
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
  console.log('a user connected');
  socket.on('join', (data, callback) => {
    let player = { ...data };
    if (!player.id) {
      player.id = createPlayer();
    } else {
      player = { ...player, ...getPlayer(player.id) }
    }
    player.socket = socket.id;
    if (!player.room) {
      player.room = createRoom();
    }
    socket.join(player.room);
    // TODO: validate fields?
    console.log(player);
    setPlayer(player.id, player);
    callback(player);
  })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});