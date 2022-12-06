import {Avatar, Box, Button, Divider, Typography} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {useApi} from "../hooks/useApi";
import {UserEntity} from "../models/UserEntity";
import EditIcon from "@mui/icons-material/Edit";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import StarsIcon from '@mui/icons-material/Stars';
import PaidIcon from '@mui/icons-material/Paid';
import CardUser from "../components/Card/CardUser";


const ProfilePage = () => {
    const [data, setData] = useState<UserEntity>();
    const {callApi} = useApi();
    let mo = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(data?.wallet.money!)

    const getUsers = useCallback(() => {
        callApi<UserEntity>(REQUEST_TYPE.GET, "api/users/profile")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [callApi]);

    useEffect(() => {
        getUsers();
    }, [getUsers]);


    const styles = {
        fontSize: 23,
        fontWeight: "bold",
        p: 1
    }
    const justFlex = {
        justifyContent: 'center',
        display: 'flex'
    }
    const dpAlignItems = {
        display: 'flex',
        alignItems: 'center'
    }

    return (
        <Box padding={2}>
            <CardUser name={data?.name} avatar={data?.avatar} email={data?.email} phone={data?.phone} role={data?.role} money={data?.wallet.money} date={data?.dateUse}/>
        {/*    <Box sx={justFlex}>*/}
        {/*        <Avatar src={data?.avatar} sx={{width: 200, height: 200, m: 2}}/>*/}
        {/*    </Box>*/}
        {/*    <Divider/>*/}
        {/*    <Box mt={2} sx={justFlex}>*/}
        {/*        <Box>*/}
        {/*            <Box>*/}
        {/*                <Box sx={dpAlignItems}>*/}
        {/*                    <AccountCircleIcon fontSize={"large"}/>*/}
        {/*                    <Typography ml={1} sx={styles}>{data?.name}</Typography>*/}
        {/*                </Box>*/}
        {/*                <Divider/>*/}
        {/*                <Box sx={dpAlignItems}>*/}
        {/*                    <PhoneIcon fontSize={"large"}/>*/}
        {/*                    <Typography ml={1} sx={styles}>{data?.phone}</Typography>*/}
        {/*                </Box>*/}
        {/*                <Divider/>*/}
        {/*                <Box sx={dpAlignItems}>*/}
        {/*                    <EmailIcon fontSize={'large'}/>*/}
        {/*                    <Typography ml={1} sx={styles}>{data?.email}</Typography>*/}
        {/*                </Box>*/}
        {/*                <Divider/>*/}
        {/*                <Box sx={dpAlignItems}>*/}
        {/*                    <StarsIcon fontSize={"large"}/>*/}
        {/*                    <Typography ml={1} sx={styles}>{data?.role}</Typography>*/}
        {/*                </Box>*/}
        {/*                <Divider/>*/}
        {/*                <Box sx={dpAlignItems}>*/}
        {/*                    <PaidIcon fontSize={"large"}/>*/}
        {/*                    <Typography ml={1} sx={styles}>{mo}</Typography>*/}
        {/*                </Box>*/}
        {/*                <Divider/>*/}
        {/*            </Box>*/}
        {/*            <Box sx={justFlex} m={2}>*/}
        {/*                <Button sx={{display: 'flex'}} variant="outlined" startIcon={<EditIcon/>}>*/}
        {/*                    Edit*/}
        {/*                </Button>*/}
        {/*                <Button sx={{textAlign: 'end'}} variant="outlined" startIcon={<EditIcon/>}>*/}
        {/*                    REMOVE*/}
        {/*                </Button>*/}
        {/*            </Box>*/}
        {/*        </Box>*/}
        {/*    </Box>*/}
        </Box>
    );
};

export default ProfilePage;
