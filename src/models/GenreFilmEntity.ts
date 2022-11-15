import { FilmEntity } from "./FilmEnity";
import { GenreEntity } from "./GenreEntity";
import { PersonEntity } from "./PersonEntity";

export interface GenreFilmEntity {
  genreId: string,
  filmId: string,
  genre: GenreEntity
  film: FilmEntity
}