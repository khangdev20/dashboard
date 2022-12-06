import {
    Card, CardMedia,
} from "@mui/material";
import {PremiumTag} from "../Tag/PremiumTag";

export const CardFilm = ({
                             src,
                             onClick,
                             premium,
                         }: any) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                boxShadow: 5,
                borderRadius: 4,
                display: 'flex',
                m: 2,
                ":hover": {
                    boxShadow: 20,
                    cursor: "pointer",
                },
                minWidth: 200,
                maxWidth: 200
            }}
        >

            <CardMedia
                component={"img"}
                image={src}
            />
        </Card>
    );
};
