import React from "react";

export default function ButtonInput(props) {

    let { style, text, onClick, disabled } = props;

    return (
        <button className={"ui button basic blue"} style={style} onClick={onClick} disabled={disabled}>
            {text}
        </button>
    );
}