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
  const [packages, setPackages] = useState<PackageEntity[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const { callApi } = useApi();

  const createPackage = () => {
    callApi(REQUEST_TYPE.POST, "api/packages", {
      name: name,
      price: price,
      time: time,
    })
      .then(() => {
        enqueueSnackbar("Add Package Success", { variant: "success" });
      })
      .catch((err) => {
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
  const onChangeTime = (e: any) => setTime(e.target.value);

  const renderPackages = (
    <Box className="flex-wrap">
      {packages.map((value, key) => (
        <CustomCard
          key={key}
          name={value.name}
          price={value.price}
          created={value.created}
          handleDelete={() => setOpenConfirm(true)}
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
        title="mày muốn xóa?"
        handleOk={() => {}}
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
    </Box>
  );
};
export default PackagePage;
