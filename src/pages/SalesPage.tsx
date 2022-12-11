import React, {useCallback, useEffect, useState} from "react";
import {Box, Typography} from "@mui/material";
import {useApi} from "../hooks/useApi";
import {SalesEntity} from "../models/SalesEntity";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {DataGrid, GridColDef, GridRowId} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";
import ButtonOutlined from "../components/Button/ButtonOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SalesPage() {

    const {callApi} = useApi();
    const [sales, setSales] = useState<SalesEntity[]>([]);
    const [salesSelects, setSalesSelects] = useState<GridRowId[]>([]);
    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();

    const getSales = useCallback(
        () => {
            callApi<SalesEntity[]>(REQUEST_TYPE.GET, "api/sales")
                .then((res) => {
                    setSales(res.data);
                }).catch((err) => {
                console.error(err);
            })
        },
        [callApi],
    );

    const deleteSales = (id: any) => {
        callApi(REQUEST_TYPE.DELETE, `api/sales/${id}`)
            .then(() => {
                enqueueSnackbar("DELETE SALES SUCCESS!", {variant: 'success'})
                getSales();
            })
            .catch((err) => {
                console.error(err)
            })
    }


    useEffect(() => {
        return () => {
            getSales()
        };
    }, [getSales]);

    const columns: GridColDef[] = [
        {
            field: "name",
            renderHeader: () => <Typography className={"style-header-grid"}>Name</Typography>,
            width: 200
        },
        {
            field: "dateStart",
            renderHeader: () => <Typography className={"style-header-grid"}>Date Start</Typography>,
            width: 200
        },
        {
            field: "dateEnd",
            renderHeader: () => <Typography className={"style-header-grid"}>Date End</Typography>,
            width: 200
        },
        {
            field: "created",
            renderHeader: () => <Typography className={"style-header-grid"}>Created</Typography>,
            width: 200
        },
    ]

    return (
        <Box>
            <Box height={500} sx={{
                ":hover": {
                    cursor: 'pointer'
                }
            }}>
                <DataGrid
                    checkboxSelection
                    columns={columns}
                    rows={sales}
                    autoPageSize={true}
                    onSelectionModelChange={(itm) => setSalesSelects(itm)}
                    onCellDoubleClick={(itm) => navigate(`${itm.id}`)}/>
            </Box>
            <ButtonOutlined color={"error"} onClick={() => deleteSales(salesSelects[0])}>
                <DeleteIcon/>
            </ButtonOutlined>
        </Box>
    )
}
