//#region IMPORT
import {
    Box,
    LinearProgress, Typography,
} from "@mui/material";
import "./index.css";
import {useCallback, useEffect, useState} from "react";
import {DataGrid, GridColDef, GridRowId} from "@mui/x-data-grid";
import {useApi} from "../hooks/useApi";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {useSnackbar} from "notistack";
import {FilmEntity} from "../models/FilmEnity";
import {ConfirmDialog} from "../components/Dialog/ConfirmDialog";
import {SubHeader} from "../components/Header/SubHeader";
import {useNavigate} from "react-router-dom";
import {deleteObjectFirebase} from "../firebase/deleteObject";
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import CheckIcon from '@mui/icons-material/Check';
import ButtonOutlined from "../components/Button/ButtonOutlined";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import {DoneAll} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
//#endregion

export default function FilmsPage() {
    //#region State
    const {enqueueSnackbar} = useSnackbar();
    const [films, setFilms] = useState<FilmEntity[]>([]);
    const [loading, setLoading] = useState(false);
    const [filmSelects, setFilmSelects] = useState<GridRowId[]>([]);
    const navigate = useNavigate();
    const {callApi} = useApi();

    //#region Call Api
    const getFilms = useCallback(() => {
        setLoading(true);
        console.log('films')
        callApi<FilmEntity[]>(REQUEST_TYPE.GET, "api/films")
            .then((res) => {
                setLoading(false);
                setFilms(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [callApi]);

    useEffect(() => {
        return () => {
            getFilms()
        };
    }, [getFilms]);

    const onClickMoveToEdit = () => {
        if (filmSelects.length === 0) return enqueueSnackbar("Please select a film!", {variant: 'warning'})
        if (filmSelects.length > 1) return enqueueSnackbar("Please select a film!", {variant: 'warning'})
        navigate(`edit/${filmSelects[0]}`)
    }



    const columns: GridColDef[] = [
        {
            field: 'webUrl',
            renderHeader: () => <Typography className={"style-header-grid"}>Poster</Typography>,
            renderCell: params => <img width={100} alt={''} src={params.value}/>,
            headerAlign: 'center',
        },
        {
            field: 'name',
            renderHeader: () => <Typography className={"style-header-grid"}>Name</Typography>,
            headerAlign: 'center',
            width: 200
        },
        {
            field: 'views',
            renderHeader: () => <Typography className={"style-header-grid"}>Views</Typography>,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'producer',
            renderHeader: () => <Typography className={"style-header-grid"}>Producer</Typography>,
            renderCell: params => params.value.name,
            headerAlign: 'center'
        },
        {
            field: 'premium',
            renderHeader: () => <Typography className={"style-header-grid"}>Premium</Typography>,
            renderCell: params => params.value ? <DoneAll color={'success'}/> : <RemoveDoneIcon color={'error'}/>,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'age',
            renderHeader: () => <Typography className={"style-header-grid"}>Age</Typography>,
            headerAlign: 'center',
            align: 'center'
        }
    ]
    console.log(films)
    return (
        <Box>
            {loading ? <LinearProgress color="secondary"/> : ""}
            <Box sx={{
                ":hover": {
                    cursor: 'pointer'
                },
                height: 500
            }}>
                <DataGrid
                    onCellDoubleClick={(itm) => navigate(`${itm.id}`)}
                    columns={columns}
                    rows={films}
                    autoPageSize={true}
                    onSelectionModelChange={(itm) => setFilmSelects(itm)}
                    checkboxSelection
                />
            </Box>
            <ButtonOutlined onClick={() => navigate("upload")} color={"success"}>
                <AddIcon/>
            </ButtonOutlined>
            <ButtonOutlined onClick={() => getFilms()}>
                <RefreshIcon/>
            </ButtonOutlined>
            <ButtonOutlined color={'secondary'} onClick={onClickMoveToEdit}>
                <EditIcon/>
            </ButtonOutlined>
        </Box>
    );
}
