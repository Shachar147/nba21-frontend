import React from "react";
import axios from "axios";
import {getServerAddress} from "../config/config";
import {setToken} from "../helpers/auth";
import { Redirect } from 'react-router'
import Logo from "../components/shared/Logo";
import {Link} from "react-router-dom";
import {LOGIN_DELAY} from "../helpers/consts";
import TextInput from "../components/shared/TextInput";

export default class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            error: "",
            message: "",
            token: undefined,
            errorField: {
                username: false,
                password: false,
            },
            validating: false,
        };

        this.login = this.login.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(e){
        if(e.keyCode === 13) this.login();
    }

    login(){

        if (this.state.validating) return;

        let message = "";
        let error = "";
        let self = this;
        let token = undefined;

        let errorField = {
            username: undefined,
            password: undefined,
        }

        if (this.state.username.length === 0) {
            error = "Username can't be empty";
            errorField.username = true;
            self.setState({error, errorField});
        }
        else if (this.state.password.length === 0) {
            error = "Password can't be empty";
            errorField.password = true;
            self.setState({error, errorField});
        }
        else {

            this.setState({ validating: true });

            axios.post(getServerAddress() + `/auth/signin`, {
                username: this.state.username,
                password: this.state.password,
            })
            .then(res => {
                // console.log(res);
                if (res && res.data && res.data.accessToken){
                    token = res.data.accessToken;
                    setToken(token);

                    axios.defaults.headers.Authorization = `Bearer ${token}`;

                    message = "Logged in successfully!";
                    setTimeout(function(self){
                        self.setState({ redirect: true })
                    }, LOGIN_DELAY, self);
                }
                else {
                    error = "Oops, something went wrong";
                }

            }).catch(function (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    error = "Username or Password are incorrect.";
                } else {
                    error = "Network Error";
                }
            })
            .then(function () {
                self.setState({error, message, token, errorField, validating: false });
            });
        }
    }

    render() {

        if (this.state.redirect){
            return <Redirect to="/" />;
        }

        let error = (this.state.error !== '') ? (
            <div className="field" style={{ marginBottom: "10px", color: "#F10B45" }}>
                {this.state.error}
            </div>
        ) : "";

        let message = (this.state.message !== '') ? (
            <div className="field" style={{ marginBottom: "10px", color: "#0068BB" }}>
                {this.state.message}
            </div>
        ) : "";

        if (error) { message = ""; }

        let bottom = (message !== '' || error !== '') ? "-24px" : "0px";

        const inputs = [
            {
                name: 'username',
                type: 'text',
                placeholder: 'Username',
            },
            {
                name: 'password',
                type: 'password',
                placeholder: 'Password',
            },
        ];

        let buttonStyle = (this.state.validating) ? { opacity: 0.6 , cursor: "default" } : {};

        return (
            <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "#FAFAFB" }} >
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <Logo />
                    <div className="sub cards header content" style={{ width:"100%", bottom: bottom, textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>
                        <div className="ui segment">
                            {message}
                            {error}
                            {
                                inputs.map((input,idx) => {
                                    const { name, type, placeholder } = input;
                                    return (
                                        <TextInput
                                            key={idx}
                                            name={name}
                                            type={type}
                                            disabled={this.state.validating}
                                            placeholder={placeholder}
                                            error={this.state.errorField[name]}
                                            value={this.state[name]}
                                            onChange={(e) => {
                                                let errorField = this.state.errorField;
                                                errorField[name] = false;
                                                this.setState({ [name]: e.target.value, errorField: errorField });
                                            }}
                                            onKeyDown={this.onKeyDown}
                                        />
                                    );
                                })
                            }
                            <div className="ui fluid large blue submit button" onClick={this.login} style={buttonStyle}>Login</div>
                        </div>
                        <div style={{ fontWeight: "normal", fontSize: "16px" }}>
                            Not a member? <Link to={"/register"}>register!</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}