import GameState from './GameState';

interface GameData {}

export default interface Game {
    state: GameState,
    count: number,
    data: GameData
}