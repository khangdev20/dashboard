import { Box, Modal } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import "./index.css";
import { styles as modalTheme } from "../../src/containts";
import { CustomCard } from "../components/Card/CustomCard";
import CustomInput from "../components/Input/CustomInput";
import { CustomSpeedDial } from "../components/Button/CustomSpeedDial";
import CustomButton from "../components/Button/CustomButton";
import { useApi } from "../hooks/useApi";
import { REQUEST_TYPE } from "../Enums/RequestType";
import { useSnackbar } from "notistack";
import { PackageEntity } from "../models/PackageEntity";
import { ConfirmDialog } from "../components/Dialog/ConfirmDialog";
import { SubHeader } from "../components/Header/SubHeader";

const PackagePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openFormEdit, setOpenFormEdit] = useState(false);
  const [packages, setPackages] = useState<PackageEntity[]>([]);
  const [name, setName] = useState("");
  const [pack, setPack] = useState<PackageEntity>();
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseFormEdit = () => {
    setOpenFormEdit(false);
  };

  const cleanUp = () => {
    setName("");
    setPrice(0);
    setTime(0);
  };

  const { callApi } = useApi();

  const getPackage = (id: string) => {
    callApi<PackageEntity>(REQUEST_TYPE.GET, `api/packages/${id}`)
      .then((res) => {
        const respone = res.data;
        console.log(respone);
        setPack(respone);
        setName(respone.name);
        setPrice(respone.price);
        setTime(respone.time);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deletePackage = (id: string) => {
    callApi(REQUEST_TYPE.DELETE, `api/packages/${id}`)
      .then(() => {
        enqueueSnackbar("DELETE PACKAGE SUCCESS", { variant: "success" });
        getPackages();
        setPack(undefined);
      })
      .catch((err) => {
        enqueueSnackbar("DELETE PACKAGE FAILD", { variant: "error" });
        setPack(undefined);
        console.error(err);
      });
  };

  const createPackage = () => {
    callApi(REQUEST_TYPE.POST, "api/packages", {
      name: name,
      price: price,
      time: time,
    })
      .then(() => {
        enqueueSnackbar("Add Package Success", { variant: "success" });
        setOpenModal(false);
        getPackages();
        cleanUp();
      })
      .catch((err) => {
        setOpenModal(false);
        cleanUp();
        console.log(err);
      });
  };
  const getPackages = useCallback(() => {
    callApi<PackageEntity[]>(REQUEST_TYPE.GET, "api/packages")
      .then((res) => {
        setPackages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [callApi]);

  useEffect(() => {
    getPackages();
  }, [getPackages]);

  const onChangeName = (e: any) => setName(e.target.value);
  const onChangePrice = (e: any) => setPrice(e.target.value);
  const onChangeTime = (e: any) => {
    setTime(e.target.value);
  };

  const renderPackages = (
    <Box className="flex-wrap">
      {packages.map((value, key) => (
        <CustomCard
          key={key}
          name={value.name}
          price={value.price}
          created={value.created}
          handleDelete={() => {
            setOpenConfirm(true);
            getPackage(value.id);
          }}
          handleEdit={() => {
            setOpenFormEdit(true);
            getPackage(value.id);
          }}
          handleDetail={() =>
            enqueueSnackbar("Chưa có mần kịp 😢", { variant: "error" })
          }
        />
      ))}
    </Box>
  );

  return (
    <Box>
      <SubHeader addButton={() => setOpenModal(true)} />
      {renderPackages}
      <ConfirmDialog
        open={openConfirm}
        handleCancel={() => setOpenConfirm(false)}
        title="Do you really want to delete it?"
        handleOk={() => {
          if (pack == undefined) return;
          deletePackage(pack?.id);
          setOpenConfirm(false);
        }}
      />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalTheme}>
          <CustomInput
            label="Name"
            placeholder="Name"
            onChange={onChangeName}
          />
          <CustomInput
            label="Price"
            placeholder="Price"
            onChange={onChangePrice}
          />
          <CustomInput
            label="Time"
            placeholder="Time"
            onChange={onChangeTime}
          />
          <Box className="dp-flex">
            <CustomButton color="error" text="SUBMIT" onClick={createPackage} />
            <CustomButton
              color="inherit"
              text="CLOSE"
              onClick={() => setOpenModal(false)}
            />
          </Box>
        </Box>
      </Modal>
      <Modal open={openFormEdit} onClose={handleCloseFormEdit}>
        <Box sx={modalTheme}>
          <CustomInput
            value={name}
            label="Name"
            placeholder="Name"
            onChange={onChangeName}
          />
          <CustomInput
            value={price}
            label="Price"
            placeholder="Price"
            onChange={onChangePrice}
          />
          <CustomInput
            value={time}
            label="Time"
            placeholder="Time"
            onChange={onChangeTime}
          />
          <Box className="dp-flex">
            <CustomButton color="error" text="SUBMIT" onClick={createPackage} />
            <CustomButton
              color="inherit"
              text="CLOSE"
              onClick={() => setOpenFormEdit(false)}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default PackagePage;
