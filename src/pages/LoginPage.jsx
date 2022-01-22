import React, {useState} from "react";
import axios from "axios";
import {setToken} from "@helpers/auth";
import { Redirect } from 'react-router'
import Logo from "@components/layouts/Logo";
import {Link} from "react-router-dom";
import {LOGIN_DELAY, UNAUTHORIZED_ERROR} from "@helpers/consts";
import TextInput from "@components/inputs/TextInput";
import {apiPost} from "@helpers/api";

const LoginPage = () => {

    // define defaults
    const defaultErrorField = {
        username: false,
        password: false
    };
    const errorTestId = "error";
    const messageTestId = "message";

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
            setErrorField(prevState => ({...prevState, username: true }));
        }
        else if (password.length === 0){
            setError("Password can't be empty");
            setErrorField(prevState => ({...prevState, password: true }));
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

    // styles & more settings
    const bottom = (message !== '' || error !== '') ? "-24px" : "0px";
    const containerStyle = { width: "100%", height: "100vh", backgroundColor: "#FAFAFB" };
    const subContainerStyle = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    const formContainerStyle = { width:"100%", bottom: bottom, textAlign: "center", fontSize: "20px", fontWeight: "bold" };
    const errorStyle = { marginBottom: "10px", color: "#F10B45" };
    const messageStyle = { marginBottom: "10px", color: "#0068BB" };
    const buttonStyle = (validating) ? { opacity: 0.6 , cursor: "default" } : {};
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
        (<div className={"field"} data-testid={errorTestId} style={errorStyle}>{error}</div>);
    const message_block = (message === '' || error !== '') ? "" :
        (<div className={"field"} data-testid={messageTestId} style={messageStyle}>{message}</div>);

    return (redirect) ? (<Redirect to="/" />) : (
        <div className={"ui header cards centered"} style={containerStyle} >
            <div style={subContainerStyle}>
                <Logo />
                <div className={"sub cards header content"} style={formContainerStyle}>
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
                                            setErrorField(prevState => ({...prevState, [name]: false}));
                                        }}
                                        onKeyDown={e => onKeyDown(e.keyCode)}
                                        data-testid={name}
                                    />
                                );
                            })
                        }
                        <div className="ui fluid large blue submit button" data-testid={"submit"} onClick={login} style={buttonStyle}>Login</div>
                    </div>
                    <div style={{ fontWeight: "normal", fontSize: "16px" }}>
                        Not a member? <Link data-testid={"register"} to={"/register"}>register!</Link>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default LoginPage;