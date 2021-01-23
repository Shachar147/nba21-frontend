import React from "react";
import axios from "axios";
import {getServerAddress} from "../config/config";
import Cookies from 'js-cookie';

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
            }
        };

        this.login = this.login.bind(this);
    }

    setToken (token) {
        Cookies.set('token', token);
    };

    login(){

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

            axios.post(getServerAddress() + `/auth/signin`, {
                username: this.state.username,
                password: this.state.password,
            })
            .then(res => {
                // console.log(res);
                token = res.data.accessToken;
                this.setToken(token);
                message = "Logged in successfully!"
            }).catch(function (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    error = "Username or Password are incorrect.";
                    // errorField.username = true;
                    // errorField.password = true;
                } else {
                    error = "Network Error";
                }
            })
            .then(function () {
                console.log(error);
                // console.log("finished");
                self.setState({error, message, token, errorField });
            });
        }
        console.log(error);
    }

    render() {

        let error = (this.state.error !== '') ? (
            <div className="field" style={{ marginBottom: "10px", color: "#F10B45" }}>
                {this.state.error}
            </div>
        ) : "";

        console.log(error);

        let message = (this.state.message !== '') ? (
            <div className="field" style={{ marginBottom: "10px", color: "#0068BB" }}>
                {this.state.message}
            </div>
        ) : "";

        if (error) { message = ""; }

        let bottom = (message !== '' || error !== '') ? "-24px" : "0px";

        let userStyle = (this.state.errorField.username) ? { width: "100%", "border":"1px solid #F10B45"} : { width: "100%" };
        let passStyle = (this.state.errorField.password) ? { width: "100%", "border":"1px solid #F10B45"} : { width: "100%" };

        return (
            <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "#FAFAFB" }} >
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundImage: `url("/logo-new.png")`, width: "50%", maxWidth: "800px", minWidth: "200px", height: "680px", backgroundPositionX: "center", backgroundRepeat: "no-repeat" }}>
                    <div className="sub cards header content" style={{ width:"100%", bottom: bottom, textAlign: "center", position: "absolute", fontSize: "20px", fontWeight: "bold" }}>
                        <div className="ui segment">
                            {message}
                            {error}
                            <div className="field">
                                <div className="ui left icon input" style={{ width: "100%", marginBottom: "10px" }}>
                                    <i className="user icon" />
                                    <input type="text" name="username" placeholder="Username" style={userStyle} value={this.state.username} onChange={(e) => { let errorField = this.state.errorField; errorField.username = false; this.setState({ username: e.target.value, errorField: errorField }) } } />
                                </div>
                            </div>
                            <div className="field">
                                <div className="ui left icon input" style={{ width: "100%", marginBottom: "10px" }}>
                                    <i className="lock icon" />
                                    <input type="password" name="password" placeholder="Password" style={passStyle} value={this.state.password} onChange={(e) => { let errorField = this.state.errorField; errorField.password = false; this.setState({ password: e.target.value, errorField: errorField }) } } />
                                </div>
                            </div>
                            <div className="ui fluid large blue submit button" onClick={this.login} >Login</div>
                        </div>
                        <div style={{ fontWeight: "normal", fontSize: "16px" }}>
                            Not a member? <a style={{ cursor: "pointer" }}>register!</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}