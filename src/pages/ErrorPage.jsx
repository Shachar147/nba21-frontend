import React from "react";
import Header from "../components/Header";

export default class ErrorPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {

        const title = this.props.title || "Error";
        const message = this.props.message || "Oops something went wrong";

        return (
            <div>
                <Header nologo={true} />
                <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "white" }} >
                    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundImage: `url("/error.gif")`, width: "400px", height: "330px", backgroundRepeat: "no-repeat", backgroundPositionX: "center" }}>
                        <div className="sub header content" style={{width:"100%", bottom: "0", textAlign: "center", position: "absolute", fontSize: "20px", fontWeight: "bold" }}>
                            <div className="header">
                                {title}
                            </div>
                            <p style={{ fontWeight: "normal" }} dangerouslySetInnerHTML={{ __html: message }} />

                            {/*<button className={"ui button basic blue"} onClick={() => { window.history.back();}}>*/}
                            {/*    Go Back*/}
                            {/*</button>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}