import GameState from './GameState';

interface GameAnswer {
    hash: string;
    value: string;
}

interface GameData {
    question?: string;
    answers?: 
}

export default interface Game {
    state: GameState,
    count: number,
    data: GameData
}