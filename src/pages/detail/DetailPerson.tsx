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
    const getPersonId = (id: string) => {
        callApi<PersonEntity>(REQUEST_TYPE.GET, `api/persons/${id}`)
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
            getPersonId(personId!)
        };
    }, []);

    const columnFilms: GridColDef[] = [
        {field: "name", renderHeader: (params) => <Typography fontWeight={"bold"}>FILM NAME</Typography>, width: 250},
    ];

    return (
        <Box>
            <CardUser iconNone avatar={person?.avatar} name={person?.name}/>
            <Divider/>
            <Box p={2}>
                <Typography component={"span"}>{person?.describe}</Typography>
            </Box>
            {/*<Box width={300} height={500} sx={{*/}
            {/*    ":hover": {*/}
            {/*        cursor: 'pointer'*/}
            {/*    }*/}
            {/*}}>*/}
            {/*    <DataGrid*/}
            {/*        columns={columnFilms}*/}
            {/*        rows={films} pageSize={10}*/}
            {/*        rowsPerPageOptions={[10]}*/}
            {/*        onCellClick={(itm) => {*/}
            {/*            navigate(`../films/${itm.id}`)*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</Box>*/}
            <Box display={'flex'} overflow={'auto'}>
                {person?.films.map((value, key) => (
                    <CardFilm src={value.film.mobileUrl} premium={value.film.premium} onClick={() => navigate(`../films/${value.filmId}`)}/>
                ))}
            </Box>


        </Box>
    )
}

export default DetailPerson;