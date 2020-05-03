import GameState from './GameState';
import GameAnswer from './GameAnswer';

interface GameData {
    question?: string;
    answers?: Array<GameAnswer>;
}

export default interface Game {
    state: GameState,
    count: number,
    data: GameData
}