import React from "react";
import {Link} from "react-router-dom";
import Logo from "./Logo";

export default function Header(props) {

    const logo = (!props.nologo) ? (
                    <div className={"ui header cards centered"} style={{ width: "100%", backgroundColor: "#FAFAFB" }} >
                        <Logo />
                    </div>): "";

    return (
        <div>
            <div style={{ padding: "0px 20px", zIndex: 9999, textalign: "left", marginTop: "0px", height:"36px", lineHeight: "36px", width: "100%", position: "fixed", top:"0px", backgroundColor: "white", borderBottom: "1px solid #eaeaea"}}>
                <Link to={"/"}>Home</Link>
                <span style={{ margin: "0px 10px" }}>/</span>
                <Link to={"/logout"}>Logout</Link>
            </div>
            <br/><br/>
            {logo}
        </div>
    );
}