import {Avatar, Box, Divider, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import BoxContainer from "../components/Box/BoxContainer";
import CardItem from "../components/Card/CardItem";
import CardUser from "../components/Card/CardUser";
import ListContainer from "../components/List/ListContainer";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {useApi} from "../hooks/useApi";
import {UserEntity} from "../models/UserEntity";

const DetailUser = () => {
    const {userId} = useParams();
    const {callApi} = useApi();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserEntity>();
    const getUserId = async (id: string) => {
        await callApi<UserEntity>(REQUEST_TYPE.GET, `api/users/u?id=${id}`)
            .then((res) => {
                const response = res.data;
                setUser(response);
                console.log(response);
                console.log(response.playLists);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getUserId(userId!);
    }, []);

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
            />
            <Divider/>
            <Box className="just-center flex-wrap">
                <BoxContainer label="Transaction">
                    <ListContainer>
                        {user?.wallet.transactions.map((value, key) => (
                            <CardItem
                                key={key}
                                name={value.packageName}
                                time={value.time}
                                price={value.price}
                                date={value.created}
                            />
                        ))}
                    </ListContainer>
                </BoxContainer>
                <>
                    {user?.playLists.length === 0 ? null :
                        <BoxContainer label="Play List">
                            <ListContainer>
                                {user?.playLists.map((value, key) => (
                                    <CardItem key={key} name={value.film.name} time={value.film.producer.name}
                                              onClickDetail={() => navigate(`/films/${value.filmId}`)}/>
                                ))}
                            </ListContainer>
                        </BoxContainer>
                    }
                </>
                <>
                    {user?.histories == null ? null :
                        <BoxContainer label="History">
                            <ListContainer>
                                {user?.histories.map((value, key) => (
                                    <CardItem key={key} name={value.film.name}
                                              onClickDetail={() => navigate(`/films/${value.filmId}`)}/>
                                ))}
                            </ListContainer>
                        </BoxContainer>
                    }
                </>
            </Box>
        </Box>
    );
};

export default DetailUser;
