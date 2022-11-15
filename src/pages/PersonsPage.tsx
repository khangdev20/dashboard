import React, { useCallback, useEffect, useState, useRef } from "react";
import { CustomSpeedDial } from "../components/Button/CustomSpeedDial";
import { Modal, Box, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import "./index.css";
import { styles as modalTheme } from "../../src/containts";
import CustomInput from "../components/Input/CustomInput";
import CustomButton from "../components/Button/CustomButton";
import { useApi } from "../hooks/useApi";
import { REQUEST_TYPE } from "../Enums/RequestType";
import { PersonEntity } from "../models/PersonEntity";
import { CustomCard } from "../components/Card/CustomCard";
import { ConfirmDialog } from "../components/Dialog/ConfirmDialog";

export default function PersonsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [data, setData] = useState<PersonEntity[]>([]);

  const idPerson = useRef("");

  const { callApi } = useApi();

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onChangeDescribe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const getPersons = useCallback(() => {
    callApi<PersonEntity[]>(REQUEST_TYPE.GET, "api/persons")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [callApi]);

  const createPerson = () => {
    callApi(REQUEST_TYPE.POST, "api/persons/create", {
      name: name,
      description: description,
    })
      .then(() => {
        setName("");
        setDescription("");
        setOpenModal(false);
        getPersons();
        enqueueSnackbar("Add Person Success!", { variant: "success" });
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar("Add Person Fail!", { variant: "error" });
      });
  };

  const deletePerson = (id: string) => {
    setOpenDialog(false);
    callApi(REQUEST_TYPE.DELETE, `api/persons/${id}`)
      .then(() => {
        idPerson.current = "";
        getPersons();
        enqueueSnackbar("Delete Person Success!", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Delete Person Fail!", { variant: "error" });
        console.error(err);
      });
  };

  useEffect(() => {
    getPersons();
  }, [getPersons]);
  return (
    <Box>
      <CustomSpeedDial onClick={handleOpenModal} right={20} />
      <div className="flex-wrap">
        {data.map((value, key) => (
          <CustomCard
            key={key}
            name={value.name}
            describe={value.description}
            handleDelete={() => {
              setOpenDialog(true);
              idPerson.current = value.id;
            }}
            handleDetail={() => {
              enqueueSnackbar("Chưa làm!", { variant: "error" });
            }}
          />
        ))}
      </div>
      <ConfirmDialog
        open={openDialog}
        title="Do you really want to delete it?"
        handleCancel={() => setOpenDialog(false)}
        handleOk={() => deletePerson(idPerson.current)}
      />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalTheme}>
          <Typography>ADD Person</Typography>
          <CustomInput
            placeholder="Person Name"
            label="Person Name"
            value={name}
            onChange={onChangeName}
          />
          <CustomInput
            placeholder="Person Describe"
            label="Person Describe"
            value={description}
            onChange={onChangeDescribe}
          />
          <Box
            sx={{
              display: "flex",
            }}
          >
            <CustomButton color="error" text="SUBMIT" onClick={createPerson} />
            <CustomButton
              color="inherit"
              text="CLOSE"
              onClick={handleCloseModal}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
