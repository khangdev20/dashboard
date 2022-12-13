import React, {useCallback, useEffect, useState} from "react";
import {
    Modal,
    Box,
    Typography,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio, Avatar
} from "@mui/material";
import {useSnackbar} from "notistack";
import "./index.css";
import {styles as modalTheme} from "../../src/containts";
import CustomInput from "../components/Input/CustomInput";
import CustomButton from "../components/Button/CustomButton";
import {useApi} from "../hooks/useApi";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {PersonEntity} from "../models/PersonEntity";
import {ConfirmDialog} from "../components/Dialog/ConfirmDialog";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import {useNavigate} from "react-router-dom";
import {DataGrid, GridColDef, GridRowId} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import ButtonOutlined from "../components/Button/ButtonOutlined";
import AddIcon from "@mui/icons-material/Add";
import {AddCircle} from "@mui/icons-material";
import {FilmEntity} from "../models/FilmEnity";

export default function PersonsPage() {
    const {enqueueSnackbar} = useSnackbar();
    const [openModal, setOpenModal] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [person, setPerson] = useState<PersonEntity>();
    const [name, setName] = useState("");
    const [sex, setSex] = useState(true);
    const [describe, setDescribe] = useState("");
    const [avatar, setAvatar] = useState("");
    const [personSelects, setPersonSelects] = useState<GridRowId[]>([]);
    const [filmSelects, setFilmSelects] = useState<GridRowId[]>([]);
    const [openModalPerToFilms, setOpenModalPerToFilms] = useState(false);
    const [films, setFilms] = useState<FilmEntity[]>([]);
    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => {
        setOpenModal(false);
        clean();
    };
    const [data, setData] = useState<PersonEntity[]>([]);

    const {callApi} = useApi();

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    const onChangeDescribe = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescribe(e.target.value);
    };
    const onChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAvatar(e.target.value);
    };

    const getPersons = useCallback(() => {
        callApi<PersonEntity[]>(REQUEST_TYPE.GET, "api/persons")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [callApi]);
    const clean = () => {
        setName("");
        setDescribe("");
        setAvatar("");
    }
    const createPerson = () => {
        callApi(REQUEST_TYPE.POST, "api/persons/create", {
            name: name,
            sex: sex,
            describe: describe,
            avatar: avatar
        })
            .then(() => {
                clean();
                setOpenModal(false);
                getPersons();
                enqueueSnackbar("Add Person Success!", {variant: "success"});
            })
            .catch((err) => {
                console.error(err);
                enqueueSnackbar("Add Person Fail!", {variant: "error"});
            });
    };

    const PersonToFilm = () => {
        const listPersons: any = [];
        personSelects.map((value) => {
            listPersons.push({id: value})
            return listPersons;
        })
        if (filmSelects.length > 1) return enqueueSnackbar("Please choose a film!", {variant: 'warning'})
        if (filmSelects.length === 0) return enqueueSnackbar("Please choose a film!", {variant: 'warning'})
        callApi(REQUEST_TYPE.POST, "api/films/people-film", {
            people: listPersons,
            filmId: filmSelects[0]
        })
            .then(() => {
                enqueueSnackbar("Add Genres to film success!", {variant: 'success'})
            })
            .catch((err) => {
                enqueueSnackbar("Add Genres to film success!", {variant: 'success'})
                console.error(err)
            })
    }

    const handleOpenModalPerToFilm = () => {
        if (personSelects.length === 0) return enqueueSnackbar("Please select a person!", {variant: 'warning'})
        if (personSelects.length < 1) return enqueueSnackbar("Please select a person!", {variant: 'warning'})
        getFilms();
        setOpenModalPerToFilms(true)
    }

    const getFilms = () => {
        setLoading(true);
        callApi<FilmEntity[]>(REQUEST_TYPE.GET, "api/films")
            .then((res) => {
                setFilms(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const deletePerson = (id: any) => {
        setOpenDialog(false);
        callApi(REQUEST_TYPE.DELETE, `api/persons/${id}`)
            .then(() => {
                getPersons();
                enqueueSnackbar("Delete Person Success!", {variant: "success"});
            })
            .catch((err) => {
                enqueueSnackbar("Delete Person Fail!", {variant: "error"});
                console.error(err);
            });
    };

    const handleOpenDialog = () => {
        if (personSelects.length === 0) return enqueueSnackbar("Please select a person!", {variant: 'warning'})
        setOpenDialog(true);
    }

    const columnPerson: GridColDef[] = [
        {
            field: "avatar",
            renderHeader: () => <Typography className={"style-header-grid"}>Avatar</Typography>,
            width: 200,
            renderCell: params => <Avatar src={params.value}/>
        },
        {
            field: "name",
            renderHeader: () => <Typography className={"style-header-grid"}>Person Name</Typography>,
            width: 250
        },
        {
            field: "sex",
            renderHeader: () => <Typography className={"style-header-grid"}>Sex</Typography>,
            width: 200,
            renderCell: params => params.value ? "Male" : "Female"
        },
        {
            field: "created",
            renderHeader: () => <Typography className={"style-header-grid"}>Created</Typography>,
            width: 200,
        },
    ];

    const columnFilms: GridColDef[] = [
        {
            field: 'webUrl',
            renderHeader: () => <Typography className={"style-header-grid"}>Poster</Typography>,
            renderCell: params => <img width={100} alt={''} src={params.value}/>,
            headerAlign: 'center',
        },
        {
            field: 'name',
            renderHeader: () => <Typography className={"style-header-grid"}>Name</Typography>,
            headerAlign: 'center',
            width: 200
        },
    ]


    useEffect(() => {
        getPersons();
    }, [getPersons]);
    return (
        <Box>
            <Box sx={{
                ":hover": {
                    cursor: 'pointer'
                },
            }}>
                <DataGrid
                    rows={data}
                    columns={columnPerson}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    onCellDoubleClick={(itm) => {
                        navigate(`${itm.id}`)
                    }}
                    onSelectionModelChange={(itm) => setPersonSelects(itm)}
                    checkboxSelection
                    autoHeight={true}
                />
            </Box>
            <Box margin={1}>
                <ButtonOutlined onClick={handleOpenModal}>
                    ADD NEW PERSON!
                    <AddIcon fontSize={'small'}/>
                </ButtonOutlined>
                <ButtonOutlined color={'error'} onClick={handleOpenDialog}>
                    DELETE USER IS SELECTED!
                    <DeleteIcon fontSize={'small'}/>
                </ButtonOutlined>
                <ButtonOutlined color={'success'} onClick={handleOpenModalPerToFilm}>
                    ADD PERSON TO FILM!
                    <AddCircle fontSize={'small'}/>
                </ButtonOutlined>
            </Box>
            <Modal open={openModalPerToFilms} onClose={() => setOpenModalPerToFilms(false)}>
                <Box sx={modalTheme}>
                    <Box width={400} height={400}>
                        <DataGrid
                            columns={columnFilms}
                            rows={films}
                            checkboxSelection
                            onSelectionModelChange={(e) => setFilmSelects(e)}
                        />
                    </Box>
                    <Box display={'flex'}>
                        <ButtonOutlined color={"error"} fullWidth onClick={PersonToFilm}>
                            SUBMIT
                        </ButtonOutlined>
                        <ButtonOutlined fullWidth onClick={() => setOpenModalPerToFilms(false)}>
                            CANCEL
                        </ButtonOutlined>
                    </Box>
                </Box>
            </Modal>
            <ConfirmDialog
                open={openDialog}
                title="Do you really want to delete it?"
                handleCancel={() => {
                    setOpenDialog(false);
                    setPerson(undefined);
                }}
                handleOk={() => deletePerson(personSelects[0])}
            />
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={modalTheme}>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <Box display={'flex'} flexDirection={'column'} width={400} alignItems={'center'}>
                            <Typography>ADD Person</Typography>
                            <CustomInput
                                placeholder="Person Name"
                                label="Person Name"
                                value={name}
                                onChange={onChangeName}
                            />
                            <CustomInput
                                placeholder="Person Describe"
                                label="Person Describe"
                                value={describe}
                                onChange={onChangeDescribe}
                            />
                            <CustomInput
                                placeholder="Person Avatar"
                                label="Person Avatar"
                                value={avatar}
                                onChange={onChangeAvatar}
                            />
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="male"
                                    name="radio-buttons-group"
                                >
                                    <Box>
                                        <FormControlLabel
                                            value="male"
                                            control={<Radio color="error"/>}
                                            label="Male"
                                            onClick={() => setSex(true)}
                                        />
                                        <FormControlLabel
                                            value="female"
                                            control={<Radio color="error"/>}
                                            label="Female"
                                            onClick={() => setSex(false)}
                                        />
                                    </Box>
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                            }}
                        >
                            <CustomButton color="error" text="SUBMIT" onClick={createPerson}/>
                            <CustomButton
                                color="inherit"
                                text="CLOSE"
                                onClick={handleCloseModal}
                            />
                        </Box>
                    </form>
                </Box>
            </Modal>
            <Modal open={openDetail} onClose={() => setOpenDetail(false)}>
                <Box sx={modalTheme}>
                    <Box className="dp-flex">
                        <Typography
                            fontSize={20}
                            textTransform={"uppercase"}
                            fontWeight="bold"
                        >
                            {person?.name}
                        </Typography>
                        {person?.sex ? (
                            <MaleIcon sx={{ml: 1}} fontSize="large" color="primary"/>
                        ) : (
                            <FemaleIcon sx={{ml: 1}} fontSize="large" color="secondary"/>
                        )}
                    </Box>
                    <Box className="dp-flex">
                        <Typography>Describe:</Typography>
                        <Typography>{person?.describe}</Typography>
                    </Box>
                    <Box className="dp-flex">
                        <Typography>Gioi tinh:</Typography>
                        <Typography>{person?.sex ? "Male" : "Female"}</Typography>
                    </Box>
                    <Box className="dp-flex">
                        <Typography>Films: </Typography>
                        {person?.films.map((value, key) => (
                            <Typography key={key}>{value.film.name}</Typography>
                        ))}
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}
