import React, {useState, useCallback, useEffect} from "react";
import {styles as modalTheme} from "../../src/containts";
import {Box, Modal, Typography, LinearProgress, TextField, Avatar} from "@mui/material";
import CustomButton from "../components/Button/CustomButton";
import {GenreEntity} from "../models/GenreEntity";
import {useApi} from "../hooks/useApi";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {useSnackbar} from "notistack";
import {ConfirmDialog} from "../components/Dialog/ConfirmDialog";
import "./index.css";
import {DataGrid, GridColDef, GridRowId} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {AddCircle} from "@mui/icons-material";
import ButtonOutlined from "../components/Button/ButtonOutlined";
import {FilmEntity} from "../models/FilmEnity";

export default function GenresPage() {
    const {enqueueSnackbar} = useSnackbar();
    const [openModal, setOpenModal] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<GenreEntity[]>([]);
    const [name, setName] = useState("");
    const [openModalAddGenreToFilm, setOpenModalAddGenreToFilm] = useState(false);
    const [genresSelects, setGenresSelects] = useState<GridRowId[]>([]);
    const [filmSelects, setFilmSelects] = useState<GridRowId[]>([]);
    const [films, setFilms] = useState<FilmEntity[]>([]);
    const {callApi} = useApi();

    const navigate = useNavigate();

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleOpenGenreToFilm = () => {
        if (genresSelects.length === 0) return enqueueSnackbar("Please select at least one category", {variant: 'warning'});
        getFilms();
        setOpenModalAddGenreToFilm(true);
    }
    const handleCloseGenreToFilm = () => {
        setOpenModalAddGenreToFilm(false);
    }

    const handleOpendialog = () => {
        if (genresSelects.length === 0) return enqueueSnackbar("Please select a genre!", {variant: 'warning'})
        if (genresSelects.length > 1) return enqueueSnackbar("Please choose one genre!", {variant: 'warning'})
        setOpenDialog(true);
    }


    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const createGenres = () => {
        callApi<GenreEntity>(REQUEST_TYPE.POST, "api/genres/create", {
            name: name,
        })
            .then(() => {
                setName("");
                getGenres();
                setOpenModal(false);
                enqueueSnackbar("Add Genre Success!", {variant: "success"});
            })
            .catch((err) => {
                enqueueSnackbar("Add Genre Fail!", {variant: "error"});
                console.error(err);
            });
    };
    const getFilms = useCallback(() => {
        setLoading(true);
        console.log('films')
        callApi<FilmEntity[]>(REQUEST_TYPE.GET, "api/films")
            .then((res) => {
                setLoading(false);
                setFilms(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [callApi]);

    const getGenres = useCallback(() => {
        setLoading(true);
        callApi<GenreEntity[]>(REQUEST_TYPE.GET, "api/genres")
            .then((res) => {
                setLoading(false);
                setData(res.data);
            })
            .catch((err) => {
                setLoading(false);
                console.error(err);
            });
    }, [callApi]);

    useEffect(() => {
        return () => {
            getGenres();
        }
    }, [getGenres]);

    const deleteGenre = (id: any) => {
        setOpenDialog(true);
        callApi(REQUEST_TYPE.DELETE, `api/genres/${id}`)
            .then(() => {
                setOpenDialog(false);
                getGenres();
                enqueueSnackbar("Delete Genre Success!", {variant: "success"});
            })
            .catch((err) => {
                setOpenDialog(false);
                enqueueSnackbar("Delete Genre Fail!", {variant: "error"});
                console.error(err);
            });
    };

    const GenresToFilm = () => {
        const listGenres: any = [];
        genresSelects.map((value) => {
            listGenres.push({id: value})
            return listGenres;
        })
        if (filmSelects.length > 1) return enqueueSnackbar("Please choose a film!", {variant: 'warning'})
        if(filmSelects.length === 0) return enqueueSnackbar("Please choose a film!", {variant: 'warning'})
        callApi(REQUEST_TYPE.POST, "api/films/genres-film", {
            genres: listGenres,
            filmId: filmSelects[0]
        })
            .then(() => {
                enqueueSnackbar("Add Genres to film success!", {variant: 'success'})
                setGenresSelects([]);
                setFilmSelects([]);
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const columnGenres: GridColDef[] = [
        {
            field: "name",
            renderHeader: () => <Typography className="style-header-grid">Genre Name</Typography>,
            width: 250
        },
    ];

    const columnFilms: GridColDef[] = [
        {
            field: 'webUrl',
            renderHeader: () => <Typography className="style-header-grid">Poster</Typography>,
            renderCell: params => <img alt={''} width={100} src={params.value}/>
        },
        {
            field: "name",
            renderHeader: () => <Typography className="style-header-grid">Film Name</Typography>,
            width: 250
        },
    ];

    return (
        <Box>
            {loading ? <LinearProgress color="secondary"/> : ""}
            <Box sx={{
                height: 500,
                ":hover": {
                    cursor: 'pointer'
                }
            }}>
                <DataGrid
                    rows={data}
                    columns={columnGenres}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    onCellDoubleClick={(itm) => {
                        navigate(`${itm.id}`)
                    }}
                    onSelectionModelChange={(itm) => setGenresSelects(itm)}
                    checkboxSelection
                />
            </Box>
            <Box padding={1}>
                <ButtonOutlined color={'success'} onClick={handleOpenModal}>
                    ADD NEW GENRE
                    <AddIcon fontSize={'small'}/>
                </ButtonOutlined>
                <ButtonOutlined color={'info'} onClick={handleOpenGenreToFilm}>
                    ADD GENRE TO FILM
                    <AddCircle fontSize={'small'}/>
                </ButtonOutlined>
                <ButtonOutlined color={'error'} onClick={handleOpendialog}>
                    DELETE GENRE IS SELECTED
                    <DeleteIcon fontSize={'small'}/>
                </ButtonOutlined>
            </Box>
            <ConfirmDialog
                open={openDialog}
                title="Do you really want to delete it?"
                handleCancel={() => setOpenDialog(false)}
                handleOk={() => deleteGenre(genresSelects[0])}
            />
            <Modal open={openModalAddGenreToFilm} onClose={handleCloseGenreToFilm}>
                <Box sx={modalTheme}>
                    <Typography margin={1} fontWeight={'bold'}>ADD GENRE TO FILM</Typography>
                    <Box width={500}>
                        <DataGrid
                            checkboxSelection
                            rowsPerPageOptions={[5]}
                            columns={columnFilms}
                            rows={films}
                            onSelectionModelChange={(itm) => setFilmSelects(itm)}
                            autoHeight={true}/>
                    </Box>
                    <Box>
                        <ButtonOutlined color={'error'} onClick={GenresToFilm}>
                            SUBMIT
                        </ButtonOutlined>
                        <ButtonOutlined onClick={handleCloseGenreToFilm}>
                            CANCEL
                        </ButtonOutlined>
                    </Box>
                </Box>
            </Modal>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={modalTheme}>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={400}>
                            <Typography>ADD GENRES</Typography>
                            <TextField
                                fullWidth
                                margin={'normal'}
                                placeholder="Genres"
                                label="Genres"
                                value={name}
                                onChange={onChangeName}
                            />
                            <CustomButton type={'submit'} color="error" text="SUBMIT" onClick={createGenres}/>
                            <CustomButton
                                color="inherit"
                                text="CLOSE"
                                onClick={handleCloseModal}
                            />
                        </Box>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
}
