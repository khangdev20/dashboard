import React, {useCallback, useEffect, useState} from 'react';
import {useApi} from "../../hooks/useApi";
import {GenreEntity} from "../../models/GenreEntity";
import {useParams} from "react-router-dom";
import {REQUEST_TYPE} from "../../Enums/RequestType";
import {Box, Typography} from "@mui/material";
import {CardFilm} from "../../components/Card/CardFilm";

const DetailGenre = () => {

    const {callApi} = useApi();
    const [genre, setGenre] = useState<GenreEntity>();
    const {genreId} = useParams();

    const getGenre = useCallback(
        () => {
            callApi<GenreEntity>(REQUEST_TYPE.GET, `api/genres/${genreId}`)
                .then((res) => {
                    setGenre(res.data)
                })
                .catch((err) => {
                    console.error(err)
                })
        },
        [callApi, genreId],
    );

    useEffect(() => {
        return () => {
            getGenre();
        };
    }, [getGenre]);

    return (
        <Box padding={2}>
            <Typography fontSize={30} fontWeight={'bold'}>
                {genre?.name}
            </Typography>
            <Box className={'flex-wrap'}>
                {
                    genre?.films.map((value, key) => (
                        <CardFilm src={value.film.mobileUrl}/>
                    ))
                }
            </Box>
        </Box>
    )
}

export default DetailGenre;
