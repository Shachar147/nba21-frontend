import React from "react";
import {Link} from "react-router-dom";
import Logo from "./Logo";
import PropTypes from "prop-types";
import {getUser} from "@helpers/auth";

const Header = ({ nologo }) => {

    const logo = (!nologo) ? (
                    <div className={"ui header cards centered"} style={{
                        width: "100%",
                        // backgroundColor: "#FAFAFB",
                        marginLeft: "0px",
                        paddingTop: "45px"
                    }} >
                        <Logo />
                    </div>): "";

    const user = getUser();

    return (
        <div>
            <div style={{ padding: "0px 20px", zIndex: 9999, textalign: "left", marginTop: "0px", height:"36px", lineHeight: "36px", width: "100%", position: "fixed", top:"0px", backgroundColor: "white", borderBottom: "1px solid #eaeaea"}}>
                <Link to={"/"}>Home</Link>
                <span style={{ margin: "0px 10px" }}>/</span>
                <Link to={"/logout"}>Logout</Link>
                <span style={{ margin: "0px 10px" }}>/</span>
                <Link to={"/user/settings"}>Settings</Link>
                <span style={{ margin: "0px 10px" }}>/</span>
                <Link to={"/sync"} style={{ opacity: 0.4, color: "black" }}>Sync</Link>
                <span style={{ float: "right" , opacity: "0.6"}}>
                    {(user) ? `Connected as: ${user}` : ""}
                </span>
            </div>
            {logo}
        </div>
    );
}

Header.propTypes = {
    /**
     * Option to render the header without logo.
     */
    nologo: PropTypes.bool,
};

Header.defaultProps = {
    nologo: false
};

export default Header;