import React from "react";
import Header from "./layout/Header";
import Logo from "./layout/Logo";
import {observer} from "mobx-react";

function NbaPage({ renderContent }: { renderContent: () => React.ReactNode }){
    // const style = { width: "100%", height: "100vh", backgroundColor: "#FAFAFB" };
    // const subStyle = { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    const style = {};
    const subStyle = { marginTop:70 };
    return (
        <div>
            <Header nologo={true} />
            <div className={"ui header cards centered"} style={style} >
                <div style={subStyle}>
                    <Logo />
                    <div className="flex-col gap-8 align-items-center">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default observer(NbaPage);