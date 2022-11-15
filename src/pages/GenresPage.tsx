import React, { useState, useCallback, useEffect, useRef } from "react";
import { CustomSpeedDial } from "../components/Button/CustomSpeedDial";
import { styles as modalTheme } from "../../src/containts";
import CustomInput from "../components/Input/CustomInput";
import { Box, Modal, Typography, LinearProgress } from "@mui/material";
import CustomButton from "../components/Button/CustomButton";
import { GenreEntity } from "../models/GenreEntity";
import { useApi } from "../hooks/useApi";
import { REQUEST_TYPE } from "../Enums/RequestType";
import { useSnackbar } from "notistack";
import { CustomCard } from "../components/Card/CustomCard";
import { ConfirmDialog } from "../components/Dialog/ConfirmDialog";
import "./index.css";

export default function GenresPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GenreEntity[]>([]);
  const [name, setName] = useState("");
  const { callApi } = useApi();

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const idGenre = useRef("");

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const createGenres = () => {
    callApi<GenreEntity>(REQUEST_TYPE.POST, "api/genres/create", {
      name: name,
    })
      .then(() => {
        setName("");
        getGenres();
        setOpenModal(false);
        enqueueSnackbar("Add Genre Success!", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Add Genre Fail!", { variant: "error" });
        console.error(err);
      });
  };

  const getGenres = useCallback(() => {
    setLoading(true);
    callApi<GenreEntity[]>(REQUEST_TYPE.GET, "api/genres")
      .then((res) => {
        setLoading(false);
        setData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [callApi]);

  const deleteGenre = (id: string) => {
    setOpenDialog(true);
    callApi(REQUEST_TYPE.DELETE, `api/genres/${id}`)
      .then(() => {
        setOpenDialog(false);
        idGenre.current = "";
        getGenres();
        enqueueSnackbar("Delete Genre Success!", { variant: "success" });
      })
      .catch((err) => {
        setOpenDialog(false);
        enqueueSnackbar("Delete Genre Fail!", { variant: "error" });
        console.error(err);
      });
  };

  useEffect(() => {
    getGenres();
  }, [getGenres]);

  return (
    <Box>
      {loading ? <LinearProgress color="secondary" /> : ""}
      <CustomSpeedDial onClick={handleOpenModal} right={20} />
      <Box className="flex-wrap">
        {data.map((value, key) => (
          <CustomCard
            key={key}
            name={value.name}
            handleDelete={() => {
              setOpenDialog(true);
              idGenre.current = value.id;
            }}
          />
        ))}
      </Box>
      <ConfirmDialog
        open={openDialog}
        title="Do you really want to delete it?"
        handleCancel={() => setOpenDialog(false)}
        handleOk={() => deleteGenre(idGenre.current)}
      />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalTheme}>
          <Typography>ADD GENRES</Typography>
          <CustomInput
            placeholder="Genres"
            label="Genres"
            value={name}
            onChange={onChangeName}
          />
          <CustomButton color="error" text="SUBMIT" onClick={createGenres} />
          <CustomButton
            color="inherit"
            text="CLOSE"
            onClick={handleCloseModal}
          />
        </Box>
      </Modal>
    </Box>
  );
}
