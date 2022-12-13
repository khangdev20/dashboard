import React, {useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    Backdrop,
    Box,
    CardMedia,
    CircularProgress, FormControl, FormControlLabel, MenuItem,
    Popover, RadioGroup,
    TextareaAutosize, TextField,
    Typography
} from "@mui/material";
import {useApi} from "../../hooks/useApi";
import {REQUEST_TYPE} from "../../Enums/RequestType";
import {FilmEntity} from "../../models/FilmEnity";
import ButtonOutlined from "../../components/Button/ButtonOutlined";
import {useSnackbar} from "notistack";
import Radio from "@mui/material/Radio";

const EditFilm = () => {
    const navigate = useNavigate();
    const [film, setFilm] = useState<FilmEntity>();
    const {filmId} = useParams();
    const {callApi} = useApi();
    const [name, setName] = useState("");
    const [describe, setDescribe] = useState("");
    const [premium, setPremium] = useState(false);
    const [loading, setLoading] = useState(false);
    const [age, setAge] = useState("");
    const [mobileUrl, setMobileUrl] = useState("");
    const [webUrl, setWebUrl] = useState("");
    const [length, setLength] = useState(0);
    const [anchorUploadMobile, setAnchorUploadMobile] =
        React.useState<HTMLButtonElement | null>(null);
    const [anchorUploadWeb, setAnchorUploadWeb] =
        React.useState<HTMLButtonElement | null>(null);
    const [mobileImgUpload, setMobileImgUpload] = useState(null);
    const [webImgUpload, setWebImgUpload] = useState(null);
    const {enqueueSnackbar} = useSnackbar();

    const handleSelectAge = (event: any) => {
        setAge(event.target.value);
    };


    const getFilmId = useCallback(
        () => {
            callApi<FilmEntity>(REQUEST_TYPE.GET, `api/films/f?id=${filmId}`)
                .then((res) => {
                    setFilm(res.data);
                    setDataFilm(res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        [callApi, filmId],
    );
    const selectMobileImg = (e: any) => {
        let selected = e.target.files[0];
        if (!selected) return;
        setMobileImgUpload(selected);
        console.log(selected);
    };
    const selectWebImg = (e: any) => {
        let selected = e.target.files[0];
        if (!selected) return;
        setWebImgUpload(selected);
        console.log(selected);
    };
    console.log(premium)

    // const uploadMobile = () => {
    //     // noinspection JSVoidFunctionReturnValueUsed
    //     const url = UploadImage(mobileImgUpload);
    //     console.log(url);
    // }

    const setDataFilm = (film: FilmEntity) => {
        setName(film.name);
        setDescribe(film.describe);
        setMobileUrl(film.mobileUrl);
        setWebUrl(film.webUrl);
        setPremium(film.premium);
        setLength(film.length);
        setAge(film.age)
    }
    const listAge = [
        {name: "5+"},
        {name: "9+"},
        {name: "12+"},
        {name: "13+"},
        {name: "14+"},
        {name: "16+"},
        {name: "17+"},
        {name: "18+"},
        {name: "25+"},
    ];

    const onChangeName = (e: any) => {
        setName(e.target.value)
    }

    const onChangeDescribe = (e: any) => {
        setDescribe(e.target.value);
    }
    const handleOpenUploadMobile = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorUploadMobile(event.currentTarget);
    };
    const handleOpenUploadWeb = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorUploadWeb(event.currentTarget);
    };
    const handleCloseUploadWeb = () => {
        setAnchorUploadWeb(null);
    }
    const handleCloseUploadAvt = () => {
        setAnchorUploadMobile(null)
    }
    const onChangeLength = (e: any) => {
        setLength(e.target.value);
    };

    const updateFilm = () => {
        console.log("edit reload")
        callApi(REQUEST_TYPE.PUT, `api/films/${filmId}`, {
            name: name,
            describe: describe,
            length: length,
            premium: premium,
            age: age,
            webUrl: webUrl,
            mobileUrl: mobileUrl,
        })
            .then(() => {
                enqueueSnackbar("Upload Film Success!", {variant: 'success'})
                navigate(`../films/${filmId}`);
            })
            .catch((err) => {
                console.error(err)
            })
    }

    useEffect(() => {
        return () => {
            getFilmId();
            console.log("edit reload")
        };
    }, [getFilmId]);

    return (
        <Box>
            <Box className={'flex-wrap just-center'}>
                <CardMedia
                    component={'img'}
                    image={webImgUpload ? URL.createObjectURL(webImgUpload) : webUrl}
                    sx={{
                        margin: 1,
                        maxWidth: 800,
                        ":hover": {
                            cursor: 'pointer',
                            boxShadow: 5
                        }
                    }}
                    onClick={(e: any) => handleOpenUploadWeb(e)}
                />
                <CardMedia
                    component={'img'}
                    image={mobileImgUpload ? URL.createObjectURL(mobileImgUpload) : mobileUrl}
                    sx={{
                        margin: 1,
                        maxWidth: 300,
                        ":hover": {
                            cursor: 'pointer',
                            boxShadow: 5
                        }
                    }}
                    onClick={(e: any) => handleOpenUploadMobile(e)}
                />
            </Box>
            <Typography fontWeight={'bold'}>FILM NAME:</Typography>
            <Box display={'flex'}>
                <TextareaAutosize
                    onChange={onChangeName}
                    value={name}
                    aria-label={'minimum height'}
                    style={{width: "100%", padding: 20, margin: 20, marginTop: 0}}
                />
            </Box>
            <Typography fontWeight={'bold'}>FILM LENGTH:</Typography>
            <Box ml={2.5} mr={2.5} display={'flex'}>
                <TextField
                    fullWidth
                    id="outlined-number"
                    type="number"
                    value={length}
                    onChange={onChangeLength}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    select
                    fullWidth
                    value={age}
                    onChange={handleSelectAge}
                    placeholder="Age"
                    label="Age"
                >
                    {listAge.map((option) => (
                        <MenuItem key={option.name} value={option.name}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
            <Typography fontWeight={'bold'}>FILM DESCRIBE:</Typography>
            <Box display={'flex'}>
                <TextareaAutosize
                    aria-label={'minimum height'}
                    onChange={onChangeDescribe}
                    value={describe}
                    style={{width: "100%", padding: 20, margin: 20, marginTop: 0}}
                />
            </Box>
            <Popover
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={Boolean(anchorUploadMobile)}
                anchorEl={anchorUploadMobile}
                onClose={handleCloseUploadAvt}
            >
                <Box pl={1} pr={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <input type={'file'} accept={"image/*"} onChange={(e: any) => selectMobileImg(e)}/>
                </Box>
                <Backdrop
                    open={loading}>
                    <CircularProgress color="error"/>
                </Backdrop>
            </Popover>
            <Popover
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={Boolean(anchorUploadWeb)}
                anchorEl={anchorUploadWeb}
                onClose={handleCloseUploadWeb}
            >
                <Box pl={1} pr={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <input type={'file'} accept={"image/*"} onChange={(e: any) => selectWebImg(e)}/>
                </Box>
                <Backdrop
                    open={false}>
                    <CircularProgress color="error"/>
                </Backdrop>
            </Popover>
            <Box display={'flex'} alignItems={'center'}>
                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={premium ? "premium" : "normal"}
                        name="radio-buttons-group"
                    >
                        <Box>
                            <FormControlLabel
                                value="premium"
                                control={<Radio color="error"/>}
                                label="Premium"
                                onClick={() => setPremium(true)}
                            />
                            <FormControlLabel
                                value="normal"
                                control={<Radio color="error"/>}
                                label="Normal"
                                onClick={() => setPremium(false)}
                            />
                        </Box>
                    </RadioGroup>
                </FormControl>
                <ButtonOutlined color={'error'} onClick={updateFilm}>
                    SUBMIT
                </ButtonOutlined>
                <ButtonOutlined onClick={() => navigate("../films")}>
                    CANCEL
                </ButtonOutlined>
            </Box>
        </Box>
    )
}

export default EditFilm;