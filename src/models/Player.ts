export default interface Player {
    id: string;
    name: string;
    game: string;
    score: number;
    socket?: string;
    isMaster?: boolean;
    answerId?: string;
    voteId?: string;
    done?: boolean;
}