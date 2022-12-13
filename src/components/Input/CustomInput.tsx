import {InputAdornment, TextField} from "@mui/material";
import {useState} from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function CustomInput({
                                        type,
                                        placeholder,
                                        label,
                                        icon,
                                        value,
                                        onChange,
                                        error,
                                        disabled,
                                    }: any) {
    const [typeText, setTypeText] = useState(false);

    return (
        <TextField
            disabled={disabled}
            error={error}
            onChange={onChange}
            value={value}
            fullWidth
            margin="normal"
            label={label}
            placeholder={placeholder}
            type={icon ? (typeText ? "text" : "password") : type}
            InputProps={{
                startAdornment: (
                    <InputAdornment
                        sx={{
                            ":hover": {
                                cursor: "pointer",
                            },
                        }}
                        position="start"
                    >
                        {icon ? (
                            <div
                                style={{
                                    position: "absolute",
                                    right: 15,
                                    top: 15,
                                    bottom: 15,
                                }}
                                onClick={() => setTypeText(!typeText)}
                            >
                                {typeText ? <VisibilityOffIcon color={'error'}/> : <VisibilityIcon color={'error'}/>}
                            </div>
                        ) : null}
                    </InputAdornment>
                ),
            }}
        />
    );
}
