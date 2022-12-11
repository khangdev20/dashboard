import React, {useCallback, useEffect, useState, useRef} from "react";
import {CustomSpeedDial} from "../components/Button/CustomSpeedDial";
import {
    Modal,
    Box,
    Typography,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio, Avatar, IconButton, Button,
} from "@mui/material";
import {useSnackbar} from "notistack";
import "./index.css";
import {styles as modalTheme} from "../../src/containts";
import CustomInput from "../components/Input/CustomInput";
import CustomButton from "../components/Button/CustomButton";
import {useApi} from "../hooks/useApi";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {PersonEntity} from "../models/PersonEntity";
import {CustomCard} from "../components/Card/CustomCard";
import {ConfirmDialog} from "../components/Dialog/ConfirmDialog";
import {SubHeader} from "../components/Header/SubHeader";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import {useNavigate} from "react-router-dom";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import ButtonOutlined from "../components/Button/ButtonOutlined";
import AddIcon from "@mui/icons-material/Add";
import {AddCircle} from "@mui/icons-material";

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

    const getPersonId = (id: string) => {
        callApi<PersonEntity>(REQUEST_TYPE.GET, `api/persons/${id}`)
            .then((res) => {
                setPerson(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const deletePerson = (id: string) => {
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

    const columnPerson: GridColDef[] = [
        {
            field: "avatar",
            renderHeader: params => <Typography className={"style-header-grid"}>Avatar</Typography>,
            width: 200,
            renderCell: params => <Avatar src={params.value}/>
        },
        {
            field: "name",
            renderHeader: params => <Typography className={"style-header-grid"}>User Name</Typography>,
            width: 250
        },
        {
            field: "sex",
            renderHeader: params => <Typography className={"style-header-grid"}>Sex</Typography>,
            width: 200,
            renderCell: params => params.value ? "Male" : "Female"
        },
    ];

    useEffect(() => {
        getPersons();
    }, [getPersons]);
    return (
        <Box>
            <Box sx={{
                height: 500,
                ":hover": {
                    cursor: 'pointer'
                },
            }}>
                <DataGrid
                    rows={data}
                    columns={columnPerson}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onCellDoubleClick={(itm) => {
                        navigate(`${itm.id}`)
                    }}
                    checkboxSelection
                />
            </Box>
            <Box margin={1}>
                <ButtonOutlined onClick={handleOpenModal}>
                    ADD NEW PERSON!
                    <AddIcon fontSize={'small'}/>
                </ButtonOutlined>
                <ButtonOutlined color={'error'}>
                    DELETE USER IS SELECTED!
                    <DeleteIcon fontSize={'small'}/>
                </ButtonOutlined>
                <ButtonOutlined color={'success'} onClick={() => alert("add")}>
                    ADD PERSON TO FILM!
                    <AddCircle fontSize={'small'}/>
                </ButtonOutlined>
            </Box>
            <ConfirmDialog
                open={openDialog}
                title="Do you really want to delete it?"
                handleCancel={() => {
                    setOpenDialog(false);
                    setPerson(undefined);
                }}
                handleOk={() => deletePerson(person!.id)}
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
