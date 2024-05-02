import React from "react";
import Header from "./layout/Header";
import Logo from "./layout/Logo";
import {observer} from "mobx-react";

function NbaPage({ renderContent }: { renderContent: () => React.ReactNode }){
    return (
        <div>
            <Header nologo={true} />
            <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "#FAFAFB" }} >
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
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