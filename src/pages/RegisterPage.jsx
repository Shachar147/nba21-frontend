import React from "react";
import axios from "axios";
import {getServerAddress} from "../config/config";
import { Redirect } from 'react-router'
import Logo from "../components/layouts/Logo";
import {Link} from "react-router-dom";
import {LOGIN_DELAY} from "../helpers/consts";
import TextInput from "../components/inputs/TextInput";

export default class RegisterPage extends React.Component {

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
                passwordAgain: false,
            },
            validating: false,
        };

        this.register = this.register.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(e){
        if(e.keyCode === 13) this.register();
    }

    register(){

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
        else if (this.state.password !== this.state.passwordAgain) {
            error = "Passwords do not match";
            errorField.password = true;
            errorField.passwordAgain = true;
            self.setState({error, errorField});
        }
        else {

            this.setState({ validating: true });

            axios.post(getServerAddress() + `/auth/signup`, {
                username: this.state.username,
                password: this.state.password,
            })
                .then(res => {
                    // console.log(res);
                    if (res && res.error) {
                        error = res.error
                    }
                    else{
                        message = "Registered successfully!";
                        setTimeout(function(self){
                            self.setState({ redirect: true })
                        }, LOGIN_DELAY, self);
                    }

                }).catch(function (err) {
                    if (err.response && err.response.data && err.response.data.message) {
                        const message = err.response.data.message;
                        error = (typeof (message) === "object") ? message.join("<br>") : message;

                        if (err.response.data.statusCode && [404].indexOf(err.response.data.statusCode) !== -1){
                            error = "Network Error";
                        }
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
            return <Redirect to="/login" />;
        }

        let error = (this.state.error !== '') ? (
            <div className="field" style={{ marginBottom: "10px", color: "#F10B45" }} dangerouslySetInnerHTML={{ __html: this.state.error }} />
        ) : "";
        let message = (this.state.message !== '') ? (
            <div className="field" style={{ marginBottom: "10px", color: "#0068BB" }}>
                {this.state.message}
            </div>
        ) : "";
        if (error) { message = ""; }
        let bottom = (message !== '' || error !== '') ? "-24px" : "0px";
        let buttonStyle = (this.state.validating) ? { opacity: 0.6 , cursor: "default" } : {};

        const inputs = [
            {
                name: 'username',
                type: 'text',
                placeholder: 'Username',
                icon: 'user',
            },
            {
                name: 'password',
                type: 'password',
                placeholder: 'Password',
                icon: 'lock',
            },
            {
                name: 'passwordAgain',
                type: 'password',
                placeholder: 'Repeat Password',
                icon: 'lock',
            }
        ];

        return (
            <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "#FAFAFB" }} >
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <Logo />
                    <div className="sub cards header content" style={{ width:"100%", bottom: bottom, textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>
                        <div className="ui segment">
                            {message}
                            {error}
                            {
                                inputs.map((input) => {
                                    const { name, type, placeholder, icon } = input;
                                    return (
                                        <TextInput
                                            name={name}
                                            type={type}
                                            icon={icon}
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
                            <div className="ui fluid large blue submit button" onClick={this.register} style={buttonStyle}>Register</div>
                        </div>
                        <div style={{ fontWeight: "normal", fontSize: "16px" }}>
                            Already a member? <Link to={"/login"}>login!</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}