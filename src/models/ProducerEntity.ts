import { FilmEntity } from "./FilmEnity";

export interface ProducerEntity {
  id: string
  name: string;
  films: FilmEntity[];
}