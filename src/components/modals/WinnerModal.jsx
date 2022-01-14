import React from "react";
import PropTypes from "prop-types";
import '../../fireworks.pyro.css';
import {TROPHY_DETAILS} from "@helpers/consts";

export default class WinnerModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }


    componentDidMount() {}

    render() {

        const { title, description, okFunc } = this.props;
        let { okText, okColor } = this.props;

        okText = okText || "Close";
        okColor = okColor || "blue";

        const trophy = TROPHY_DETAILS();
        // console.log(trophy);

        const winnerModal = (
            <div className="ui dimmer modals page transition visible active"  style={{display: "flex", zIndex:99999999999}}>
                <div className="ui modal transition visible active" style={{
                    position: "absolute",
                    width: "900px",
                    height: "750px",
                    zIndex: "15",
                    top: "CALC(50% - 350px)",
                    left: "50%",
                    margin: "-95px 0 0 -450px",
                }}>
                    <div className="header">{title}</div>
                    <div className="content" style={{
                        height: 650,
                        backgroundColor: trophy.backgroundColor,
                    }}>
                        <p dangerouslySetInnerHTML={{ __html: description }} />
                        <img
                            style={{
                                zIndex: 1000,
                                position: "absolute",
                                bottom: '46px',
                                right: 0,
                                width: 300,
                            }}
                            src={trophy.backgroundImage}
                        />
                    </div>
                    <div className="actions" style={{ zIndex: 1001 }}>
                        <div className={`ui ${okColor} button`} style={{ color: "white" }} onClick={() => {
                            if (okFunc) okFunc();
                        }}>{okText}</div>
                    </div>
                </div>
            </div>
        );

        return winnerModal;
    }
}

WinnerModal.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    okFunc: PropTypes.func,
    okText: PropTypes.string,
    okColor: PropTypes.string,
};

WinnerModal.defaultProps = {
    title: "Comfirmation",
    description: "",
};