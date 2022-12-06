import {FilmEntity} from "./FilmEnity";
import {GenreEntity} from "./GenreEntity";

export interface GenreFilmEntity {
    id: string,
    genreId: string,
    filmId: string,
    genre: GenreEntity
    film: FilmEntity
}