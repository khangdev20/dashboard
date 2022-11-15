import { Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { REQUEST_TYPE } from "../Enums/RequestType";
import { useApi } from "../hooks/useApi";
import { UserEntity } from "../models/UserEntity";

const ProfilePage = () => {
  const [data, setData] = useState<UserEntity>();
  const { callApi } = useApi();

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

  return (
    <div>
      <Typography>{data?.name}</Typography>
      <Typography>{data?.phone}</Typography>
      <Typography>{data?.email}</Typography>
    </div>
  );
};

export default ProfilePage;
