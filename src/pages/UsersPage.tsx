import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  LinearProgress,
  Popover,
  Button,
  IconButton,
  CircularProgress,
  Avatar,
} from "@mui/material";
import "./index.css";
import React, { useCallback, useEffect, useState, useRef } from "react";
import CustomButton from "../components/Button/CustomButton";
import CustomInput from "../components/Input/CustomInput";
import { styles as modalTheme } from "../containts";
import { useSnackbar } from "notistack";
import { useApi } from "../hooks/useApi";
import { REQUEST_TYPE } from "../Enums/RequestType";
import { UserEntity } from "../models/UserEntity";
import { CustomCard } from "../components/Card/CustomCard";
import { ConfirmDialog } from "../components/Dialog/ConfirmDialog";
import { SubHeader } from "../components/Header/SubHeader";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { v4 } from "uuid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { deleteObjectFirebase } from "../firebase/deleteObject";
import { async } from "@firebase/util";
import { url } from "inspector";

export default function UsersPage() {
  const { enqueueSnackbar } = useSnackbar();

  //#region useState
  const [openModal, setOpenModal] = useState(false);
  const [passwordOld, setPasswordOld] = useState("");
  const [passwordNew, setPassowordNew] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openFormEdit, setOpenFormEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
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
  //#endregion

  //#region firebase
  const selectAvatar = (e: any) => {
    let selected = e.target.files[0];
    if (!selected) return;
    setAvatar(selected);
    console.log(selected);
  };

  const idU = useRef("");

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
          callApi(REQUEST_TYPE.PUT, `api/users/avt/${id}`, {
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
        enqueueSnackbar("ERROR", { variant: "error" });
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

  const onChangePasswordOld = (e: any) => {
    setPasswordOld(e.target.value);
  };

  const onChangePasswordNew = (e: any) => {
    setPassowordNew(e.target.value);
  };
  //#endregion
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
    setAvatar(null);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    cleanUp();
  };

  //#region Call Api
  const { callApi } = useApi();

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
      avatar: "",
      current: "",
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

  const getUserId = async (id: string) => {
    console.log("getUserId");
    await callApi<UserEntity>(REQUEST_TYPE.GET, `api/users/u?id=${id}`)
      .then((res) => {
        const respone = res.data;
        setUser(respone);
        setName(respone.name);
        setPhone(respone.phone);
        setEmail(respone.email);
        setRole(respone.role);
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
        enqueueSnackbar("Delete User Success!", { variant: "success" });
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar("Delete User Failed!", { variant: "error" });
        console.error(err);
      });
  };

  //#endregion
  return (
    <div>
      {loading ? <LinearProgress color="secondary" /> : ""}
      <SubHeader
        addButton={() => setOpenModal(true)}
        refreshButton={() => getUsers()}
      />
      <div className="flex-wrap">
        {users.map((value) => (
          <CustomCard
            showAvatar={true}
            key={value.id}
            name={value.name}
            email={value.email}
            role={value.role}
            avatar={value.avatar}
            onUploadAvatar={(e: any) => {
              handleOpenUpload(e);
              getUserId(value.id);
            }}
            handleDelete={() => {
              setOpenDialog(true);
              getUserId(value.id);
            }}
            handleEdit={() => {
              setOpenFormEdit(true);
              getUserId(value.id);
            }}
            handleDetail={() => {
              setOpenDetail(true);
              getUserId(value.id);
            }}
          />
        ))}
        <Popover
          open={Boolean(anchorElAvt)}
          anchorEl={anchorElAvt}
          onClose={() => {
            handleCloseUploadAvt();
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box
            sx={{
              padding: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {avatar == null ? null : (
              <img
                height={100}
                width={100}
                style={{
                  borderRadius: "50%",
                  marginRight: 20,
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
            <IconButton
              onClick={() => {
                console.log("Upload");
                if (user?.avatar != "") {
                  uploadAvt(user!.id);
                  deleteObjectFirebase(user!.avatar);
                  setLoadingAvt(true);
                } else {
                  uploadAvt(user!.id);
                  setLoadingAvt(true);
                }
              }}
            >
              <CloudUploadIcon fontSize="large" color="error" />
            </IconButton>
          </Box>
          {loadingAvt ? <LinearProgress color="secondary" /> : ""}
        </Popover>
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
            <CustomButton color="error" text="SUBMIT EDIT" />
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

      <Modal
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setUser(undefined);
        }}
      >
        <Box sx={modalTheme}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Avatar
              sx={{
                textAlign: "end",
                width: 200,
                height: 200,
                ":hover": {
                  boxShadow: 4,
                },
              }}
              title={name}
              src={user?.avatar != "" ? user?.avatar : ""}
            />
            <Box
              sx={{
                ml: 5,
              }}
            >
              <Box className="dp-flex">
                <Typography>UserName : </Typography>
                <Typography>{user?.name}</Typography>
              </Box>
              <Box className="dp-flex">
                <Typography>Email : </Typography>
                <Typography>{user?.email}</Typography>
              </Box>
              <Box className="dp-flex">
                <Typography>Role : </Typography>
                <Typography>{user?.role}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
