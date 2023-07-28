export type PersonInfoType = {
    name: string;
    profession: string;
    birthYear: number;
    deathYear?: number;
    works: {id: string, title: string}[];
};
