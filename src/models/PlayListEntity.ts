import { FilmEntity } from "./FilmEnity";
import { UserEntity } from "./UserEntity";

export interface PlayListEntity {
  id: string;
  filmId: string,
  film: FilmEntity;
  userId: string,
  user: UserEntity;
}