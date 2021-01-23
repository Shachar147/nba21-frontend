import React from "react";
import {Link} from "react-router-dom";
import Header from "../components/Header";
import Logo from "../components/Logo";

export default class MainPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        return (
            <div>
                <Header />
            <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "#FAFAFB" }} >
                <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <Logo />
                    <div className="sub cards header content" style={{ width:"100%", bottom: "0px", textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>
                        Main Page
                        <br/><br/>
                        <Link to={"/three-points"}>Three Points Contenst</Link>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}