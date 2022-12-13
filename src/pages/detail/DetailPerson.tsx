import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {PersonEntity} from "../../models/PersonEntity";
import {REQUEST_TYPE} from "../../Enums/RequestType";
import {useApi} from "../../hooks/useApi";
import {Box, Divider, Typography} from "@mui/material";
import CardUser from "../../components/Card/CardUser";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {CardFilm} from "../../components/Card/CardFilm";

const DetailPerson = () => {

    const {personId} = useParams();
    const {callApi} = useApi();
    const [person, setPerson] = useState<PersonEntity>();
    const [films, setFilms] = useState<[]>([]);

    const navigate = useNavigate()
    const getPersonId = () => {
        callApi<PersonEntity>(REQUEST_TYPE.GET, `api/persons/${personId}`)
            .then((res) => {
                setPerson(res.data);
                // eslint-disable-next-line array-callback-return
                const films: any = []
                res.data.films.map((value) => {
                    films.push({id: value.filmId, name: value.film.name})
                    return films;
                })
                setFilms(films);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    useEffect(() => {
        return () => {
            getPersonId()
        };
    }, [getPersonId]);

    return (
        <Box>
            <CardUser iconNone avatar={person?.avatar} name={person?.name}/>
            <Divider/>
            <Box p={2}>
                <Typography component={"span"}>{person?.describe}</Typography>
            </Box>
            <Divider/>
            <Box display={'flex'} sx={{overflowX: 'scroll'}}>
                {person?.films.map((value, key) => (
                    <CardFilm key={key} src={value.film.mobileUrl} premium={value.film.premium}
                              onClick={() => navigate(`../films/${value.filmId}`)}/>
                ))}
            </Box>
        </Box>
    )
}

export default DetailPerson;