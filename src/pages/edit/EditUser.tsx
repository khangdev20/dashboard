import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useApi} from "../../hooks/useApi";
import {REQUEST_TYPE} from "../../Enums/RequestType";
import {UserEntity} from "../../models/UserEntity";
import {Avatar, Box, TextField, Typography} from "@mui/material";
import CardUser from "../../components/Card/CardUser";
import AddIcon from "@mui/icons-material/Add";

const EditUser = () => {
    const {userId} = useParams();
    const {callApi} = useApi();
    const [user, setUser] = useState<UserEntity>();

    const getUserId = useCallback(
        () => {
            console.log(userId);
            callApi<UserEntity>(REQUEST_TYPE.GET, `api/users/u?id=${userId}`).then((res) => {
                setUser(res.data)
            }).catch((err) => {
                console.error(err)
            })
        },
        [callApi, userId],
    );
    //TODO: Name, Email, Phone, Sex, Premium,
    useEffect(() => {
        return () => {
            getUserId()
        };
    }, [getUserId]);
    return (
        <Box>
            <Avatar sx={{width: 200, height: 200}} src={user?.avatar}/>
        </Box>
    )
}

export default EditUser;