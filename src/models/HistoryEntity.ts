import { FilmEntity } from "./FilmEnity";
import { UserEntity } from "./UserEntity";

export interface HistoryEntity {
  id: string,
  filmId: string,
  film: FilmEntity,
  userId: string,
  user: UserEntity
  created: Date
}