import {
    Box,
    Typography,
    Rating,
    Button,
    IconButton,
    TextField, Popper, Paper, Menu, Grid, Card, CardMedia,
} from "@mui/material";
import React, {useCallback, useEffect, useRef, useState} from "react";

import {useNavigate, useParams} from "react-router-dom";
import {REQUEST_TYPE} from "../../Enums/RequestType";
import {FilmEntity} from "../../models/FilmEnity";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import Fab from '@mui/material/Fab';
import "../index.css";
import {useApi} from "../../hooks/useApi";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {useSnackbar} from "notistack";
import SendIcon from "@mui/icons-material/Send";
import CardComment from "../../components/Card/CardComment";
import ListContainer from "../../components/List/ListContainer";
import CardItem from "../../components/Card/CardItem";
import BoxContainer from "../../components/Box/BoxContainer";
import ButtonEdit from "../../components/Button/ButtonEdit";
import {
    HubConnection,
} from "@microsoft/signalr";
import AddIcon from "@mui/icons-material/Add";
import {GenreEntity} from "../../models/GenreEntity";
import {PersonEntity} from "../../models/PersonEntity";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

export const DetailFilm = () => {
    const {filmId} = useParams();
    const [film, setFilm] = useState<FilmEntity>();
    const [avgPoint, setAvgPoint] = useState(0);
    const [comment, setComment] = useState("");
    const [replaceVideoPoster, setReplaceVideoPoster] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    // const [hubConnection, setHubConnection] = useState<HubConnection>();
    const {callApi} = useApi();
    const navigate = useNavigate();
    const [editDes, setEditDes] = useState(true);
    const [editName, setEditName] = useState(true);
    const [describe, setDescribe] = useState("");
    const [name, setName] = useState("");
    const [genres, setGenres] = useState<GenreEntity[]>([]);
    const [persons, setPersons] = useState<PersonEntity[]>([]);
    const [openAddPerson, setOpenAddPerson] = useState(false);

    // const [edit, setEdit] = useState(false);

    const getFilmById = useCallback(
        (id: string) => {
            callApi<FilmEntity>(REQUEST_TYPE.GET, `api/films/f?id=${id}`)
                .then((res) => {
                    setFilm(res.data);
                    let sum = 0;
                    let totalComment = 0;
                    for (const a of res.data.ratings) {
                        if (a.user.role == "User") {
                            sum += a.point;
                            totalComment = totalComment + 1;
                        }
                    }
                    const avg = sum / totalComment;
                    setAvgPoint(avg);
                    setDescribe(res.data.describe);
                    setName(res.data.name);
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        [callApi]
    );

    const getGenres = () => {
        callApi<GenreEntity[]>(REQUEST_TYPE.GET, "api/genres")
            .then((res) => {
                setGenres(res.data);
            }).catch((err) => {
            console.error(err)
        })
    }
    const getPersons = () => {
        callApi<PersonEntity[]>(REQUEST_TYPE.GET, "api/persons")
            .then((res) => {
                setPersons(res.data);
            }).catch((err) => {
            console.error(err)
        })
    }

    const deletePerson = (id: string) => {
        callApi(REQUEST_TYPE.DELETE, `api/persons/film/${id}`)
            .then(() => {
                getFilmById(filmId!);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const deleteGenre = (id: string) => {
        callApi(REQUEST_TYPE.DELETE, `api/genres/film/${id}`)
            .then(() => {
                getFilmById(filmId!);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    //
    // const createHubConnection = async () => {
    //   const hubConnection = new HubConnectionBuilder()
    //     .withUrl("http://localhost:5043/chat")
    //     .build();
    //   try {
    //     await hubConnection.start();
    //   } catch (e) {
    //     console.log(e);
    //   }
    // };
    const sendComment = () => {
        if (comment == "")
            return enqueueSnackbar("Nhập hộ cái chữ vào bạn iê???😐😐", {
                variant: "warning",
            });
        callApi(REQUEST_TYPE.POST, `api/rating/create`, {
            filmId: filmId,
            comment: comment,
            point: 5,
        })
            .then(() => {
                getFilmById(filmId!);
                setComment("");
                enqueueSnackbar("SEND COMMENT", {variant: "success"});
            })
            .catch((err) => {
                enqueueSnackbar("SEND FAILD!", {variant: "error"});
                console.error(err);
            });
    };

    const deleteRating = (id: string) => {
        callApi(REQUEST_TYPE.DELETE, `/api/rating/${id}`)
            .then(() => {
                enqueueSnackbar("DELETE RATING SUCCESS!", {variant: "success"});
                getFilmById(filmId!);
            })
            .catch(() => {
                enqueueSnackbar("DELETE RATING FAILD!", {variant: "error"});
            });
    };

    useEffect(() => {
        getFilmById(filmId!);
        // createHubConnection();
    }, []);

    const columnsPersons: GridColDef[] = [
        {field: "name", headerName: "Name Person", width: 120},
        {field: "created", headerName: "Created", width: 250},
    ];
    const columGenres: GridColDef[] = [
        {field: "name", headerName: "Name Genres", width: 120},
        {field: "created", headerName: "Created", width: 250},
    ];

    return (
        <Box  flexDirection={"column"} padding={2}>
            <Box display={"flex"} justifyContent={'center'}>
                {replaceVideoPoster ? (
                    <Card
                        sx={{
                            ":hover": {
                                cursor: "pointer",
                            },
                            maxHeight: 500,
                            maxWidth:1000,
                            justifyContent: 'center',
                            display: 'flex'
                        }}
                    >
                        <CardMedia
                            controls
                            component={"video"}
                            src={film?.videoUrl}/>
                    </Card>
                ) : (
                    <Card
                        sx={{
                            ":hover": {
                                cursor: "pointer",
                            },
                            maxHeight: 500,
                            maxWidth:1000,
                            justifyContent: 'center',
                            display: 'flex'
                        }}
                    >
                        <CardMedia
                            component={'img'}
                            image={film?.webUrl}
                        />
                    </Card>
                )}
            </Box>
            <Box>
                <Box className={'flex-wrap'}>
                    <Box >
                        <Box p={2}>
                            <Typography
                                fontSize={20}
                                fontWeight="bold"
                                textTransform="uppercase"
                                display={"flex"}
                                alignItems="center"
                            >
                                {name}
                            </Typography>
                            <Typography
                                display={"flex"}
                                alignItems="center"
                                textTransform="uppercase"
                                fontSize={15}
                            >
                                {film?.producer.name}
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Box display={'flex'} alignItems={"center"}>
                            <Button
                                sx={{width: 200, m: 2}}
                                variant="outlined"
                                color="error"
                                onClick={() => setReplaceVideoPoster(!replaceVideoPoster)}
                            >
                                {replaceVideoPoster ? <StopIcon/> : <PlayArrowIcon/>}
                            </Button>
                            <Rating
                                sx={{mr: 3, flex: 1}}
                                disabled
                                precision={0.5}
                                value={avgPoint}
                            />
                        </Box>
                        {/*<Typography fontSize={20} color={"green"} fontWeight={"bold"}>*/}
                        {/*    {((avgPoint / 5) * 100).toFixed(1)}%*/}
                        {/*</Typography>*/}
                    </Box>
                </Box>
                <Box display={"flex"} alignItems={"center"}>
                    <TextField
                        disabled={editDes}
                        value={describe}
                        multiline
                        onChange={(e) => setDescribe(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box className="dp-flex">
                    <VisibilityIcon color="disabled"/>
                    <Typography>{film?.views}</Typography>
                </Box>
                <Box className="flex-wrap" justifyContent={'center'}>
                    <BoxContainer label="Comment" quantily={film?.ratings.length}>
                        <ListContainer>
                            {film?.ratings.map((value, key) => (
                                <CardComment
                                    key={key}
                                    name={value.user.name}
                                    point={value.point}
                                    comment={value.comment}
                                    role={value.user.role}
                                    created={value.created}
                                    avatar={value.user.avatar}
                                    onClick={() => deleteRating(value.id)}
                                />
                            ))}
                        </ListContainer>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                pl: 2,
                            }}
                        >
                            <TextField
                                error
                                id="standard-basic"
                                variant="standard"
                                placeholder="Messages?"
                                fullWidth
                                margin="normal"
                                value={comment}
                                onChange={(e: any) => setComment(e.target.value)}
                            />
                            <IconButton type={'submit'} onClick={sendComment}>
                                <SendIcon/>
                            </IconButton>
                        </Box>
                    </BoxContainer>
                    <BoxContainer label="Genres" quantily={film?.genres.length}>
                        <ListContainer>
                            {film?.genres.map((value, key) => (
                                <CardItem
                                    key={key}
                                    name={value.genre.name}
                                    action
                                    quanlity={value.genre.films.length}
                                    onClick={() => deleteGenre(value.id)}
                                />
                            ))}
                        </ListContainer>
                    </BoxContainer>
                    <BoxContainer label="Persons" quantily={film?.persons.length}>
                        <ListContainer>
                            {film?.persons.map((value, key) => (
                                <CardItem
                                    key={key}
                                    name={value.person.name}
                                    action
                                    quanlity={value.person.films.length}
                                    onClick={() => deletePerson(value.id)}
                                    onClickDetail={() => navigate(`../persons/${value.person.id}`, {replace: true})}
                                    avatar={value.person.avatar}
                                />
                            ))}
                        </ListContainer>
                    </BoxContainer>
                </Box>
            </Box>
        </Box>
    );
};
