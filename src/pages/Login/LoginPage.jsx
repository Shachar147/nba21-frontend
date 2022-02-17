import React, {useState} from "react";
import axios from "axios";
import {setToken} from "@helpers/auth";
import { Redirect } from 'react-router'
import Logo from "@components/layout/Logo";
import {Link} from "react-router-dom";
import {LOGIN_DELAY, UNAUTHORIZED_ERROR} from "@helpers/consts";
import TextInput from "@components/inputs/TextInput";
import {apiPost} from "@helpers/api";
import {defaultErrorField, errorTestId, messageTestId} from "./Model";
import style from './style';

const LoginPage = () => {

    // define states
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [errorField, setErrorField] = useState(defaultErrorField);
    const [validating, setValidating] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const login = () => {

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
        else {
            setErrorField(defaultErrorField);
            setValidating(true);

            // trying to login and get a token.
            apiPost(this,
                '/auth/signin',
                {
                    username: username,
                    password: password,
                },
                // success block
                async function(res) {
                    if (res && res.data && res.data.accessToken){
                        // keep token
                        const token = res.data.accessToken;
                        setToken(token);
                        axios.defaults.headers.Authorization = `Bearer ${token}`;

                        // set success message and redirect flag.
                        setMessage("Logged in successfully!");
                        setTimeout(function(){
                            setRedirect(true);
                        }, LOGIN_DELAY);
                    }
                    else {
                        setError("Oops, something went wrong");
                    }

                },
                // catch block
                function(err) {
                    let req_error = err?.response?.data?.message;
                    if (req_error) setError("Username or Password are incorrect.");
                    else setError("Network Error");
                },
                // finally
                function() {
                    setValidating(false);
                }
            );
        }
    }

    const onKeyDown = keyCode => {
        if (keyCode === 13){
            login();
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
    ];

    // building blocks
    const error_block = (error === '') ? "" :
        (<style.Error className={"field"} data-testid={errorTestId}>{error}</style.Error>);
    const message_block = (message === '' || error !== '') ? "" :
        (<style.Message className={"field"} data-testid={messageTestId}>{message}</style.Message>);

    return (redirect) ? (<Redirect to="/" />) : (
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
                            onClick={login}
                        >
                            Login
                        </style.Button>
                    </div>
                    <style.RegisterLink>
                        Not a member? <Link data-testid={"register"} to={"/register"}>register!</Link>
                    </style.RegisterLink>
                </div>
            </style.SubContainer>
        </style.Container>
    )
};
export default LoginPage;