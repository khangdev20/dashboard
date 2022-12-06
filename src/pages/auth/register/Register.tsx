import {Button} from "@mui/material";
import axios from "axios";
import {useState} from "react";
import {Link} from "react-router-dom";
import CustomBox from "../../../components/Box/CustomBox";
import CustomButton from "../../../components/Button/CustomButton";
import CustomInput from "../../../components/Input/CustomInput";
import {baseUrl} from "../../../containts";
import {UserEntity} from "../../../models/UserEntity";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [correct, setCorrect] = useState(false);

    const onChanegName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };
    const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };
    const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };
    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const onChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    };
    const handleLogin = async () => {
        if (password === confirmPassword) {
            console.log("Passord is correct");
            setCorrect(false);
            await axios.post<UserEntity>(`${baseUrl}/api/users/register`, {
                name: name,
                email: email,
                phone: phone,
                password: password,
                role: "Adminstrator",
            });
        } else {
            console.log("Password is not correct");
            setCorrect(true);
        }
    };

    return (
        <div>
            <form>
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
                        label="Name"
                        placeholder="Name"
                        type="text"
                        value={name}
                        onChange={onChanegName}
                    />
                    <CustomInput
                        label="Email"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={onChangeEmail}
                    />
                    <CustomInput
                        label="Phone"
                        placeholder="Phone"
                        type="phone"
                        value={phone}
                        onChange={onChangePhone}
                    />
                    <CustomInput
                        value={password}
                        label="Password"
                        placeholder="Password"
                        icon={true}
                        onChange={onChangePassword}
                    />
                    <CustomInput
                        error={correct ? true : false}
                        value={confirmPassword}
                        label={correct ? "Password is not correct" : "Confirm Password"}
                        placeholder="Confirm Password"
                        type="password"
                        icon={true}
                        onChange={onChangeConfirmPassword}
                    />
                    <CustomButton color={"error"} text="REGISTER" onClick={handleLogin}/>
                    <Link
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                            width: "100%",
                        }}
                        to={"/login"}
                    >
                        <Button color="inherit" fullWidth>
                            LOGIN
                        </Button>
                    </Link>
                </CustomBox>
            </form>
        </div>
    );
}
