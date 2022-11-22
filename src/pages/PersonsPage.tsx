import React, { useCallback, useEffect, useState, useRef } from "react";
import { CustomSpeedDial } from "../components/Button/CustomSpeedDial";
import {
  Modal,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
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
import { SubHeader } from "../components/Header/SubHeader";

export default function PersonsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [person, setPerson] = useState<PersonEntity>();
  const [name, setName] = useState("");
  const [sex, setSex] = useState(true);
  const [describe, setDescribe] = useState("");
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [data, setData] = useState<PersonEntity[]>([]);

  const idPerson = useRef("");

  const { callApi } = useApi();

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onChangeDescribe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescribe(e.target.value);
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
      describe: describe,
      sex: sex,
    })
      .then(() => {
        setName("");
        setDescribe("");
        setOpenModal(false);
        getPersons();
        enqueueSnackbar("Add Person Success!", { variant: "success" });
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar("Add Person Fail!", { variant: "error" });
      });
  };

  const getPersonId = (id: string) => {
    callApi<PersonEntity>(REQUEST_TYPE.GET, `api/persons/${id}`)
      .then((res) => {
        setPerson(res.data);
      })
      .catch((err) => {
        console.error(err);
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
      <SubHeader addButton={handleOpenModal} />
      <div className="flex-wrap">
        {data.map((value, key) => (
          <CustomCard
            key={key}
            name={value.name}
            handleDelete={() => {
              setOpenDialog(true);
              getPersonId(value.id);
            }}
            handleDetail={() => {
              getPersonId(value.id);
              setOpenDetail(true);
            }}
          />
        ))}
      </div>
      <ConfirmDialog
        open={openDialog}
        title="Do you really want to delete it?"
        handleCancel={() => {
          setOpenDialog(false);
          setPerson(undefined);
        }}
        handleOk={() => deletePerson(person!.id)}
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
            value={describe}
            onChange={onChangeDescribe}
          />

          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="male"
              name="radio-buttons-group"
            >
              <Box>
                <FormControlLabel
                  value="male"
                  control={<Radio color="error" />}
                  label="Male"
                  onClick={() => setSex(true)}
                />
                <FormControlLabel
                  value="female"
                  control={<Radio color="error" />}
                  label="Female"
                  onClick={() => setSex(false)}
                />
              </Box>
            </RadioGroup>
          </FormControl>
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
      <Modal open={openDetail} onClose={() => setOpenDetail(false)}>
        <Box sx={modalTheme}>
          <Typography>{person?.id}</Typography>
          <Box className="dp-flex">
            <Typography>Person name:</Typography>
            <Typography>{person?.name}</Typography>
          </Box>
          <Box className="dp-flex">
            <Typography>Describe:</Typography>
            <Typography>{person?.describe}</Typography>
          </Box>
          <Box className="dp-flex">
            <Typography>Gioi tinh:</Typography>
            <Typography>{person?.sex ? "Male" : "Female"}</Typography>
          </Box>
          <Box className="dp-flex">
            <Typography>Films: </Typography>
            {person?.films.map((value, key) => (
              <Typography key={key}>{value.film.name}</Typography>
            ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
