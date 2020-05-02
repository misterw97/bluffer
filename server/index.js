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
    // TODO: check data against game progression and player rights
    game.state.state = 'a';
    game.state.data = data;
    game._save();
    console.log('new state', game.state);
    game.emitState();

    setTimeout(() => {
      socket.emit('message', {
        player: {
          id: '123456abc',
          name: 'Isabelle',
          game: '',
        },
        answer: 'La réponse de Isabelle'
      })
    }, 700);
    setTimeout(() => {
      socket.emit('message', {
        player: {
          id: '7890def',
          name: 'Roger',
          game: '',
        },
        answer: 'La réponse de Roger'
      })
    }, 1700);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
