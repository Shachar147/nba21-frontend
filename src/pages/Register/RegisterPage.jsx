import React, {useState} from "react";
import axios from "axios";
import {getServerAddress} from "@config/config";
import { Redirect } from 'react-router'
import Logo from "@components/layout/Logo";
import {Link} from "react-router-dom";
import {LOGIN_DELAY} from "@helpers/consts";
import TextInput from "@components/inputs/TextInput";
import {apiPost} from "@helpers/api";
import {setToken} from "@helpers/auth";
import {defaultErrorField, errorTestId, messageTestId} from "./Model";
import style from "./style";

const RegisterPage = () => {

    // define states
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [errorField, setErrorField] = useState(defaultErrorField);
    const [validating, setValidating] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const register = () => {

        // if we're already trying to perform login, do not try again.
        if (validating) return;

        // validate inputs
        if (username.length === 0){
            setError("Username can't be empty");
            setErrorField({...errorField, username: true });
        }
        else if (password.length === 0){
            setError("Password can't be empty");
            setErrorField({...errorField, password: true });
        }
        else if (password !== passwordAgain) {
            setError("Passwords do not match");
            setErrorField({...errorField, password: true, passwordAgain: true });
        }
        else {
            setErrorField(defaultErrorField);
            setValidating(true);

            apiPost(this,
                '/auth/signup',
                {
                    username: username,
                    password: password,
                },
                async function (res) {

                    // console.log(res);
                    if (res && res.error) {
                        setError(res.error);
                    } else {
                        setMessage("Registered successfully!");
                        setTimeout(function (self) { setRedirect(true);}, LOGIN_DELAY, self);
                    }

                },
                function (err) {

                    if (err.response && err.response.data && err.response.data.message) {
                        const message = err.response.data.message;
                        setError((typeof (message) === "object") ? message.join("<br>") : message);

                        console.log(err, message);

                        if (err.response.data.statusCode && [404].indexOf(err.response.data.statusCode) !== -1) {
                            setError("Network Error");
                        }
                    } else {
                        setError("Network Error");
                    }

                },
                function () {
                    setValidating(false);
                }
            );
        }
    }

    const onKeyDown = keyCode => {
        if (keyCode === 13){
            register();
        }
    }

    // more settings
    const inputs = [
        {
            name: 'username',
            type: 'text',
            placeholder: 'Username',
            icon: 'user',
            value: username,
            setValue: setUsername
        },
        {
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            icon: 'lock',
            value: password,
            setValue: setPassword,
        },
        {
            name: 'passwordAgain',
            type: 'password',
            placeholder: 'Repeat Password',
            icon: 'lock',
            value: passwordAgain,
            setValue: setPasswordAgain,
        }
    ];

    // building blocks
    const error_block = (error === '') ? "" :
        (<style.Error className={"field"} data-testid={errorTestId}>{error}</style.Error>);
    const message_block = (message === '' || error !== '') ? "" :
        (<style.Message className={"field"} data-testid={messageTestId}>{message}</style.Message>);

    return (redirect) ? (<Redirect to="/login" />) : (
        <style.Container className={"ui header cards centered"} >
            <style.SubContainer>
                <Logo />
                <div className={"sub cards header content"}>
                    <div className={"ui segment"}>
                        {message_block}
                        {error_block}
                        {
                            inputs.map((input,idx) => {
                                const { name, type, placeholder, icon, value, setValue } = input;
                                return (
                                    <TextInput
                                        key={idx}
                                        name={name}
                                        type={type}
                                        icon={icon}
                                        disabled={validating}
                                        placeholder={placeholder}
                                        error={errorField[name]}
                                        value={value}
                                        onChange={(e) => {
                                            setValue(e.target.value);
                                            setErrorField({...errorField, [name]: false});
                                        }}
                                        onKeyDown={e => onKeyDown(e.keyCode)}
                                        data-testid={name}
                                    />
                                );
                            })
                        }
                        <style.Button
                            validating={validating}
                            className="ui fluid large blue submit button"
                            data-testid={"submit"}
                            onClick={register}
                        >
                            Register
                        </style.Button>
                    </div>
                    <style.RegisterLink>
                        Already a member? <Link data-testid={"login"} to={"/login"}>login!</Link>
                    </style.RegisterLink>
                </div>
            </style.SubContainer>
        </style.Container>
    )
};

export default RegisterPage;