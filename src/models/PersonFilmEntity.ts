import { FilmEntity } from "./FilmEnity";
import { PersonEntity } from "./PersonEntity";

export interface PersonFilmEntity {
  id: string,
  personId: string,
  filmId: string,
  person: PersonEntity
  film: FilmEntity
}