import {
  Box,
  IconButton,
  LinearProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import "./index.css";
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
import SearchIcon from "@mui/icons-material/Search";
import { storage } from "../firebase/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { PersonFilmEntity } from "../models/PersonFilmEntity";
import { GenreFilmEntity } from "../models/GenreFilmEntity";
import { getDownloadURL, deleteObject } from "firebase/storage";
import { async } from "@firebase/util";
import { CardFilm } from "../components/Card/CardFilm";

export default function FilmsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [resultSearchFilms, setSetResultFilms] = useState<FilmEntity[]>([]);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElSearch, setAnchorElSearch] = useState<null | HTMLElement>(
    null
  );
  const [loadingUpload, setLoadingUpload] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [genres, setGenres] = useState<GenreEntity[]>([]);
  const [persons, setPersons] = useState<PersonEntity[]>([]);
  const [producers, setProducers] = useState<ProducerEntity[]>([]);
  const [films, setFilms] = useState<FilmEntity[]>([]);
  const [film, setFilm] = useState<FilmEntity>();
  const [loading, setLoading] = useState(false);
  const [personOfFilm, setPersonOfFilm] = useState<PersonFilmEntity[]>([]);
  const [genreOfFilm, setGenreOfFilm] = useState<GenreFilmEntity[]>([]);
  const [producerOfFilm, setproducerOfFilm] = useState<ProducerEntity>();
  const [personSelects, setPersonSelects] = useState<GridRowId[]>([]);
  const [genreSelects, setGenreSelects] = useState<GridRowId[]>([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [name, setName] = useState("");
  const [describe, setDesribe] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [mobileUrl, setMobileUrl] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [age, setAge] = useState("");
  const [length, setLength] = useState(0);
  const [producer, setProducer] = useState("");
  const [keyName, setKeyName] = useState("");

  const idFim = useRef("");

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

  const preview = () => {
    setLoadingUpload(true);
  };

  const previewView = (
    <Modal open={openPreview} onClose={() => setOpenPreview(false)}>
      <Box>
        <iframe src={videoUrl} />
        <img src={mobileUrl} />
        <img src={webUrl} />
      </Box>
    </Modal>
  );

  const deleteObjectFirebase = (value: string) => {
    const deleteRef = ref(storage, value);
    deleteObject(deleteRef)
      .then(() => {
        enqueueSnackbar("delete sucess", { variant: "success" });
      })
      .catch(() => {
        enqueueSnackbar("delete faild", { variant: "error" });
      });
  };

  const [videoUpload, setVideoUpload] = useState(null);
  const [mobileImgUpload, setMobileImgUpload] = useState(null);
  const [webImgUpload, setWebImgUpload] = useState(null);
  const uploadFilmContent = () => {
    setOpenPreview(true);
    setLoadingUpload(true);
    if (videoUpload == null) return;
    if (mobileImgUpload == null) return;
    if (webImgUpload == null) return;
    const videoRef = ref(storage, `videos/${v4()}`);
    uploadBytes(videoRef, videoUpload)
      .then(() => {
        getDownloadURL(videoRef).then((url) => {
          setVideoUrl(url);
        });
      })
      .catch((err) => {
        console.error(err);
      });
    const mobileRef = ref(storage, `images/${v4()}`);
    uploadBytes(mobileRef, mobileImgUpload)
      .then(() => {
        getDownloadURL(mobileRef).then((url) => {
          setMobileUrl(url);
        });
      })
      .catch((err) => {
        console.error(err);
      });
    const webRef = ref(storage, `images/${v4()}`);
    uploadBytes(webRef, webImgUpload)
      .then(() => {
        getDownloadURL(webRef).then((url) => {
          setWebUrl(url);
        });
      })
      .catch((err) => {
        console.error(err);
      });
    setLoadingUpload(false);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleOpenFormAddPerson = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAddPeson = () => setAnchorEl(null);
  const handleCloseModal = () => setOpenModal(false);
  const handleCloseModalDetail = () => {
    setFilm(undefined);
    setOpenModalDetail(false);
  };

  const handleOpenSearch = (event: any) => {
    setAnchorElSearch(event.currentTarget);
  };
  const handleCloseSearch = () => {
    setAnchorElSearch(null);
  };

  const { callApi } = useApi();

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
  const onChangeKeyName = (e: any) => {
    setKeyName(e.target.value);
  };

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

  const getFilmsByName = useCallback(
    (keyName: string) => {
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
    },
    [callApi]
  );

  useEffect(() => {
    getFilms();
  }, [getFilms]);

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
      description: describe,
      producerId: producer,
      videoUrl: videoUrl,
      webUrl: webUrl,
      mobileUrl: mobileUrl,
      length: length,
      age: age,
      people: listPersons,
      genres: listGenres,
    })
      .then(() => {
        setLoading(false);
        setOpenModal(false);
        getFilms();
        enqueueSnackbar("Add Film Success", { variant: "success" });
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar("Add Film Fail", { variant: "error" });
        console.error(err);
      });
  };

  const getFilmById = useCallback(
    (id: string) => {
      callApi<FilmEntity>(REQUEST_TYPE.GET, `api/films/${id}`)
        .then((res) => {
          setFilm(res.data);
          setproducerOfFilm(res.data.producer);
          setGenreOfFilm(res.data.genres);
          setPersonOfFilm(res.data.persons);
          getFilms();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    [callApi]
  );

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

  const getProducers = useCallback(() => {
    callApi<ProducerEntity[]>(REQUEST_TYPE.GET, "api/producers")
      .then((res) => {
        setProducers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [callApi]);

  useEffect(() => {
    getProducers();
  }, [getProducers]);

  const getGenres = useCallback(() => {
    callApi<GenreEntity[]>(REQUEST_TYPE.GET, "api/genres")
      .then((res) => {
        setGenres(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [callApi]);

  useEffect(() => {
    getGenres();
  }, [getGenres]);

  const getPersons = useCallback(() => {
    callApi<PersonEntity[]>(REQUEST_TYPE.GET, "api/persons")
      .then((res) => {
        setPersons(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [callApi]);

  useEffect(() => {
    getPersons();
  }, [getPersons]);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name Genres", width: 120 },
    { field: "created", headerName: "Created", width: 250 },
  ];

  const RenderFilms = (
    <>
      {films.map((value, key) => (
        <CardFilm
          key={key}
          src={value.mobileUrl}
          handleDelete={() => {
            idFim.current = value.id;
            setOpenDialog(true);
          }}
          handleEdit={() =>
            enqueueSnackbar("Chưa có mần!", { variant: "error" })
          }
          handleDetail={() => {
            getFilmById(value.id);
            setOpenModalDetail(true);
          }}
        />
      ))}
    </>
  );

  const RenderSearchFilmsResult = (
    <>
      {resultSearchFilms.map((value, key) => (
        <CustomCard
          key={key}
          name={value.name}
          email={value.age}
          created={value.created}
          views={value.views}
          handleDelete={() => {
            idFim.current = value.id;
            setOpenDialog(true);
          }}
          handleEdit={() =>
            enqueueSnackbar("Chưa có mần!", { variant: "error" })
          }
          handleDetail={() => {
            getFilmById(value.id);
            setOpenModalDetail(true);
          }}
        />
      ))}
    </>
  );

  const renderDetail = (
    <Modal open={openModalDetail} onClose={handleCloseModalDetail}>
      <Box sx={modalTheme}>
        <Box
          sx={{
            ":hover": {
              cursor: "pointer",
            },
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
          <iframe src={film?.videoUrl} />
        </Box>
        <Typography>Name: {film?.name}</Typography>
        <Typography>Producer: {producerOfFilm?.name}</Typography>
        <Typography>Views: {film?.views}</Typography>
        <Box className="dp-flex">
          <Typography>Person:</Typography>
          {personOfFilm.map((value, key) => (
            <Typography
              sx={{
                ":hover": {
                  cursor: "pointer",
                },
              }}
              onClick={() => console.log(value.person.name)}
              key={key}
            >
              {value.person.name}
            </Typography>
          ))}
        </Box>
        <Box className="dp-flex">
          <Typography>Genres:</Typography>
          {genreOfFilm.map((value, key) => (
            <Typography
              sx={{
                ":hover": {
                  cursor: "pointer",
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
    </Modal>
  );

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
          <Typography>Website Poster</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => selectWebImg(e)}
          />
          <Typography>Mobile Poster</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => selectMobileImg(e)}
          />
        </Box>
        {loadingUpload ? <LinearProgress color="secondary" /> : null}
        <div className="dp-flex">
          <CustomButton text={"Sumit"} color="error" onClick={createFilm} />
          <CustomButton
            text="Preview"
            color="warning"
            onClick={() => {
              uploadFilmContent();
            }}
          />
          <CustomButton
            text="Close"
            color="inherit"
            onClick={handleCloseModal}
          />
        </div>
      </Box>
    </Modal>
  );

  return (
    <Box>
      {loading ? <LinearProgress color="secondary" /> : ""}
      <CustomSpeedDial
        onClick={handleOpenModal}
        right={20}
        direction="down"
        onClickSearch={handleOpenSearch}
      />
      <CustomMenu
        horizontal="right"
        anchorEl={anchorElSearch}
        onClose={handleCloseSearch}
      >
        <Box
          sx={{
            display: "flex",
            pl: 2,
            alignItems: "center",
          }}
        >
          <CustomInput
            placeholder="Name"
            onChange={onChangeKeyName}
            value={keyName}
          />
          <IconButton
            sx={{
              width: 56,
              height: 56,
              margin: 1,
            }}
            onClick={() => getFilmsByName(keyName)}
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </CustomMenu>
      <div className="flex-wrap">
        {resultSearchFilms.length > 0 ? RenderSearchFilmsResult : RenderFilms}
      </div>
      {renderDetail}
      <ConfirmDialog
        open={openDialog}
        title="Do you really want to delete it?"
        handleCancel={() => {
          setOpenDialog(false);
          idFim.current = "";
        }}
        handleOk={() => {
          deleteFilm(idFim.current);
          //deleteObjectFirebase();
        }}
      />
      {renderUploadFilm}
      {previewView}
    </Box>
  );
}
