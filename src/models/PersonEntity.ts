import { PersonFilmEntity } from "./PersonFilmEntity"

export interface PersonEntity {
  id: string,
  name: string,
  sex: boolean;
  films: PersonFilmEntity[];
  describe: string
  avatar: string
  created: Date
}