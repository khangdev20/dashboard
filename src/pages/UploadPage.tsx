import {
    Avatar, Backdrop,
    Box, CircularProgress,
    FormControl,
    FormControlLabel,
    IconButton,
    LinearProgress,
    MenuItem,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import {DataGrid, GridColDef, GridRowId} from "@mui/x-data-grid";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {useSnackbar} from "notistack";
import React, {useEffect, useState} from "react";
import {v4} from "uuid";
import CustomButton from "../components/Button/CustomButton";
import CustomInput from "../components/Input/CustomInput";
import {CustomMenu} from "../components/Menu/CustomMenu";
import {REQUEST_TYPE} from "../Enums/RequestType";
import {storage} from "../firebase/firebase";
import {useApi} from "../hooks/useApi";
import {FilmEntity} from "../models/FilmEnity";
import {GenreEntity} from "../models/GenreEntity";
import {PersonEntity} from "../models/PersonEntity";
import {ProducerEntity} from "../models/ProducerEntity";
import Radio from "@mui/material/Radio";
import AddIcon from "@mui/icons-material/Add";
import {useNavigate} from "react-router-dom";
import People from "@mui/icons-material/People";

const UploadPage = () => {
    const {enqueueSnackbar} = useSnackbar();
    const [genres, setGenres] = useState<GenreEntity[]>([]);
    const [persons, setPersons] = useState<PersonEntity[]>([]);
    const [producers, setProducers] = useState<ProducerEntity[]>([]);
    const [personSelects, setPersonSelects] = useState<GridRowId[]>([]);
    const [genreSelects, setGenreSelects] = useState<GridRowId[]>([]);
    const [name, setName] = useState("");
    const [describe, setDescribe] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [mobileUrl, setMobileUrl] = useState("");
    const [webUrl, setWebUrl] = useState("");
    const [age, setAge] = useState("");
    const [length, setLength] = useState(0);
    const [producer, setProducer] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [premium, setPremium] = useState(false);
    const navigate = useNavigate();

    const handleSelectProducer = (event: any) => {
        setProducer(event.target.value);
    };
    const handleSelectAge = (event: any) => {
        setAge(event.target.value);
    };
    const onChangeName = (e: any) => {
        setName(e.target.value);
    };
    const onChangeLength = (e: any) => {
        setLength(e.target.value);
    };
    const onChangeDescribe = (e: any) => {
        setDescribe(e.target.value);
    };

    const [videoUpload, setVideoUpload] = useState(null);
    const [mobileImgUpload, setMobileImgUpload] = useState(null);
    const [webImgUpload, setWebImgUpload] = useState(null);

    const selectVideo = (e: any) => {
        let selected = e.target.files[0];
        if (!selected) return;
        setVideoUpload(selected);
        console.log(selected);
    };
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
    const getPersons = () => {
        callApi<PersonEntity[]>(REQUEST_TYPE.GET, "api/persons")
            .then((res) => {
                setPersons(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const getGenres = () => {
        callApi<GenreEntity[]>(REQUEST_TYPE.GET, "api/genres")
            .then((res) => {
                setGenres(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const getProducers = () => {
        callApi<ProducerEntity[]>(REQUEST_TYPE.GET, "api/producers")
            .then((res) => {
                setProducers(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const uploadFilmContent = () => {
        setIsUploading(true);
        if (videoUpload == null) return;
        if (mobileImgUpload == null) return;
        if (webImgUpload == null) return;
        const videoRef = ref(storage, `videos/${v4()}`);
        uploadBytes(videoRef, videoUpload)
            .then(() => {
                setIsUploading(false);
                getDownloadURL(videoRef).then((url) => {
                    setVideoUrl(url);
                });
                enqueueSnackbar("Upload Video Success!", {variant: "info"});
            })
            .catch((err) => {
                setIsUploading(false);
                enqueueSnackbar("Upload Video Faild!", {variant: "error"});
                console.error(err);
                return;
            });
        const mobileRef = ref(storage, `images/${v4()}`);
        uploadBytes(mobileRef, mobileImgUpload)
            .then(() => {
                setIsUploading(false);
                getDownloadURL(mobileRef).then((url) => {
                    setMobileUrl(url);
                });
                enqueueSnackbar("Upload Thumbnail Mobile Success!", {
                    variant: "info",
                });
            })
            .catch((err) => {
                setIsUploading(false);
                enqueueSnackbar("Upload Mobile Image Faild!", {variant: "error"});
                console.error(err);
                return;
            });
        const webRef = ref(storage, `images/${v4()}`);
        uploadBytes(webRef, webImgUpload)
            .then(() => {
                setIsUploading(false);
                getDownloadURL(webRef).then((url) => {
                    setWebUrl(url);
                });
                enqueueSnackbar("Upload Thumbnail Website Success!", {
                    variant: "info",
                });
            })
            .catch((err) => {
                setIsUploading(false);
                enqueueSnackbar("Upload Website Thumbnail Faild!", {
                    variant: "error",
                });
                console.error(err);
                return;
            });
    };

    const columnsPersons: GridColDef[] = [
        {field: "name", headerName: "Name Person", width: 250},
        {field: "avatar", headerName: "Avatar", width: 250, renderCell: params => <Avatar src={params.value}/>},
    ];
    const columGenres: GridColDef[] = [
        {field: "name", headerName: "Name Persons", width: 120},
        {field: "created", headerName: "Created", width: 250},
    ];

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

    const {callApi} = useApi();

    const createFilm = () => {
        //#region Check Valid
        const listGenres: any = [];
        genreSelects.map((id) => {
            listGenres.push({id: id});
            return listGenres;
        });
        const listPersons: any = [];
        personSelects.map((id) => {
            listPersons.push({id: id});
            return listPersons;
        });

        if (name === "")
            return enqueueSnackbar("Chưa ghi tên mà đăng cái gì?", {
                variant: "warning",
            });
        if (producer === "")
            return enqueueSnackbar("Chưa chọn nhà sản xuất mà đăng cái gì?", {
                variant: "warning",
            });
        if (age === "") return enqueueSnackbar("Tuổi đâu?", {variant: "warning"});
        if (describe === "")
            return enqueueSnackbar("Chưa ghi mô tả mà đăng cái gì?", {
                variant: "warning",
            });
        if (length === 0)
            return enqueueSnackbar("Độ dài đâu?", {variant: "warning"});
        if (listPersons.length === 0)
            return enqueueSnackbar("Chưa có diễn diên kìa?", {
                variant: "warning",
            });
        if (listGenres.length === 0)
            return enqueueSnackbar("Chưa có thể loại kìa?", {
                variant: "warning",
            });
        if (webUrl === "")
            return enqueueSnackbar("Chưa đăng ảnh nền website kìa má?", {
                variant: "warning",
            });
        if (videoUrl === "")
            return enqueueSnackbar("Chưa đăng ảnh nền website kìa má?", {
                variant: "warning",
            });
        if (webUrl === "")
            return enqueueSnackbar("Chưa đăng ảnh nền website kìa má?", {
                variant: "warning",
            });
        //#endregion
        callApi(REQUEST_TYPE.POST, "api/films/create", {
            name: name,
            describe: describe,
            producerId: producer,
            videoUrl: videoUrl,
            premium: premium,
            webUrl: webUrl,
            mobileUrl: mobileUrl,
            length: length,
            age: age,
            people: listPersons,
            genres: listGenres,
        })
            .then(() => {
                clean();
                enqueueSnackbar("Add Film Success", {variant: "success"});
                navigate("/films");
            })
            .catch((err) => {
                enqueueSnackbar("Add Film Faild", {variant: "error"});
                console.error(err);
            });
    };

    useEffect(() => {
        getPersons();
        getGenres();
        getProducers();
    }, []);

    const clean = () => {
        setName("");
        setProducer("");
        setAge("");
        setDescribe("");
        setLength(0);
        setGenreSelects([]);
        setPersonSelects([]);
        setVideoUpload(null);
        setMobileImgUpload(null);
        setWebImgUpload(null);
    };

    const renderUploadFilm = (
        <Box
            sx={{
                height: "100%",
                bgcolor: "white",
                p: 4,
                borderRadius: 5,
            }}
        >
            <Typography>UPLOAD FILM</Typography>
            <div className="dp-flex">
                <CustomInput
                    placeholder="Name"
                    label="Name"
                    value={name}
                    onChange={onChangeName}
                />
                <TextField
                    margin="normal"
                    select
                    fullWidth
                    value={producer}
                    onChange={handleSelectProducer}
                    placeholder="Producer"
                    label="Producer"
                >
                    {producers.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    margin="normal"
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
            </div>
            <div className="dp-flex">
                <CustomInput
                    placeholder="Desribe"
                    label={`Desribe ${describe.length > 0 ? describe.length : ""}`}
                    value={describe}
                    onChange={onChangeDescribe}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    id="outlined-number"
                    label="Lenght (minutes)"
                    type="number"
                    onChange={onChangeLength}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </div>
            <div style={{justifyContent: 'center', display: 'flex'}}>
                <div style={{height: 400, width: "50%", margin: 4}}>
                    <DataGrid
                        onSelectionModelChange={(itm) => {
                            setGenreSelects(itm);
                        }}
                        rows={genres}
                        columns={columGenres}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                    />
                </div>
                <div style={{height: 400, width: "50%", margin: 4}}>
                    <DataGrid
                        onSelectionModelChange={(itm) => {
                            setPersonSelects(itm);
                        }}
                        rows={persons}
                        columns={columnsPersons}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                    />
                </div>
            </div>
            <FormControl>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
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
            <Box className="dp-flex flex-wrap">
                <Box margin={2} flex={0}>
                    {videoUpload != null ? (
                        <video controls height={200}>
                            <source src={URL.createObjectURL(videoUpload!)}/>
                        </video>
                    ) : null}
                    <input type="file" accept="video/*" onChange={(e) => selectVideo(e)}/>
                </Box>
                <Box margin={2} flex={0}>
                    {webImgUpload != null ? (
                        <img
                            alt={""}
                            style={{
                                marginRight: 20,
                                height: 200,
                            }}
                            src={URL.createObjectURL(webImgUpload)}
                        />
                    ) : (
                        ""
                    )}
                    <input type="file" accept="image/*" onChange={(e) => selectWebImg(e)}/>
                </Box>
                <Box margin={2} flex={0}>
                    {mobileImgUpload != null ? (
                        <img
                            alt={""}
                            style={{
                                marginRight: 20,
                                height: 200,
                            }}
                            src={URL.createObjectURL(mobileImgUpload)}
                        />
                    ) : (
                        ""
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => selectMobileImg(e)}
                    />
                </Box>
            </Box>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={isUploading}
            >
                <CircularProgress color="error"/>
            </Backdrop>

            <div className="dp-flex">
                <CustomButton
                    text="UPLOAD"
                    color="warning"
                    onClick={() => {
                        uploadFilmContent();
                    }}
                />
                <CustomButton text={"Submit"} color="error" onClick={createFilm}/>
                <CustomButton
                    text="BACK"
                    color="inherit"
                    onClick={() => navigate("/films")}
                />
            </div>
        </Box>
    );
    return renderUploadFilm;
};

export default UploadPage;
