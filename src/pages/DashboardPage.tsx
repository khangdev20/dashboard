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
import {Box, Button, Typography} from "@mui/material";
import axios from "axios";

export default function DashboardPage() {
    const [films, setFilms] = useState<FilmEntity[]>([]);
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



    useEffect(() => {
        getFilmData();
    }, [getFilmData]);


    return (
        <Box padding={2}>
            <Box>
                <LineChart
                    height={300}
                    width={500}
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
