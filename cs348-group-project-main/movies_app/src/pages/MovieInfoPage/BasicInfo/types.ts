export type MovieInfoType = {
    title: string;
    averageRating: number;
    numVotes: number;
    year: number;
    runtime: number;
    directors: { id: string, directorName: string }[];
    actors: { id: string, actorName: string }[];
    genres: { id: string, genreName: string }[];
};
