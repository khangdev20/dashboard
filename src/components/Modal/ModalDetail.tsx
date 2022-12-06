import {Box, Button, Modal, Typography} from "@mui/material";
import {styles as modalTheme} from "../../containts";
import React from "react";

export const ModalDetail = ({
                                onClose,
                                onClick,
                                play,
                                film,
                                persons,
                                genres,
                            }: any) => {
    return (
        <Box>
            <Box sx={modalTheme}>
                {play ? (
                    <Box
                        sx={{
                            ":hover": {
                                cursor: "pointer",
                            },
                        }}
                    >
                        <iframe height={300} width={550} src={film}/>
                    </Box>
                ) : (
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
                    </Box>
                )}
                <Button size="medium" color="error" onClick={play}>
                    PLAY
                </Button>
                <Typography fontSize={20} fontWeight="bold" textTransform="uppercase">
                    Name: {film?.name}
                </Typography>
                <Typography>Description: {film?.describe}</Typography>
                <Typography>Producer: {film?.producer.name}</Typography>
                <Typography>Views: {film?.views}</Typography>
                <Box className="dp-flex">
                    <Typography>Persons:</Typography>
                    {persons.map(({value, key}: any) => (
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
                    {film?.genres.map(({value, key}: any) => (
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
        </Box>
    );
};
