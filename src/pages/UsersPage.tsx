import {
    Modal,
    Box,
    Typography,
    TextField,
    MenuItem,
    LinearProgress,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup, Avatar,
} from "@mui/material";
import "./index.css";
import React, {useCallback, useEffect, useState} from "react";
import CustomButton from "../components/Button/CustomButton";
import CustomInput from "../components/Input/CustomInput";
import {styles as modalTheme} from "../containts";
import {useSnackbar} from "notistack";
import {useApi} from "../hooks/useApi";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {UserEntity} from "../models/UserEntity";
import {useNavigate} from "react-router-dom";
import {DataGrid, GridColDef, GridRowId} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ButtonOutlined from "../components/Button/ButtonOutlined";
import {AddCircle} from "@mui/icons-material";

export default function UsersPage() {
    const {enqueueSnackbar} = useSnackbar();

    //#region useState
    const [openModal, setOpenModal] = useState(false);
    const [openFormEdit, setOpenFormEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [users, setUsers] = useState<UserEntity[]>([]);
    const [userSelects, setUserSelects] = useState<GridRowId[]>([]);
    const [sex, setSex] = useState(true);
    const navigate = useNavigate();

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

    const getUsers = useCallback(() => {
        callApi<UserEntity[]>(REQUEST_TYPE.GET, "api/users")
            .then((res) => {
                setLoading(false);
                setUsers(res.data);
            }).catch((err) => {
            console.error(err)
        })
    }, [callApi]);

    useEffect(() => {
        return () => {
            getUsers()
        };
    }, [getUsers]);

    const moveToEditPage = () => {
        if (userSelects.length > 1)
            return enqueueSnackbar("Please choose one user!", {variant: 'warning'})
        if (userSelects.length === 0)
            return enqueueSnackbar("You have not selected a user", {variant: 'warning'})
        navigate(`edit/${userSelects[0]}`)
    }

    const columnUsers: GridColDef[] = [
        {
            field: "avatar",
            renderHeader: () => <Typography className={"style-header-grid"}>Avatar</Typography>,
            width: 100,
            renderCell: params => <Avatar src={params.value}/>
        },
        {
            field: "name",
            renderHeader: () => <Typography className={"style-header-grid"}>Name</Typography>,
            width: 200
        },
        {
            field: "email",
            renderHeader: () => <Typography className={"style-header-grid"}>Email</Typography>,
            width: 200
        },
        {
            field: "sex",
            renderHeader: () => <Typography className={"style-header-grid"}>Sex</Typography>,
            width: 100,
            renderCell: params => params.value ? "Male" : "Female"
        },
        {
            field: "premium",
            renderHeader: () => <Typography className={"style-header-grid"}>Premium</Typography>,
            width: 100,
            renderCell: params => params.value ? "Premium" : "None"
        },
        {
            field: "dateUse",
            renderHeader: () => <Typography className={"style-header-grid"}>Date Use</Typography>,
            width: 100,
            renderCell: params => params.value
        },
    ];

    //#endregion
    return (
        <div style={{
            padding: 2
        }}>
            {loading ? <LinearProgress color="secondary"/> : ""}
            <Box sx={{
                ":hover": {
                    cursor: 'pointer'
                }
            }}>
                <DataGrid
                    rows={users}
                    columns={columnUsers}
                    onCellDoubleClick={(itm) => {
                        navigate(`${itm.id}`)
                    }}
                    checkboxSelection
                    onSelectionModelChange={(itm) => {
                        setUserSelects(itm)
                    }}
                    autoHeight={true}
                />
            </Box>
            <Box margin={1}>
                <ButtonOutlined color={'success'} onClick={moveToEditPage}>
                    <EditIcon fontSize={'small'}/>
                </ButtonOutlined>
                <ButtonOutlined onClick={() => setOpenModal(true)}>
                    <AddCircle fontSize={'small'}/>
                </ButtonOutlined>
                <ButtonOutlined color={'error'}>
                    <DeleteIcon fontSize={'small'}/>
                </ButtonOutlined>
            </Box>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={modalTheme}>
                    <Typography fontSize={25} fontWeight={'bold'}>ADD USER</Typography>
                    <Box width={400}>
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
