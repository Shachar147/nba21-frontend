import React from "react";

export default class SearchInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="ui link cards" style={{ margin: "auto", marginBottom: "5px" }}>
                <div className="ui icon input" style={{ margin: "auto", width: "40%" }}>
                    <input type="text" placeholder="Search..." onKeyUp={this.props.onKeyUp} />
                    <i className="search icon" />
                </div>
            </div>
        );
    }
}