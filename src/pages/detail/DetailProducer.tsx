import React, {useCallback, useEffect, useState} from "react";
import {useApi} from "../../hooks/useApi";
import {REQUEST_TYPE} from "../../Enums/RequestType";
import {useNavigate, useParams} from "react-router-dom";
import {ProducerEntity} from "../../models/ProducerEntity";
import {Box, Typography} from "@mui/material";
import {CardFilm} from "../../components/Card/CardFilm";

const DetailProducer = () => {

    const [producer, setProducer] = useState<ProducerEntity>();
    const {producerId} = useParams();
    const navigate = useNavigate();
    const {callApi} = useApi();
    const getProducer = useCallback(() => {
        callApi<ProducerEntity>(REQUEST_TYPE.GET, `api/producers/${producerId}`).then((res) => {
            setProducer(res.data)
        }).catch((err) => {
            console.error(err)
        })
    }, [callApi, producerId])

    useEffect(() => {
        return () => {
            getProducer();
        };
    }, [getProducer]);


    return (
        <Box>
            <Typography padding={2} fontSize={40} fontWeight={'bold'}>
                {producer?.name}
            </Typography>
            <Box display={'flex'} overflow={"auto"}>
                {producer?.films.map((value, index, array) => (
                    <CardFilm
                        key={index}
                        src={value.mobileUrl}
                        onClick={() => navigate(`../films/${value.id}`)}

                    />
                ))}
            </Box>
        </Box>);

};

export default DetailProducer;
