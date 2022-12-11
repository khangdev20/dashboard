import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import "./index.css";
import {styles as modalTheme} from "../../src/containts";
import {CustomCard} from "../components/Card/CustomCard";
import CustomInput from "../components/Input/CustomInput";
import CustomButton from "../components/Button/CustomButton";
import {useApi} from "../hooks/useApi";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {useSnackbar} from "notistack";
import {PackageEntity} from "../models/PackageEntity";
import {ConfirmDialog} from "../components/Dialog/ConfirmDialog";
import ButtonOutlined from "../components/Button/ButtonOutlined";
import {AddCircle} from "@mui/icons-material";
import {DataGrid, GridColDef, GridRowId} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const PackagePage = () => {
    const {enqueueSnackbar} = useSnackbar();
    const [openModal, setOpenModal] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openFormEdit, setOpenFormEdit] = useState(false);
    const [packages, setPackages] = useState<PackageEntity[]>([]);
    const [name, setName] = useState("");
    const [pack, setPack] = useState<PackageEntity>();
    const [price, setPrice] = useState(0);
    const [time, setTime] = useState(0);
    const [packageSelects, setPackageSelects] = useState<GridRowId[]>([]);
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleCloseFormEdit = () => {
        setOpenFormEdit(false);
    };

    const handleOpenFormEdit = () => {
        if (packageSelects.length === 0) return enqueueSnackbar("Please choose a package!", {variant: 'warning'})
        if (packageSelects.length > 1) return enqueueSnackbar("Please choose a package!", {variant: 'warning'})
        setOpenFormEdit(true);
        getPackage(packageSelects[0]);
    }

    const handleOpendialog = () => {
        if (packageSelects.length > 1) return enqueueSnackbar("Please choose a package!", {variant: 'warning'})
        if (packageSelects.length === 0) return enqueueSnackbar("Please choose a package!", {variant: 'warning'})
        setOpenConfirm(true);
    }

    const handleCloseDialog = () => {
        setOpenConfirm(false);
    }

    const cleanUp = () => {
        setName("");
        setPrice(0);
        setTime(0);
        setPackageSelects([]);
    };

    const {callApi} = useApi();

    const getPackage = (id: any) => {
        callApi<PackageEntity>(REQUEST_TYPE.GET, `api/packages/${id}`)
            .then((res) => {
                const response = res.data;
                setPack(response);
                setName(response.name);
                setPrice(response.price);
                setTime(response.time);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const deletePackage = (id: any) => {
        callApi(REQUEST_TYPE.DELETE, `api/packages/${id}`)
            .then(() => {
                enqueueSnackbar("DELETE PACKAGE SUCCESS", {variant: "success"});
                getPackages();
                setPack(undefined);
                setOpenConfirm(false);
            })
            .catch((err) => {
                enqueueSnackbar("DELETE PACKAGE FAILD", {variant: "error"});
                setPack(undefined);
                console.error(err);
            });
    };

    const updatePackage = (id: any) => {
        callApi(REQUEST_TYPE.PUT, `api/packages/${id}`, {
            name: name,
            price: price,
            time: time,
        })
            .then(() => {
                getPackages();
                setOpenFormEdit(false)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const createPackage = () => {
        callApi(REQUEST_TYPE.POST, "api/packages", {
            name: name,
            price: price,
            time: time,
        })
            .then(() => {
                enqueueSnackbar("Add Package Success", {variant: "success"});
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
        return () => {
            getPackages()
        };
    }, [getPackages]);

    //#region onChange
    const onChangeName = (e: any) => setName(e.target.value);
    const onChangePrice = (e: any) => setPrice(e.target.value);
    const onChangeTime = (e: any) => setTime(e.target.value);
    //#endregion

    const columns: GridColDef[] = [
        {
            field: 'name',
            renderHeader: () => <Typography className={"style-header-grid"}>Package Name</Typography>,
            width: 200
        },
        {
            field: 'price',
            renderHeader: () => <Typography className={"style-header-grid"}>Price</Typography>,
            width: 200
        },
        {
            field: 'created',
            renderHeader: () => <Typography className={"style-header-grid"}>Created</Typography>,
            width: 200
        },
    ]

    return (
        <Box>
            <Box height={400}>
                <DataGrid
                    columns={columns}
                    rows={packages}
                    checkboxSelection
                    onSelectionModelChange={(itm) => setPackageSelects(itm)}
                />
            </Box>
            <ButtonOutlined color={'success'} onClick={() => setOpenModal(true)}>
                <AddCircle/>
            </ButtonOutlined>
            <ButtonOutlined color={'error'} onClick={handleOpendialog}>
                <DeleteIcon/>
            </ButtonOutlined>
            <ButtonOutlined onClick={handleOpenFormEdit}>
                <EditIcon/>
            </ButtonOutlined>
            <ConfirmDialog
                open={openConfirm}
                handleCancel={handleCloseDialog}
                title="Do you really want to delete it?"
                handleOk={() => {
                    if (packageSelects.length === 0) return;
                    deletePackage(packageSelects[0]);
                    setOpenConfirm(false);
                }}
            />
            <Modal open={openModal} onClose={handleCloseModal}>
                <form onSubmit={(e: any) => e.preventDefault()}>
                    <Box sx={modalTheme}>
                        <Typography>ADD PACKAGE</Typography>
                        <Box width={350}>
                            <CustomInput
                                label="Name"
                                placeholder="Name"
                                onChange={onChangeName}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                id="outlined-number"
                                label="Price"
                                placeholder="Price"
                                type="number"
                                onChange={onChangePrice}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                id="outlined-number"
                                placeholder="Time"
                                label="Time"
                                type="number"
                                onChange={onChangeTime}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                        <CustomButton type={'submit'} color="error" text="SUBMIT" onClick={createPackage}/>
                        <CustomButton
                            color="inherit"
                            text="CLOSE"
                            onClick={() => setOpenModal(false)}
                        />
                    </Box>
                </form>
            </Modal>
            <Modal open={openFormEdit} onClose={handleCloseFormEdit}>
                <Box sx={modalTheme}>
                    <Typography fontWeight={'bold'}>EDIT PACKAGE</Typography>
                    <Box width={350}>
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
                    </Box>
                    <CustomButton
                        color="error"
                        text="SUBMIT"
                        type={'submit'}
                        onClick={() => updatePackage(packageSelects[0])}
                    />
                    <CustomButton
                        color="inherit"
                        text="CLOSE"
                        onClick={() => setOpenFormEdit(false)}
                    />
                </Box>
            </Modal>
        </Box>
    );
};
export default PackagePage;
