import Player from './Player';

export default interface GameAnswer {
    hash: string;
    value: string;
    votes?: Player[];
    authors?: Player[];
    good?: boolean;
}
