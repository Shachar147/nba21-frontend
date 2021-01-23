import React from "react";
import {Link} from "react-router-dom";

export default class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div style={{ margin: "20px", textalign: "left", marginTop: "0px" }}>
                <Link to={"/logout"}>Logout</Link>
            </div>
        );
    }
}