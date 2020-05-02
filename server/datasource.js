const data = {
    games: {}
};

const getGame = (id) => {
    return data.games[id];
};

const setGame = (id, value = {}) => {
    data.games[id] = value;
    return true;
};

module.exports = {setGame, getGame};