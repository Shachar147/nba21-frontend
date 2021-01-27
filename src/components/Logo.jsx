import React from "react";
import {LOGO_IMAGE} from "../helpers/consts";
import {Link} from "react-router-dom";

export default class Logo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        const maxWidth = this.props.maxWidth || 400;

        return (
            <div>
                <Link to={"/"}>
                    <img src={LOGO_IMAGE} style={{ width: "80%", maxWidth: maxWidth }} />
                </Link>
            </div>
        );
    }
}