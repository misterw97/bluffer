const { promisify } = require("util");
const redis = require("redis");
const client = redis.createClient({ host: "192.168.1.63", detect_buffers: true });
const getAsync = promisify(client.get).bind(client);

const getGame = (id) => {
    return getAsync(`game_${id}`).then(data =>  JSON.parse(data));
};

const setGame = (id, value = {}) => {
    return new Promise((resolve, reject) => {
        client.set(`game_${id}`, JSON.stringify(value), (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    })
};

module.exports = { setGame, getGame };