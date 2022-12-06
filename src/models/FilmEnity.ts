import {GenreFilmEntity} from "./GenreFilmEntity";
import {PersonFilmEntity} from "./PersonFilmEntity";
import {ProducerEntity} from "./ProducerEntity";
import {RatingEntity} from "./RatingEntity";

export interface FilmEntity {
    id: string,
    name: string,
    describe: string,
    producerId: string,
    premium: boolean,
    producer: ProducerEntity,
    ratings: RatingEntity[],
    mobileUrl: string,
    release: number,
    views: number,
    age: string,
    webUrl: string,
    videoUrl: string,
    created: TimeRanges,
    genres: GenreFilmEntity[],
    persons: PersonFilmEntity[]
}