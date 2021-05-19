import React from "react";
import PropTypes from "prop-types";

export default class ConfirmationModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }


    componentDidMount() {}

    render() {

        const { title, description, okFunc, cancelFunc } = this.props;
        let { okText, cancelText, okColor } = this.props;

        okText = okText || "Submit";
        cancelText = cancelText || "Cancel";
        okColor = okColor || "blue";

        const confirmation = (
            <div className="ui dimmer modals page transition visible active" style={{display: "flex", zIndex:99999999999}}>
                <div className="ui modal transition visible active" style={{
                    position: "absolute",
                    width: "900px",
                    height: "190px",
                    zIndex: "15",
                    top: "50%",
                    left: "50%",
                    margin: "-95px 0 0 -450px",
                }}>
                    <div className="header">{title}</div>
                    <div className="content">
                        <p dangerouslySetInnerHTML={{ __html: description }} />
                    </div>
                    <div className="actions">
                        <div className={`ui ${okColor} button`} style={{ color: "white" }} onClick={() => {
                            if (okFunc) okFunc();
                        }}>{okText}</div>
                        <div className="ui cancel button" onClick={() => {
                            if (cancelFunc) cancelFunc();
                        }}>{cancelText}</div>
                    </div>
                </div>
            </div>
        );

        return confirmation;
    }
}

ConfirmationModal.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    okFunc: PropTypes.func,
    cancelFunc: PropTypes.func,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    okColor: PropTypes.string,
};

ConfirmationModal.defaultProps = {
    title: "Comfirmation",
    description: "",
};