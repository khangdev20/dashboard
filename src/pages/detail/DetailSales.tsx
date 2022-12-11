import React, {useCallback, useEffect, useState} from "react";
import {useApi} from "../../hooks/useApi";
import {SalesEntity} from "../../models/SalesEntity";
import {REQUEST_TYPE} from "../../Enums/RequestType";
import {useParams} from "react-router-dom";
import {Box, Typography} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

const DetailSales = () => {

    const {callApi} = useApi();
    const [sales, setSales] = useState<SalesEntity>();

    const {salesId} = useParams();

    const getSalesId = useCallback(
        () => {
            callApi<SalesEntity>(REQUEST_TYPE.GET, `api/sales/${salesId}`)
                .then((res) => {
                    setSales(res.data);
                }).catch((err) => {
                console.error(err);
            })
        },
        [callApi, salesId],
    );
    useEffect(() => {
        return () => {
            getSalesId();
        };
    }, [getSalesId]);

    const columns: GridColDef[] = [
        {
            field: 'packageName',
            renderHeader: () => <Typography className={"style-header-grid"}>Package Name</Typography>,
            width: 200
        },
        {
            field: 'wallet',
            renderHeader: () => <Typography className={"style-header-grid"}>User Name</Typography>,
            renderCell: params => params.value.user.name,
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
        }
    ]

    return (
        <Box>
            <Typography fontSize={30} fontWeight={'bold'}>{sales?.name}</Typography>
            <Box>
                <Typography>TOTAL: {}</Typography>
            </Box>
            <Box height={500}>
                <DataGrid
                    columns={columns}
                    rows={sales?.transactions === undefined ? [] : sales.transactions}
                    checkboxSelection
                    rowsPerPageOptions={[10]}
                    autoPageSize={true}
                />
            </Box>
        </Box>
    )
}

export default DetailSales;