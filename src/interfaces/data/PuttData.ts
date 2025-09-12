export default interface PuttData {
    date: string;
    distance: number;
    result: 'hit' | 'miss';
    session?: string
}