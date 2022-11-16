import CustomBox from "../../../components/Box/CustomBox";
import CustomButton from "../../../components/Button/CustomButton";
import CustomInput from "../../../components/Input/CustomInput";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { baseUrl } from "../../../containts";
import { useNavigate } from "react-router-dom";
import { Box, LinearProgress } from "@mui/material";
import { useSnackbar } from "notistack";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [ip, setIP] = useState("");
  const [countryName, setCountryName] = useState("");
  const getIP = useCallback(async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    setIP(res.data.IPv4);
    setCountryName(res.data.country_name);
  }, []);
  useEffect(() => {
    getIP();
  }, [getIP]);
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    setLoading(true);
    await axios
      .post(`${baseUrl}/api/users/login`, {
        email: email,
        password: password,
        ip: ip,
        country: countryName,
      })
      .then((res) => {
        setLoading(false);
        sessionStorage.setItem("jwt", res.data);
        enqueueSnackbar("Login Success!", { variant: "success" });
        navigate("/dashboard");
        window.location.reload();
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar("Login Failed!", { variant: "error" });
        console.error(err);
      });
  };

  return (
    <div>
      {loading ? (
        <Box>
          <LinearProgress color="secondary" />
        </Box>
      ) : (
        ""
      )}
      <form>
        {loading ?? (
          <LinearProgress
            sx={{
              width: 200,
            }}
          />
        )}
        <CustomBox>
          <img
            style={{
              maxHeight: 120,
              marginTop: -20,
            }}
            alt="LOGO"
            src="https://cdn.discordapp.com/attachments/1019968445418319914/1033082905985028226/codeflix-logo.png"
          />
          <CustomInput
            margin="normal"
            placeholder="Email"
            label="Email"
            type="email"
            value={email}
            onChange={onChangeEmail}
          />

          <CustomInput
            margin="normal"
            placeholder="Password"
            label="Password"
            type="password"
            icon={true}
            value={password}
            onChange={onChangePassword}
          />

          <CustomButton onClick={handleLogin} text="LOGIN" color={"error"} />
        </CustomBox>
      </form>
    </div>
  );
}
