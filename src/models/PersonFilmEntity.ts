import { FilmEntity } from "./FilmEnity";
import { PersonEntity } from "./PersonEntity";

export interface PersonFilmEntity {
  personId: string,
  filmId: string,
  person: PersonEntity
  film: FilmEntity
}