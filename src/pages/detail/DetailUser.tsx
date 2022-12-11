import {Avatar, Backdrop, Box, CircularProgress, Divider, IconButton, Popover, Typography} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import CardUser from "../../components/Card/CardUser";
import {REQUEST_TYPE} from "../../Enums/RequestType";
import {useApi} from "../../hooks/useApi";
import {UserEntity} from "../../models/UserEntity";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../../firebase/firebase";
import {v4} from "uuid";
import {useSnackbar} from "notistack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {CardFilm} from "../../components/Card/CardFilm";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {deleteObjectFirebase} from "../../firebase/deleteObject";
import BoxContainer from "../../components/Box/BoxContainer";
import ListContainer from "../../components/List/ListContainer";
import CardItem from "../../components/Card/CardItem";

const DetailUser = () => {
    const {userId} = useParams();
    const {callApi} = useApi();
    const navigate = useNavigate();
    const [anchorElAvt, setAnchorElAvt] =
        React.useState<HTMLButtonElement | null>(null);
    const [avatar, setAvatar] = useState(null);
    const [loadingAvt, setLoadingAvt] = useState(false);
    const [user, setUser] = useState<UserEntity>();
    const {enqueueSnackbar} = useSnackbar()

    const selectAvatar = (e: any) => {
        let selected = e.target.files[0];
        if (!selected) return;
        setAvatar(selected);
    };
    const handleOpenUpload = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElAvt(event.currentTarget);
    };
    const handleCloseUploadAvt = () => {
        setAnchorElAvt(null);
        setAvatar(null);
    };
    const getUserId = useCallback(
        () => {
            console.log('reload laij')
            callApi<UserEntity>(REQUEST_TYPE.GET, `api/users/u?id=${userId}`)
                .then((res) => {
                    const response = res.data;
                    setUser(response);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        [callApi, userId],
    );


    const uploadAvt = (id: string) => {
        setLoadingAvt(true)
        if (avatar == null) return setLoadingAvt(false);
        const avatarRef = ref(storage, `avatars/${v4()}`);
        console.log(avatar);
        uploadBytes(avatarRef, avatar)
            .then(() => {
                getDownloadURL(avatarRef).then((url) => {
                    callApi(REQUEST_TYPE.PUT, `api/users/avatar/${id}`, {
                        avatar: url,
                    })
                        .then(() => {
                            setAnchorElAvt(null);
                            getUserId()
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
    useEffect(() => {
        return () => {
            getUserId()
        };
    }, [getUserId]);

    const columns: GridColDef[] = [
        {field: 'packageName', renderHeader: () => <Typography className={"style-header-grid"}>Package</Typography>, width: 200},
        {field: 'time', renderHeader: () => <Typography className={"style-header-grid"}>Time</Typography>, width: 200},
        {field: 'price', renderHeader: () => <Typography className={"style-header-grid"}>Price</Typography>, width: 200},
        {field: 'created', renderHeader: () => <Typography className={"style-header-grid"}>Created</Typography>, width: 200},
    ]

    return (
        <Box>
            <CardUser
                phone={user?.phone}
                money={user?.wallet.money}
                name={user?.name}
                avatar={user?.avatar}
                email={user?.email}
                role={user?.role}
                sex={user?.sex}
                premium={user?.premium}
                date={user?.dateUse.toString()}
                onChoose={handleOpenUpload}
            />
            <Popover anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }} open={Boolean(anchorElAvt)}
                     anchorEl={anchorElAvt}
                     onClose={handleCloseUploadAvt}
            >
                <Box pl={1} pr={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <input type={'file'} onChange={selectAvatar}/>
                    {avatar ?
                        <Avatar sx={{
                            textAlign: "end",
                            width: 70,
                            m: 2,
                            height: 70,
                            ":hover": {
                                boxShadow: 4,
                            },
                        }} src={URL.createObjectURL(avatar)}/>
                        : null}
                    <IconButton onClick={() => {
                        if (user?.avatar === "")
                            uploadAvt(userId!)
                        else {
                            deleteObjectFirebase(user?.avatar!);
                            uploadAvt(userId!)
                        }
                    }}>
                        <CloudUploadIcon color={'error'}/>
                    </IconButton>
                </Box>
                <Backdrop
                    open={loadingAvt}
                >
                    <CircularProgress color="error"/>
                </Backdrop>
            </Popover>
            <Divider/>
            <Box className="just-center">
                <Typography fontWeight={'bold'}>TRANSACTION</Typography>
                <Box height={300}>
                    <DataGrid columns={columns} rows={user?.wallet.transactions === undefined ? [] : user.wallet.transactions }/>
                </Box>
                <Typography fontWeight={'bold'}>PLAY LIST</Typography>
                <Box sx={{backgroundColor: 'rgba(229,172,172,0.31)', borderRadius: 5}}>
                    {user?.playLists.length === 0 ?
                        <Typography padding={2} margin={1}>User don't have Play list</Typography> :
                        <Box display={'flex'} overflow={'auto'}>
                            {user?.playLists.map((value, key) => (
                                <CardFilm key={key} src={value.film.mobileUrl}
                                          onClick={() => navigate(`/films/${value.filmId}`)}/>
                            ))}
                        </Box>
                    }
                </Box>
                <Typography fontWeight={'bold'}>HISTORY</Typography>
                <Box sx={{backgroundColor: 'rgba(229,172,172,0.31)', borderRadius: 5}}>
                    {user?.histories.length === 0 ?
                        <Typography padding={2} margin={1}>User don't have History</Typography> :
                        <Box overflow={'auto'}>
                            <Box display={'flex'}>
                                {user?.histories.map((value, key) => (
                                    <CardFilm key={key} src={value.film.mobileUrl}
                                              onClick={() => navigate(`/films/${value.filmId}`)}/>
                                ))}
                            </Box>
                        </Box>
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default DetailUser;
