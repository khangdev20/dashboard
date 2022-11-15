import { Box, Modal, Typography } from "@mui/material";
import React, { useCallback, useLayoutEffect, useState, useRef } from "react";
import { useSnackbar } from "notistack";
import "./index.css";
import { CustomSpeedDial } from "../components/Button/CustomSpeedDial";
import CustomInput from "../components/Input/CustomInput";
import { styles as modalTheme } from "../../src/containts";
import CustomButton from "../components/Button/CustomButton";
import { useApi } from "../hooks/useApi";
import { REQUEST_TYPE } from "../Enums/RequestType";
import { ProducerEntity } from "../models/ProducerEntity";
import { CustomCard } from "../components/Card/CustomCard";
import { ConfirmDialog } from "../components/Dialog/ConfirmDialog";

export default function ProducersPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState<ProducerEntity[]>([]);
  const [name, setName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const { callApi } = useApi();
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const idProducer = useRef("");

  const createProducer = () => {
    callApi(REQUEST_TYPE.POST, "api/producers/create", {
      name: name,
    })
      .then(() => {
        enqueueSnackbar("Add Producer Success!", { variant: "success" });
        getProducers();
        setName("");
        setOpenModal(false);
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar("Add Producer Failed!", { variant: "error" });
      });
  };

  const getProducers = useCallback(() => {
    callApi<ProducerEntity[]>(REQUEST_TYPE.GET, "api/producers")
      .then((res) => {
        if (res) setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [callApi]);

  const deleteProducer = (id: string) => {
    callApi(REQUEST_TYPE.DELETE, `api/producers/${id}`)
      .then(() => {
        getProducers();
        enqueueSnackbar("Delete Producer Success!", { variant: "success" });
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar("Delete Producer Failed!", { variant: "error" });
      });
  };

  useLayoutEffect(() => {
    getProducers();
  }, [getProducers]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box>
      <CustomSpeedDial onClick={handleOpenModal} right={20} />
      <div className="flex-wrap">
        {data.map((value, key) => (
          <CustomCard
            key={key}
            name={value.name}
            handleDelete={() => {
              setOpenDialog(true);
              idProducer.current = value.id;
            }}
          />
        ))}
      </div>
      <ConfirmDialog
        open={openDialog}
        title={"Do you really want to delete?"}
        handleOk={() => {
          setOpenDialog(false);
          deleteProducer(idProducer.current);
        }}
        handleCancel={() => setOpenDialog(false)}
      />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalTheme}>
          <Typography>ADD PRODUCER</Typography>
          <CustomInput
            placeholder="Producer Name"
            label="Producer Name "
            value={name}
            onChange={onChangeName}
          />
          <CustomButton color="error" text="SUBMIT" onClick={createProducer} />
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
