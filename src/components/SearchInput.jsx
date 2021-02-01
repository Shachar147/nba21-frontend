import React from "react";

export default function SearchInput(props) {
    return (
        <div className="ui link cards" style={{ margin: "auto", marginBottom: "5px" }}>
            <div className="ui icon input" style={{ margin: "auto", width: "40%" }}>
                <input type="text" placeholder="Search..." onKeyUp={props.onKeyUp} />
                <i className="search icon" />
            </div>
        </div>
    );
}