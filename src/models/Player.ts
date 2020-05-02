export default interface Player {
    id: string;
    name: string;
    game: string;
    socket?: string;
    isMaster?: boolean;
}