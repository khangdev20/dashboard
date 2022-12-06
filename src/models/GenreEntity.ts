import {GenreFilmEntity} from "./GenreFilmEntity"

export interface GenreEntity {
    id: string,
    name: string;
    films: GenreFilmEntity[];
    created: Date
}