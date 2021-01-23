import React from "react";
import axios from "axios";
import {getServerAddress} from "../config/config";
import {getToken, setToken} from "../helpers/auth";
import { Redirect } from 'react-router'
import Logo from "../components/Logo";
import {Link} from "react-router-dom";

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
                    console.log(res);
                    if (res && res.error) {
                        error = res.error
                    }
                    else{
                        message = "Registered successfully!";
                        setTimeout(function(self){
                            self.setState({ redirect: true })
                        }, 2000, self);
                    }

                }).catch(function (err) {
                    if (err.response && err.response.data && err.response.data.message) {
                        const message = err.response.data.message;
                        error = (typeof (message) === "object") ? message.join("<br>") : message;

                        if (err.response.data.statusCode && [404].indexOf(err.response.data.statusCode) !== -1){
                            error = "Network Error";
                        }

                        // errorField.username = true;
                        // errorField.password = true;
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

        let userStyle = (this.state.errorField.username) ? { width: "100%", "border":"1px solid #F10B45"} : { width: "100%" };
        let passStyle = (this.state.errorField.password) ? { width: "100%", "border":"1px solid #F10B45"} : { width: "100%" };
        let passAgainStyle = (this.state.errorField.passwordAgain) ? { width: "100%", "border":"1px solid #F10B45"} : { width: "100%" };
        let buttonStyle = (this.state.validating) ? { opacity: 0.6 , cursor: "default" } : {};

        return (
            <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "#FAFAFB" }} >
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <Logo />
                    <div className="sub cards header content" style={{ width:"100%", bottom: bottom, textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>
                        <div className="ui segment">
                            {message}
                            {error}
                            <div className="field">
                                <div className="ui left icon input" style={{ width: "100%", marginBottom: "10px" }}>
                                    <i className="user icon" />
                                    <input disabled={this.state.validating} type="text" name="username" placeholder="Username" style={userStyle} value={this.state.username} onChange={(e) => { let errorField = this.state.errorField; errorField.username = false; this.setState({ username: e.target.value, errorField: errorField }) } } onKeyDown={this.onKeyDown} />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui left icon input" style={{ width: "100%", marginBottom: "10px" }}>
                                    <i className="lock icon" />
                                    <input disabled={this.state.validating} type="password" name="password" placeholder="Password" style={passStyle} value={this.state.password} onChange={(e) => { let errorField = this.state.errorField; errorField.password = false; this.setState({ password: e.target.value, errorField: errorField }) } } onKeyDown={this.onKeyDown} />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui left icon input" style={{ width: "100%", marginBottom: "10px" }}>
                                    <i className="lock icon" />
                                    <input disabled={this.state.validating} type="password" name="password" placeholder="Repeat Passowrd" style={passAgainStyle} value={this.state.passwordAgain} onChange={(e) => { let errorField = this.state.errorField; errorField.passwordAgain = false; this.setState({ passwordAgain: e.target.value, errorField: errorField }) } } onKeyDown={this.onKeyDown} />
                                </div>
                            </div>
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