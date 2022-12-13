import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import React, {useCallback, useState, useEffect} from "react";
import {useSnackbar} from "notistack";
import "./index.css";
import CustomInput from "../components/Input/CustomInput";
import {styles as modalTheme} from "../../src/containts";
import CustomButton from "../components/Button/CustomButton";
import {useApi} from "../hooks/useApi";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {ProducerEntity} from "../models/ProducerEntity";
import {ConfirmDialog} from "../components/Dialog/ConfirmDialog";
import {DataGrid, GridColDef, GridRowId} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {AddCircle} from "@mui/icons-material";
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import Toolbar from "@mui/material/Toolbar";
import ButtonOutlined from "../components/Button/ButtonOutlined";
import CustomBox from "../components/Box/CustomBox";

export default function ProducersPage() {
    const {enqueueSnackbar} = useSnackbar();
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState<ProducerEntity[]>([]);
    const [producerSelects, setProducerSelects] = useState<GridRowId[]>([]);
    const [name, setName] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const {callApi} = useApi();

    const navigate = useNavigate();
    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const createProducer = () => {
        if (name === "") return enqueueSnackbar("Producer name is empty!", {variant: "warning"})
        callApi(REQUEST_TYPE.POST, "api/producers/create", {
            name: name,
        })
            .then((res) => {
                enqueueSnackbar("Add Producer Success!", {variant: "success"});
                getProducers();
                setOpenModal(false);
                clean();
            })
            .catch((err) => {
                console.log(err.data.statusCodeResult.statusCode);
                enqueueSnackbar("Add Producer Failed!", {variant: "error"});
            });
    };
    const clean = () => {
        setName("");
    };

    const getProducers = useCallback(() => {
        console.log("getProducers");
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
                enqueueSnackbar("Delete Producer Success!", {variant: "success"});
            })
            .catch((err) => {
                console.error(err);
                enqueueSnackbar("Delete Producer Failed!", {variant: "error"});
            });
    };

    const deleteProducerSelected = () => {
        if (producerSelects.length === 0) return enqueueSnackbar("Please choose producers before delete!", {variant: "warning"});
        const listProducers: any = []
        producerSelects.map((id) => {
            listProducers.push({id: id});
            return listProducers;
        });
        console.log(listProducers);
        callApi(REQUEST_TYPE.POST, "api/producers/remove-selected", {
            producers: listProducers
        }).then(() => {
            enqueueSnackbar("DELETE SUCCESS", {variant: 'success'})
            getProducers();
            setOpenDialog(false);
        }).catch((err) => {
            console.error(err)
            enqueueSnackbar("DELETE FAILED", {variant: 'error'})
        })
    }

    useEffect(() => {
        return () => {
            getProducers();
        };
    }, [getProducers]);


    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const columnProducers: GridColDef[] = [
        {
            field: "name",
            renderHeader: () => <Typography className={"style-header-grid"}>Producer Name</Typography>,
            width: 250,
            headerAlign: 'center',
        },
        {
            field: 'films',
            renderHeader: () => <Typography className={"style-header-grid"}>Films</Typography>,
            renderCell: (index) => index.value.length ? index.value.length : '',
            align:'center',
            headerAlign: 'center'

        }
    ];

    return (
        <Box>
            <Box sx={{
                width: '100%',
                ":hover": {
                    cursor: 'pointer'
                },
                height: 600
            }}>
                <DataGrid
                    rows={data}
                    columns={columnProducers}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    onCellDoubleClick={(itm) => {
                        navigate(`${itm.id}`)
                    }}
                    autoHeight={true}
                    checkboxSelection
                    onSelectionModelChange={(item) => {
                        setProducerSelects(item);
                    }}
                />
            </Box>
            <Box m={1}>
                <ButtonOutlined onClick={() => setOpenModal(true)}>
                    ADD NEW PRODUCER
                    <AddToPhotosIcon fontSize={'small'}/>
                </ButtonOutlined>
                <ButtonOutlined color={"error"} onClick={() => setOpenDialog(true)}>
                    DELETE PRODUCER IS SELECTED
                    <DeleteIcon fontSize={"small"}/>
                </ButtonOutlined>
            </Box>

            <ConfirmDialog
                open={openDialog}
                title={`Do you really want to delete ${producerSelects.length} producers?`}
                handleOk={deleteProducerSelected}
                handleCancel={() => setOpenDialog(false)}
            />

            <Modal open={openModal} onClose={handleCloseModal}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Box sx={modalTheme}>
                        <Box width={400} display={'flex'} flexDirection={"column"} alignItems={'center'}>
                            <Typography fontWeight={'bold'}>ADD PRODUCER</Typography>
                            <CustomInput
                                placeholder="Producer Name"
                                label="Producer Name "
                                value={name}
                                onChange={onChangeName}
                            />
                            <CustomButton color="error" text="SUBMIT" onClick={createProducer} type={'submit'}/>
                            <CustomButton
                                color="inherit"
                                text="CLOSE"
                                onClick={handleCloseModal}
                            />
                        </Box>
                    </Box>
                </form>
            </Modal>
        </Box>
    );
}
