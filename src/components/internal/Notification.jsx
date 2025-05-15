import React from "react";
import PropTypes from "prop-types";

export default class Notification extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            opacity: 1,
        };
        this.fadeOut = this.fadeOut.bind(this);
    }

    fadeOut(){
        let { opacity } = this.state;

        if (opacity > 0){
            opacity -= 0.1;
            opacity = Math.max(0,opacity);
            this.setState({ opacity });

            setTimeout(() => { this.fadeOut() }, 500);
        }
    }

    componentDidMount() {

        const { delay } = this.props;

        setTimeout(() => {
            this.fadeOut();
        },delay);
    }

    render() {

        const { title, description } = this.props;
        const { opacity } = this.state;

        if (opacity === 0) {
            return "";
        }

        const notification = (
            <div className="ui-alert-content ui-alert-content-bottom-right" style={{ width: "400px", float:"Right", bottom: "20px", position: "fixed", right: "20px", zIndex: 999 }}>
                <div id="messages" className="ui icon message" style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "8", padding: 8,
                    backgroundColor: this.props.backgroundColor ?? "rgb(85, 169, 238)", boxShadow: "rgba(255, 255, 255, 0.5) 0px 0px 0px 1px inset, transparent 0px 0px 0px 0px", opacity: {opacity} }}>
                    <i className="info circle icon" style={{"color": "white"}} />
                    <div style={{"color": "#fff", marginRight: "10px"}}>
                        <div className="header">{title}</div>
                        <p> { description }</p>
                    </div>
                </div>
            </div>
        );

        return notification;
    }
}

Notification.propTypes = {
    delay: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    key: PropTypes.string,
    backgroundColor: PropTypes.string
};

Notification.defaultProps = {
    delay: 1000*2,
    title: "Notification",
    description: "",
    backgroundColor: "rgb(85, 169, 238)"
};