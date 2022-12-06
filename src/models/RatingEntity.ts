import {FilmEntity} from "./FilmEnity";
import {UserEntity} from "./UserEntity";

export interface RatingEntity {
    id: string,
    userId: string,
    user: UserEntity,
    filmId: string,
    film: FilmEntity,
    point: number,
    comment: string
    created: Date
}