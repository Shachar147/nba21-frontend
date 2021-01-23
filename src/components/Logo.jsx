import React from "react";

export default class Logo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div>
                <img src={"/logo-new.png"} style={{ width: "80%", maxWidth: "800px" }} />
            </div>
        );
    }
}