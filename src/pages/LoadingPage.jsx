import React from "react";
import Header from "../components/Header";
import Logo from "../components/Logo";

export default class LoadingPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {

        const title = this.props.title || "Loading";
        const message = this.props.message || "Please wait while loading...";

        return (
            <div>
                <Header />
                <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "#F0F0F0" }} >
                    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                        <div>
                            <img src={"/loading.gif"} style={{ width: "80%", maxWidth: "800px" }} />
                            <div className="sub header content" style={{ width:"100%", textAlign: "center", top: "-100px", fontSize: "20px", fontWeight: "bold", position: "relative"}}>
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