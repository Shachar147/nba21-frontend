import React from "react";
import {LOGO_IMAGE} from "../helpers/consts";

export default class Logo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        const maxWidth = this.props.maxWidth || 400;

        return (
            <div>
                <img src={LOGO_IMAGE} style={{ width: "80%", maxWidth: maxWidth }} />
            </div>
        );
    }
}