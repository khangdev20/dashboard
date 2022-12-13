import React, {useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useApi} from "../../hooks/useApi";
import {REQUEST_TYPE} from "../../Enums/RequestType";
import {UserEntity} from "../../models/UserEntity";
import {Avatar, Box, TextField} from "@mui/material";
import ButtonOutlined from "../../components/Button/ButtonOutlined";

const EditUser = () => {
    const {userId} = useParams();
    const {callApi} = useApi();
    const [user, setUser] = useState<UserEntity>();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const getUserId = useCallback(
        () => {
            console.log(userId);
            callApi<UserEntity>(REQUEST_TYPE.GET, `api/users/${userId}`).then((res) => {
                setUser(res.data)
                setDataUser(res.data);
            }).catch((err) => {
                console.error(err)
            })
        },
        [callApi, userId],
    );

    const setDataUser = (user: UserEntity) => {
        setName(user.name);
        setPhone(user.phone);
        setEmail(user.email);
    }

    useEffect(() => {
        return () => {
            getUserId()
        };
    }, [getUserId]);
    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Avatar sx={{width: 200, height: 200}} src={user?.avatar}/>
            <Box display={'flex'} flexDirection={'column'} width={400}>
                <TextField
                    margin={'normal'}
                    label={'Name'}
                    value={name}
                />
                <TextField
                    margin={'normal'}
                    label={'Phone'}
                    value={phone}
                />
                <TextField
                    margin={'normal'}
                    label={'Email'}
                    value={email}
                    disabled
                />
                <TextField
                    margin={'normal'}
                    label={'Password'}
                    value={password}
                />
                <TextField
                    margin={'normal'}
                    label={'Confirm Password'}
                    value={confirmPassword}
                />
                <ButtonOutlined color={'error'}>
                    SUBMIT
                </ButtonOutlined>
                <ButtonOutlined onClick={() => navigate(`../users/${userId}`)}>
                    BACK
                </ButtonOutlined>
            </Box>
        </Box>
    )
}

export default EditUser;