import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  LinearProgress,
  Toolbar,
} from "@mui/material";
import "./index.css";
import React, { useCallback, useEffect, useState, useRef } from "react";
import CustomButton from "../components/Button/CustomButton";
import { CustomSpeedDial } from "../components/Button/CustomSpeedDial";
import CustomInput from "../components/Input/CustomInput";
import { styles as modalTheme } from "../containts";
import { useSnackbar } from "notistack";
import { useApi } from "../hooks/useApi";
import { REQUEST_TYPE } from "../Enums/RequestType";
import { UserEntity } from "../models/UserEntity";
import { CustomCard } from "../components/Card/CustomCard";
import { ConfirmDialog } from "../components/Dialog/ConfirmDialog";
import { SubHeader } from "../components/Header/SubHeader";

export default function UsersPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFormEdit, setOpenFormEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  console.log(avatar);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [users, setUsers] = useState<UserEntity[]>([]);
  const { callApi } = useApi();
  const idUser = useRef("");

  const handleChangeTextSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRole(event.target.value);
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const selectAvatar = (e: any) => {
    let selected = e.target.files[0];
    if (!selected) return;
    setAvatar(selected);
    console.log(selected);
  };

  const roles = [
    {
      role: "User",
    },
    {
      role: "Adminstrator",
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
  const handleOpenModal = () => {
    setOpenModal(true);
    cleanUp();
  };

  const createUser = () => {
    setLoading(true);
    callApi(REQUEST_TYPE.POST, "api/users/register", {
      name: name,
      email: email,
      phone: phone,
      password: password,
      confirmPassword: confirmPassword,
      passwordOld: "",
      role: role,
    })
      .then(() => {
        enqueueSnackbar("Create User Success!", { variant: "success" });
        setLoading(false);
        setOpenModal(false);
        getUsers();
        cleanUp();
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar("Create User Fail!", { variant: "error" });
        console.error(err);
      });
  };

  const getUsers = useCallback(() => {
    setLoading(true);
    callApi<UserEntity[]>(REQUEST_TYPE.GET, "api/users")
      .then((res) => {
        setLoading(false);
        setUsers(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [callApi]);

  const deleteUser = (id: string) => {
    setLoading(true);
    callApi(REQUEST_TYPE.DELETE, `api/users/${id}`)
      .then(() => {
        idUser.current = "";
        setLoading(false);
        setOpenDialog(false);
        getUsers();
        enqueueSnackbar("Delete User Success!", { variant: "success" });
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar("Delete User Failed!", { variant: "error" });
        console.error(err);
      });
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div>
      {loading ? <LinearProgress color="secondary" /> : ""}
      <SubHeader addButton={handleOpenModal} refreshButton={() => getUsers()} />
      <div className="flex-wrap">
        {users.map((value) => (
          <CustomCard
            hideAvatar={true}
            key={value.id}
            name={value.name}
            email={value.email}
            role={value.role}
            avatar={value.avatar}
            handleDelete={() => {
              setOpenDialog(true);
              idUser.current = value.id;
            }}
            handleEdit={() => {
              setOpenFormEdit(true);
            }}
          />
        ))}
      </div>
      <ConfirmDialog
        open={openDialog}
        title="Do you really want to delete it?"
        handleCancel={() => {
          setOpenDialog(false);
          idUser.current = "";
        }}
        handleOk={() => deleteUser(idUser.current)}
      />
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
          <Box
            sx={{
              display: "flex",
            }}
          >
            <CustomButton color="error" text="SUBMIT" onClick={createUser} />
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
              placeholder="Password Old"
              label="Password Old"
              value={password}
              onChange={onChangePassword}
              icon={true}
            />
            <CustomInput
              placeholder="Password New"
              label="Password New"
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
              icon={true}
            />
          </Box>
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
          {avatar == null ? null : (
            <img
              height={100}
              width={100}
              style={{
                borderRadius: 100,
              }}
              src={URL.createObjectURL(avatar)}
            />
          )}
          <input
            type={"file"}
            accept="image/*"
            title="avatar"
            onChange={selectAvatar}
          />
          <Box
            sx={{
              display: "flex",
            }}
          >
            <CustomButton color="error" text="SUBMIT" onClick={createUser} />
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
