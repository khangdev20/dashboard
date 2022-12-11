import React, {useEffect, useState} from "react";
import {useApi} from "../../hooks/useApi";
import {REQUEST_TYPE} from "../../Enums/RequestType";
import {useParams} from "react-router-dom";
import {ProducerEntity} from "../../models/ProducerEntity";
import {Box} from "@mui/material";
import {CardFilm} from "../../components/Card/CardFilm";
import CardUser from "../../components/Card/CardUser";

const DetailProducer = () => {

    const [producer, setProducer] = useState<ProducerEntity>();

    const {producerId} = useParams();
    const {callApi} = useApi();
    const getProducer = () => {
        callApi<ProducerEntity>(REQUEST_TYPE.GET, `api/producers/${producerId}`).then((res) => {
            setProducer(res.data)
        }).catch((err) => {
            console.error(err)
        })
    }

    useEffect(() => {
        return () => {
            getProducer();
        };
    }, [getProducer]);


    return (
        <Box>
            <CardUser name={producer?.name}/>
            <Box display={'flex'} overflow={"auto"}>
                {producer?.films.map((value, index, array) => (
                    <CardFilm src={value.mobileUrl}/>
                ))}
            </Box>
        </Box>);

};

export default DetailProducer;
