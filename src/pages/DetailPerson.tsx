import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {PersonEntity} from "../models/PersonEntity";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {useApi} from "../hooks/useApi";
import {Box, Divider, Typography} from "@mui/material";
import CardUser from "../components/Card/CardUser";

const DetailPerson = () => {

    const {personId} = useParams();
    const {callApi} = useApi();
    const [person, setPerson] = useState<PersonEntity>();
    const getPersonId = (id: string) => {
        callApi<PersonEntity>(REQUEST_TYPE.GET, `api/persons/${id}`)
            .then((res) => {
                setPerson(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    useEffect(() => {
        return () => {
            getPersonId(personId!)
        };
    }, []);

    return (
        <Box>
            <CardUser iconNone avatar={person?.avatar} name={person?.name}/>
            <Divider/>
            <Box p={2}>
                <Typography component={"span"}>{person?.describe}</Typography>
            </Box>
        </Box>
    )
}

export default DetailPerson;