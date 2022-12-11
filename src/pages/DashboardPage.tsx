import React, {PureComponent, useCallback, useEffect, useState} from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend, BarChart,
} from "recharts";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {useApi} from "../hooks/useApi";
import {FilmEntity} from "../models/FilmEnity";
import {Box} from "@mui/material";
import {GenreEntity} from "../models/GenreEntity";

export default function DashboardPage() {
    const [films, setFilms] = useState<FilmEntity[]>([]);
    const [genres, setGenres] = useState<GenreEntity[]>([]);
    const {callApi} = useApi();
    const getFilmData = useCallback(() => {
        callApi<FilmEntity[]>(REQUEST_TYPE.GET, "api/films")
            .then((res) => {
                setFilms(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [callApi]);

    const getGenres = useCallback(
        () => {
            callApi<GenreEntity[]>(REQUEST_TYPE.GET, "api/genres")
                .then((res) => {
                    setGenres(res.data)
                })
                .catch((err) => {
                    console.error(err)
                })
        },
        [callApi],
    );



    useEffect(() => {
        getFilmData();
        getGenres();
    }, [getFilmData, getGenres]);


    return (
        <Box justifyContent={'center'} className={"flex-wrap"} padding={2}>
            <Box m={3}>
                <LineChart
                    height={300}
                    width={600}
                    data={genres}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="10 10"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Line type='monotoneY' dataKey={"views"} stroke="#44bb66"/>
                </LineChart>
            </Box>
            <Box m={3}>
                <LineChart
                    height={300}
                    width={600}
                    data={films}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="10 10"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Line type='monotoneY' dataKey="views" stroke="#ba154a"/>
                </LineChart>
            </Box>
        </Box>
    );
}
