import {
    Modal,
    Box,
    Typography,
    TextField,
    MenuItem,
    LinearProgress,
    Popover,
    IconButton,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup, Avatar,
} from "@mui/material";
import "./index.css";
import React, {useCallback, useEffect, useState, useRef} from "react";
import CustomButton from "../components/Button/CustomButton";
import CustomInput from "../components/Input/CustomInput";
import {styles as modalTheme} from "../containts";
import {useSnackbar} from "notistack";
import {useApi} from "../hooks/useApi";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {UserEntity} from "../models/UserEntity";
import {CustomCard} from "../components/Card/CustomCard";
import {ConfirmDialog} from "../components/Dialog/ConfirmDialog";
import {SubHeader} from "../components/Header/SubHeader";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../firebase/firebase";
import {v4} from "uuid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {deleteObjectFirebase} from "../firebase/deleteObject";
import {useNavigate} from "react-router-dom";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

export default function UsersPage() {
    const {enqueueSnackbar} = useSnackbar();

    //#region useState
    const [openModal, setOpenModal] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openFormEdit, setOpenFormEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [anchorElAvt, setAnchorElAvt] =
        React.useState<HTMLButtonElement | null>(null);
    const [user, setUser] = useState<UserEntity>();
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loadingAvt, setLoadingAvt] = useState(false);
    const [users, setUsers] = useState<UserEntity[]>([]);
    const [sex, setSex] = useState(true);
    const navigate = useNavigate();

    //#endregion

    //#region firebase
    const selectAvatar = (e: any) => {
        let selected = e.target.files[0];
        if (!selected) return;
        setAvatar(selected);
        console.log(selected);
    };

    const handleOpenUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElAvt(event.currentTarget);
    };

    const handleCloseUploadAvt = () => {
        setAnchorElAvt(null);
        setAvatar(null);
    };

    const uploadAvt = (id: string) => {
        if (avatar == null) return;
        const avatarRef = ref(storage, `avatars/${v4()}`);
        console.log(avatar);
        uploadBytes(avatarRef, avatar)
            .then(() => {
                getDownloadURL(avatarRef).then((url) => {
                    callApi(REQUEST_TYPE.PUT, `api/users/avatar/${id}`, {
                        avatar: url,
                    })
                        .then(() => {
                            getUsers();
                            setAnchorElAvt(null);
                            enqueueSnackbar(`Change Avatar ${id} Success!`, {
                                variant: "success",
                            });
                        })
                        .catch(() => {
                            enqueueSnackbar(`Change Avatar ${id} Faild!`, {
                                variant: "error",
                            });
                        });
                });
            })
            .catch((err) => {
                enqueueSnackbar("ERROR", {variant: "error"});
            })
            .finally(() => setLoadingAvt(false));
    };

    const idUser = useRef("");

    //#region onChange
    const handleChangeTextSelect = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRole(event.target.value);
    };

    const onChangeName = (e: any) => {
        setName(e.target.value);
    };

    const onChangeEmail = (e: any) => {
        setEmail(e.target.value);
    };

    const onChangePhone = (e: any) => {
        setPhone(e.target.value);
    };

    const onChangePassword = (e: any) => {
        setPassword(e.target.value);
    };

    const onChangeConfirmPassword = (e: any) => {
        setConfirmPassword(e.target.value);
    };

    //#endregion
    const roles = [
        {
            role: "User",
        },
        {
            role: "Administrator",
        },
    ];

    const cleanUp = () => {
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setPhone("");
        setRole("");
        setAvatar(null);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
        cleanUp();
    };

    //#region Call Api
    const {callApi} = useApi();

    const createUser = () => {
        console.log("createUser");
        setLoading(true);
        callApi(REQUEST_TYPE.POST, "api/users/register", {
            name: name,
            email: email,
            phone: phone,
            password: password,
            confirmPassword: confirmPassword,
            passwordOld: "",
            sex: sex,
            avatar: "",
            current: "",
            role: role,
        })
            .then(() => {
                enqueueSnackbar("Create User Success!", {variant: "success"});
                setLoading(false);
                setOpenModal(false);
                getUsers();
                cleanUp();
            })
            .catch((err) => {
                setLoading(false);
                enqueueSnackbar("Create User Fail!", {variant: "error"});
                console.error(err);
            });
    };

    const getUserId = async (id: string) => {
        console.log("getUserId");
        await callApi<UserEntity>(REQUEST_TYPE.GET, `api/users/u?id=${id}`)
            .then((res) => {
                const response = res.data;
                setUser(response);
                setName(response.name);
                setPhone(response.phone);
                setEmail(response.email);
                setRole(response.role);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getUsers = useCallback(() => {
        console.log("getUsers");
        setLoading(true);
        callApi<UserEntity[]>(REQUEST_TYPE.GET, "api/users").then((res) => {
            setLoading(false);
            setUsers(res.data);
        });
    }, [callApi]);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const deleteUser = (id: string) => {
        setLoading(true);
        callApi(REQUEST_TYPE.DELETE, `api/users/${id}`)
            .then(() => {
                setLoading(false);
                setOpenDialog(false);
                getUsers();
                enqueueSnackbar("Delete User Success!", {variant: "success"});
            })
            .catch((err) => {
                setLoading(false);
                enqueueSnackbar("Delete User Failed!", {variant: "error"});
                console.error(err);
            });
    };

    const columnUsers: GridColDef[] = [
        {field: "avatar", headerName: "Avatar", width: 100, renderCell: params => <Avatar src={params.value}/>},
        {field: "name", headerName: "User name", width: 250},
        {field: "email", headerName: "Email", width: 200},
        {field: "sex", headerName: "Sex", width: 200, renderCell: params => params.value ? "Male" : "Female"},
        {field: "premium", headerName: "Premium", width: 200, renderCell: params => params.value ? "Premium" : "None"},
        {field: "dateUse", headerName: "Date Use", width: 200, renderCell: params => params.value},
    ];

    //#endregion
    return (
        <div style={{
            padding: 2
        }}>
            {loading ? <LinearProgress color="secondary"/> : ""}
            <SubHeader
                addButton={() => setOpenModal(true)}
                refreshButton={() => getUsers()}
            />

            <ConfirmDialog
                open={openDialog}
                title="Do you really want to delete it?"
                handleCancel={() => {
                    setOpenDialog(false);
                    idUser.current = "";
                }}
                handleOk={() => {
                    if (user!.avatar !== "") deleteObjectFirebase(user!.avatar);
                    deleteUser(user!.id);
                }}
            />

            <Box sx={{
                width: '100%',
                height: 500,
                ":hover": {
                    cursor: 'pointer'
                }
            }}>
                <DataGrid
                    rows={users}
                    columns={columnUsers}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onCellClick={(itm) => {
                        navigate(`${itm.id}`)
                    }}
                />
            </Box>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={modalTheme}>
                    <Typography>ADD USER</Typography>
                    <Box className="dp-flex">
                        <CustomInput
                            placeholder="Name"
                            label="Name"
                            value={name}
                            onChange={onChangeName}
                        />
                        <CustomInput
                            placeholder="Email"
                            label="Email"
                            value={email}
                            onChange={onChangeEmail}
                        />
                    </Box>
                    <CustomInput
                        placeholder="Phone"
                        label="Phone"
                        value={phone}
                        onChange={onChangePhone}
                    />
                    <Box className="dp-flex">
                        <CustomInput
                            placeholder="Password"
                            label="Password"
                            value={password}
                            onChange={onChangePassword}
                            icon={true}
                        />
                        <CustomInput
                            placeholder="Password"
                            label="Password"
                            value={confirmPassword}
                            onChange={onChangeConfirmPassword}
                            icon={true}
                        />
                    </Box>
                    <TextField
                        margin="normal"
                        select
                        fullWidth
                        value={role}
                        onChange={handleChangeTextSelect}
                        label="Role"
                    >
                        {roles.map((option) => (
                            <MenuItem key={option.role} value={option.role}>
                                {option.role}
                            </MenuItem>
                        ))}
                    </TextField>
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
                    <Box
                        sx={{
                            display: "flex",
                        }}
                    >
                        <CustomButton color="error" text="SUBMIT" onClick={createUser}/>
                        <CustomButton
                            color="inherit"
                            text="CLOSE"
                            onClick={handleCloseModal}
                        />
                    </Box>
                </Box>
            </Modal>
            <Modal open={openFormEdit} onClose={handleCloseModal}>
                <Box sx={modalTheme}>
                    <Typography>EDIT USER</Typography>
                    <Box className="dp-flex">
                        <CustomInput
                            placeholder="Name"
                            label="Name"
                            value={name}
                            onChange={onChangeName}
                        />
                        <CustomInput
                            placeholder="Phone"
                            label="Phone"
                            value={phone}
                            onChange={onChangePhone}
                            disabled={true}
                        />
                    </Box>
                    <CustomInput
                        disabled={true}
                        placeholder="Email"
                        label="Email"
                        value={email}
                    />
                    <TextField
                        select
                        fullWidth
                        value={role}
                        onChange={handleChangeTextSelect}
                        label="Role"
                        margin="normal"
                    >
                        {roles.map((option) => (
                            <MenuItem key={option.role} value={option.role}>
                                {option.role}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Box
                        sx={{
                            display: "flex",
                        }}
                    >
                        <CustomButton color="error" text="SUBMIT EDIT"/>
                        <CustomButton
                            color="inherit"
                            text="CLOSE"
                            onClick={() => {
                                setOpenFormEdit(false);
                                cleanUp();
                            }}
                        />
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
