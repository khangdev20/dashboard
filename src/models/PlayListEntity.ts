import { FilmEntity } from "./FilmEnity";
import { UserEntity } from "./UserEntity";

export interface PlayListEntity {
  id: string;
  film: FilmEntity;
  user: UserEntity;
}