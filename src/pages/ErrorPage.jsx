import React from "react";
import Header from "../components/layouts/Header";
import {Redirect} from "react-router-dom";
import {UNAUTHORIZED_ERROR} from "../helpers/consts";
import PropTypes from "prop-types";

export default class ErrorPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        const { title, message } = this.props;
        // const title = this.props.title || "Error";
        // const message = this.props.message || "Oops something went wrong";

        if (message === UNAUTHORIZED_ERROR){
            return (
                <Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />
            );
        }

        return (
            <div>
                <Header nologo={true} />
                <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "white" }} >
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundImage: `url("/error.gif")`, width: "400px", height: "330px", backgroundRepeat: "no-repeat", backgroundPositionX: "center" }}>
                        <div className="sub header content" style={{width:"100%", bottom: "0", textAlign: "center", position: "absolute", fontSize: "20px", fontWeight: "bold" }}>
                            <div className="header">
                                {title}
                            </div>
                            <p style={{ fontWeight: "normal" }} dangerouslySetInnerHTML={{ __html: message }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ErrorPage.propTypes = {
    /**
     * The title of the Error block.
     */
    title: PropTypes.string,
    /**
     * Descriptive message that will appear under the title.
     */
    message: PropTypes.string,

};

ErrorPage.defaultProps = {
    title: "Error",
    message: "Oops something went wrong",
};