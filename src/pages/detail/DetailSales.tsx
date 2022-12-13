import React, {useCallback, useEffect, useState} from "react";
import {useApi} from "../../hooks/useApi";
import {SalesEntity} from "../../models/SalesEntity";
import {REQUEST_TYPE} from "../../Enums/RequestType";
import {useNavigate, useParams} from "react-router-dom";
import {Box, Typography} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

const DetailSales = () => {

    const {callApi} = useApi();
    const [sales, setSales] = useState<SalesEntity>();
    const [total, setTotal] = useState(0);

    const navigate = useNavigate();

    const {salesId} = useParams();

    const getSalesId = useCallback(
        () => {
            callApi<SalesEntity>(REQUEST_TYPE.GET, `api/sales/${salesId}`)
                .then((res) => {
                    setSales(res.data);
                    let total = 0;
                    res.data.transactions.map((value) => {
                        if (value.status)
                            total += value.price;
                        return total;
                    })
                    setTotal(total);
                }).catch((err) => {
                console.error(err);
            })
        },
        [callApi, salesId],
    );

    const mo = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(total);

    useEffect(() => {
        return () => {
            getSalesId();
        };
    }, [getSalesId]);

    const columns: GridColDef[] = [
        {
            field: 'packageName',
            renderHeader: () => <Typography className={"style-header-grid"}>Package</Typography>,
            width: 200
        },
        {
            field: 'price',
            renderHeader: () => <Typography className={"style-header-grid"}>Price</Typography>,
            width: 200
        },
        {
            field: 'wallet',
            renderHeader: () => <Typography className={"style-header-grid"}>User Name</Typography>,
            renderCell: params => params.value.user.name,
            width: 200
        },
        {
            field: 'created',
            renderHeader: () => <Typography className={"style-header-grid"}>Created</Typography>,
            width: 200
        }
    ]

    const columnsAddfunds: GridColDef[] = [
        {
            field: 'money',
            renderHeader: () => <Typography className={"style-header-grid"}>Money</Typography>,
            width: 200
        },
        {
            field: 'wallet',
            renderHeader: () => <Typography className={"style-header-grid"}>User Name</Typography>,
            renderCell: params => params.value.user.name,
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
                <Typography margin={2} fontWeight={'bold'}>TOTAL PAYMENT: {mo}</Typography>
            </Box>
            <Box height={500}
                 sx={{
                     ':hover': {
                         cursor: 'pointer'
                     }
                 }}
            >
                <DataGrid
                    columns={columns}
                    rows={sales?.transactions === undefined ? [] : sales.transactions}
                    checkboxSelection
                    rowsPerPageOptions={[10]}
                    autoPageSize={true}
                    onCellDoubleClick={(itm) => {
                        console.log(itm.row.wallet.userId)
                        navigate(`../users/${itm.row.wallet.userId}`)
                    }}
                />
            </Box>
            <Typography margin={2} fontWeight={'bold'}>TOTAL ADD FUND: {mo}</Typography>
            <Box height={500}
                 sx={{
                     ':hover': {
                         cursor: 'pointer'
                     }
                 }}
            >
                <DataGrid
                    columns={columnsAddfunds}
                    rows={sales?.addFunds === undefined ? [] : sales.addFunds}
                    checkboxSelection
                    rowsPerPageOptions={[10]}
                    autoPageSize={true}
                    onCellDoubleClick={(itm) => {
                        navigate(`../users/${itm.row.wallet.userId}`)
                    }}
                />
            </Box>
        </Box>
    )
}

export default DetailSales;