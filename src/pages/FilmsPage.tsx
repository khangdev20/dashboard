//#region IMPORT
import {
    Box,
    Button,
    IconButton,
    LinearProgress,
    Modal,
    RadioGroup,
    Rating,
    TextField,
    Typography,
} from "@mui/material";
import "./index.css";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import AddIcon from "@mui/icons-material/Add";
import {useCallback, useEffect, useState} from "react";
import CustomButton from "../components/Button/CustomButton";
import CustomInput from "../components/Input/CustomInput";
import {styles as modalTheme} from "../../src/containts";
import {DataGrid, GridColDef, GridRowId} from "@mui/x-data-grid";
import {useApi} from "../hooks/useApi";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {GenreEntity} from "../models/GenreEntity";
import {PersonEntity} from "../models/PersonEntity";
import {useSnackbar} from "notistack";
import {ProducerEntity} from "../models/ProducerEntity";
import MenuItem from "@mui/material/MenuItem";
import {FilmEntity} from "../models/FilmEnity";
import {ConfirmDialog} from "../components/Dialog/ConfirmDialog";
import {CustomMenu} from "../components/Menu/CustomMenu";
import {storage} from "../firebase/firebase";
import {ref, uploadBytes} from "firebase/storage";
import {v4} from "uuid";
import {getDownloadURL} from "firebase/storage";
import {CardFilm} from "../components/Card/CardFilm";
import {SubHeader} from "../components/Header/SubHeader";
import {useNavigate} from "react-router-dom";
import {deleteObjectFirebase} from "../firebase/deleteObject";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
//#endregion

export default function FilmsPage() {
    //#region State
    const [openDialog, setOpenDialog] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const [films, setFilms] = useState<FilmEntity[]>([]);
    const [film, setFilm] = useState<FilmEntity>();
    const [loading, setLoading] = useState(false);
    const [keyName, setKeyName] = useState("");
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

    const deleteFilm = (id: string) => {
        setLoading(true);
        callApi(REQUEST_TYPE.DELETE, `api/films/${id}`)
            .then(() => {
                setLoading(false);
                getFilms();
                setOpenDialog(false);
                enqueueSnackbar("Delete Film Success", {variant: "success"});
            })
            .catch((err) => {
                setLoading(false);
                enqueueSnackbar("Delete Film Failed", {variant: "error"});
                console.error(err);
            });
    };

    //#region Render Films
    const RenderFilms = (
        <Box display={'flex'} >
            {films.map((value, key) => (
                <CardFilm
                    title={value.name}
                    key={key}
                    premium={value.premium}
                    src={value.mobileUrl}
                    posterTitle={value.name}
                    name={value.name}
                    onClick={() => {
                        navigate(`${value.id}`);
                    }}
                />
            ))}
        </Box>
    );
    //#endregion

    return (
        <Box>
            {loading ? <LinearProgress color="secondary"/> : ""}
            <SubHeader
                value={keyName}
                addButton={() => navigate("/films/upload")}
                refreshButton={() => getFilms()}
            />
            <Box overflow={"auto"} >
                {RenderFilms}
            </Box>
            <ConfirmDialog
                open={openDialog}
                title="Do you really want to delete it?"
                handleCancel={() => {
                    setOpenDialog(false);
                }}
                handleOk={() => {
                    if (film === undefined) {
                        enqueueSnackbar("FILM UNDEFINED", {variant: "error"});
                    } else {
                        deleteObjectFirebase(film.videoUrl);
                        deleteObjectFirebase(film.mobileUrl);
                        deleteObjectFirebase(film.webUrl);
                        deleteFilm(film?.id);
                    }
                }}
            />
        </Box>
    );
}
