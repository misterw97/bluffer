import Player from './Player';

export default interface GameAnswer {
    hash: string;
    value: string;
    votes?: Array<Player>;
    authors?: Array<string>;
    good?: boolean;
}
