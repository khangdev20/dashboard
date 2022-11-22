import { GenreFilmEntity } from "./GenreFilmEntity";
import { PersonFilmEntity } from "./PersonFilmEntity";
import { ProducerEntity } from "./ProducerEntity";

export interface FilmEntity {
  id: string,
  name: string,
  describe: string,
  producerId: string,
  premium: boolean,
  producer: ProducerEntity,
  mobileUrl: string,
  views: number,
  age: string,
  webUrl: string,
  videoUrl: string,
  created: TimeRanges,
  genres: GenreFilmEntity[],
  persons: PersonFilmEntity[]
}