import React from "react";
import Header from "../components/layouts/Header";
import {LOADER_DETAILS} from "../helpers/consts";

export default class LoadingPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {

        const title = this.props.title || "Loading";
        const message = this.props.message || "Please wait while loading...";

        const loader_details = this.props.loaderDetails || LOADER_DETAILS();

        return (
            <div>
                <Header nologo={true} />
                <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: loader_details.backgroundColor }} >
                    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                        <div>
                            <img src={loader_details.loader} style={{ width: "80%", maxWidth: "800px" }} />
                            <div className="sub header content" style={{ width:"100%", textAlign: "center", top: loader_details.top, fontSize: "20px", fontWeight: "bold", position: "relative"}}>
                                <div className="header">
                                    {title}
                                </div>
                                <p style={{ fontWeight: "normal" }} dangerouslySetInnerHTML={{ __html: message }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}