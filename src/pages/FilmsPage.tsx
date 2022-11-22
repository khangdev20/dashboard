//#region IMPORT
import {
  Box,
  Button,
  CircularProgress,
  FormLabel,
  IconButton,
  LinearProgress,
  Modal,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import "./index.css";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useEffect, useState, useRef } from "react";
import CustomButton from "../components/Button/CustomButton";
import { CustomSpeedDial } from "../components/Button/CustomSpeedDial";
import CustomInput from "../components/Input/CustomInput";
import { styles as modalTheme } from "../../src/containts";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { useApi } from "../hooks/useApi";
import { REQUEST_TYPE } from "../Enums/RequestType";
import { GenreEntity } from "../models/GenreEntity";
import { PersonEntity } from "../models/PersonEntity";
import { useSnackbar } from "notistack";
import { ProducerEntity } from "../models/ProducerEntity";
import MenuItem from "@mui/material/MenuItem";
import { FilmEntity } from "../models/FilmEnity";
import { CustomCard } from "../components/Card/CustomCard";
import { ConfirmDialog } from "../components/Dialog/ConfirmDialog";
import { CustomMenu } from "../components/Menu/CustomMenu";
import { storage } from "../firebase/firebase";
import { connectStorageEmulator, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { PersonFilmEntity } from "../models/PersonFilmEntity";
import { GenreFilmEntity } from "../models/GenreFilmEntity";
import { getDownloadURL, deleteObject } from "firebase/storage";
import { CardFilm } from "../components/Card/CardFilm";
import { SubHeader } from "../components/Header/SubHeader";
import { Route, useNavigate } from "react-router-dom";
import { deleteObjectFirebase } from "../firebase/deleteObject";
import { info } from "console";
//#endregion

export default function FilmsPage() {
  //#region State
  const [premium, setPremium] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [resultSearchFilms, setSetResultFilms] = useState<FilmEntity[]>([]);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [replaceVideoPoster, setReplaceVideoPoster] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [genres, setGenres] = useState<GenreEntity[]>([]);
  const [persons, setPersons] = useState<PersonEntity[]>([]);
  const [producers, setProducers] = useState<ProducerEntity[]>([]);
  const [films, setFilms] = useState<FilmEntity[]>([]);
  const [film, setFilm] = useState<FilmEntity>();
  const [loading, setLoading] = useState(false);
  const [personSelects, setPersonSelects] = useState<GridRowId[]>([]);
  const [genreSelects, setGenreSelects] = useState<GridRowId[]>([]);
  const [name, setName] = useState("");
  const [describe, setDesribe] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [mobileUrl, setMobileUrl] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [age, setAge] = useState("");
  const [length, setLength] = useState(0);
  const [producer, setProducer] = useState("");
  const [keyName, setKeyName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  //#endregion

  //#region Select Media
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

  //#endregion

  //#region UPLOAD MEDIA
  const [videoUpload, setVideoUpload] = useState(null);
  const [mobileImgUpload, setMobileImgUpload] = useState(null);
  const [webImgUpload, setWebImgUpload] = useState(null);
  const uploadFilmContent = () => {
    setIsUploading(true);
    setLoadingUpload(true);
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
        enqueueSnackbar("Upload Video Success!", { variant: "info" });
      })
      .catch((err) => {
        setIsUploading(false);
        enqueueSnackbar("Upload Video Faild!", { variant: "error" });
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
        enqueueSnackbar("Upload Mobile Image Faild!", { variant: "error" });
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
  //#endregion

  //#region Handle
  const handleOpenModal = () => {
    getGenres();
    getPersons();
    getProducers();
    setOpenModal(true);
  };
  const handleOpenFormAddPerson = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAddPeson = () => setAnchorEl(null);
  const handleCloseModal = () => {
    setOpenModal(false);
    clean();
  };
  const handleCloseModalDetail = () => {
    setFilm(undefined);
    setOpenModalDetail(false);
    setReplaceVideoPoster(false);
  };
  //#endregion

  const { callApi } = useApi();

  //#region onChange
  const handleSelectProducer = (event: any) => {
    setProducer(event.target.value);
  };
  const handleSelectAge = (event: any) => {
    setAge(event.target.value);
  };
  const onChangeName = (e: any) => {
    setName(e.target.value);
  };
  const onChangeLenght = (e: any) => {
    setLength(e.target.value);
  };
  const onChangeDescribe = (e: any) => {
    setDesribe(e.target.value);
  };
  const onChangeKeyName = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setKeyName(e.target.value);
  };
  //#endregion
  const listAge = [
    { name: "5+" },
    { name: "9+" },
    { name: "12+" },
    { name: "13+" },
    { name: "14+" },
    { name: "16+" },
    { name: "17+" },
    { name: "18+" },
    { name: "25+" },
  ];

  //#region Call Api
  const getFilms = useCallback(() => {
    setLoading(true);
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
    getFilms();
  }, [getFilms]);

  const getFilmsByName = (keyName: string) => {
    callApi<FilmEntity[]>(
      REQUEST_TYPE.GET,
      `api/films/search?keyname=${keyName}`
    )
      .then((res) => {
        setSetResultFilms(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const createFilm = () => {
    setLoading(true);
    const listGenres: any = [];
    genreSelects.map((id) => {
      listGenres.push({ id: id });
      return listGenres;
    });
    const listPersons: any = [];
    personSelects.map((id) => {
      listPersons.push({ id: id });
      return listPersons;
    });
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
        setLoading(false);
        setOpenModal(false);
        getFilms();
        enqueueSnackbar("Add Film Success", { variant: "success" });
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar("Add Film Faild", { variant: "error" });
        console.error(err);
      });
  };
  const getFilmById = (id: string) => {
    callApi<FilmEntity>(REQUEST_TYPE.GET, `api/films/f?id=${id}`)
      .then((res) => {
        setFilm(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const deleteFilm = (id: string) => {
    setLoading(true);
    callApi(REQUEST_TYPE.DELETE, `api/films/${id}`)
      .then(() => {
        setLoading(false);
        getFilms();
        setOpenDialog(false);
        enqueueSnackbar("Delete Film Success", { variant: "success" });
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar("Delete Film Failed", { variant: "error" });
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

  const getGenres = () => {
    callApi<GenreEntity[]>(REQUEST_TYPE.GET, "api/genres")
      .then((res) => {
        setGenres(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
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
  //#endregion

  //#region Render Films
  const RenderFilms = (
    <>
      {films.map((value, key) => (
        <CardFilm
          key={key}
          premium={value.premium}
          src={value.mobileUrl}
          posterTitle={value.name}
          onDelete={() => {
            getFilmById(value.id);
            console.log(value.id);
            setOpenDialog(true);
          }}
          onEdit={() => enqueueSnackbar("Chưa có mần!", { variant: "error" })}
          onDetail={() => {
            getFilmById(value.id);
            setOpenModalDetail(true);
          }}
        />
      ))}
    </>
  );
  //#endregion

  //#region Result Search
  const RenderSearchFilmsResult = (
    <>
      {resultSearchFilms.map((value, key) => (
        <CardFilm
          key={key}
          src={value.mobileUrl}
          onDelete={() => {
            getFilmById(value.id);
            setOpenDialog(true);
          }}
          onEdit={() => enqueueSnackbar("Chưa có mần!", { variant: "error" })}
          onDetail={() => {
            getFilmById(value.id);
            setOpenModalDetail(true);
          }}
        />
      ))}
    </>
  );
  //#endregion

  //#region RenderDetail
  const renderDetail = (
    <Modal open={openModalDetail} onClose={handleCloseModalDetail}>
      <Box>
        <Box sx={modalTheme}>
          <Box>
            {replaceVideoPoster ? (
              <Box
                sx={{
                  ":hover": {
                    cursor: "pointer",
                  },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <iframe
                  height={300}
                  width={550}
                  src={film?.videoUrl}
                  allowTransparency
                />
              </Box>
            ) : (
              <Box
                sx={{
                  ":hover": {
                    cursor: "pointer",
                  },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  style={{
                    maxHeight: 300,
                  }}
                  src={film?.webUrl}
                  alt={`poster ${film?.name}`}
                  title={film?.name}
                />
              </Box>
            )}
            <Button
              size="medium"
              color="error"
              onClick={() => setReplaceVideoPoster(!replaceVideoPoster)}
            >
              {replaceVideoPoster ? "STOP" : "PLAY"}
            </Button>
          </Box>

          <Typography
            margin={1}
            fontSize={20}
            fontWeight="bold"
            textTransform="uppercase"
          >
            Name: {film?.name}
          </Typography>
          <Typography>Describe: {film?.describe}</Typography>
          <Typography>Views: {film?.views}</Typography>
          <Typography>Producer: {film?.producer.name}</Typography>
          <Box className="dp-flex">
            <Typography>Persons:</Typography>
            {film?.persons.map((value, key) => (
              <Typography
                key={key}
                sx={{
                  ":hover": {
                    cursor: "pointer",
                    color: "#cccd",
                  },
                }}
              >
                {value.person.name}
              </Typography>
            ))}
          </Box>
          <Box className="dp-flex">
            <Typography>Genres:</Typography>
            {film?.genres.map((value, key) => (
              <Typography
                sx={{
                  ":hover": {
                    cursor: "pointer",
                    color: "#cccd",
                  },
                }}
                onClick={() => console.log(value.genre.name)}
                key={key}
              >
                {value.genre.name}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
  //#endregion

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name Genres", width: 120 },
    { field: "created", headerName: "Created", width: 250 },
  ];
  //#region From Upload Film
  const renderUploadFilm = (
    <Modal open={openModal}>
      <Box
        sx={{
          height: "100%",
          bgcolor: "white",
          p: 4,
          borderRadius: 5,
        }}
      >
        <Typography>UPLOAD FILMS</Typography>
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
            onChange={onChangeLenght}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="dp-flex">
          <div
            style={{
              flex: 1,
            }}
          >
            <IconButton onClick={handleOpenFormAddPerson}>
              <AddIcon color="error" fontSize="medium" />
            </IconButton>
          </div>
          <div
            style={{
              textAlign: "end",
            }}
          >
            <IconButton onClick={handleOpenFormAddPerson}>
              <AddIcon color="error" fontSize="medium" />
            </IconButton>
          </div>
        </div>
        <div className="dp-flex">
          <div style={{ height: 300, width: "100%", margin: 5 }}>
            <CustomMenu anchorEl={anchorEl} horizontal="right">
              <Box
                sx={{
                  padding: 5,
                }}
              >
                <CustomInput placeholder="Name" label="Name" />
                <CustomInput placeholder="Describe" />
                <div className="dp-flex">
                  <CustomButton color="error" text="Submit" />
                  <CustomButton
                    color="inherit"
                    text="Close"
                    onClick={handleCloseAddPeson}
                  />
                </div>
              </Box>
            </CustomMenu>
            <DataGrid
              onSelectionModelChange={(itm) => {
                setGenreSelects(itm);
              }}
              rows={genres}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
            />
          </div>
          <div style={{ height: 300, width: "100%", margin: 4 }}>
            <DataGrid
              onSelectionModelChange={(itm) => {
                setPersonSelects(itm);
                console.log(itm);
              }}
              rows={persons}
              columns={columns}
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
                control={<Radio color="error" />}
                label="Premium"
                onClick={() => setPremium(true)}
              />
              <FormControlLabel
                value="normal"
                control={<Radio color="error" />}
                label="Normal"
                onClick={() => setPremium(false)}
              />
            </Box>
          </RadioGroup>
        </FormControl>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Typography>Video</Typography>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => selectVideo(e)}
          />
          <Typography>Website</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => selectWebImg(e)}
          />
          <Typography>Mobile</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => selectMobileImg(e)}
          />
        </Box>
        {isUploading ? <LinearProgress color="secondary" /> : null}
        <div className="dp-flex">
          <CustomButton
            text="UPLOAD MEDIA CONTENT"
            color="warning"
            onClick={() => {
              uploadFilmContent();
            }}
          />
          <CustomButton text={"Sumit"} color="error" onClick={createFilm} />
          <CustomButton
            text="Close"
            color="inherit"
            onClick={handleCloseModal}
          />
        </div>
      </Box>
    </Modal>
  );
  //#endregion

  const clean = () => {
    setName("");
    setProducer("");
    setAge("");
    setDesribe("");
    setLength(0);
    setGenreSelects([]);
    setPersonSelects([]);
    setVideoUpload(null);
    setMobileImgUpload(null);
    setWebImgUpload(null);
  };

  return (
    <Box>
      {loading ? <LinearProgress color="secondary" /> : ""}
      <SubHeader
        value={keyName}
        onChange={(e: any) => onChangeKeyName(e)}
        addButton={handleOpenModal}
        refreshButton={() => getFilms()}
      />
      <div className="flex-wrap">{RenderFilms}</div>
      {renderDetail}
      <ConfirmDialog
        open={openDialog}
        title="Do you really want to delete it?"
        handleCancel={() => {
          setOpenDialog(false);
        }}
        handleOk={() => {
          if (film == undefined) {
            enqueueSnackbar("FILM UNDIFIND", { variant: "error" });
          } else {
            deleteObjectFirebase(film.mobileUrl);
            deleteObjectFirebase(film.videoUrl);
            deleteObjectFirebase(film.webUrl);
            deleteFilm(film?.id);
          }
        }}
      />
      {renderUploadFilm}
    </Box>
  );
}
