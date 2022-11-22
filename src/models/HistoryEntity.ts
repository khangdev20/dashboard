import { FilmEntity } from "./FilmEnity";
import { UserEntity } from "./UserEntity";

export interface HistoryEntity {
  id: string,
  film: FilmEntity,
  user: UserEntity
  created: Date
}