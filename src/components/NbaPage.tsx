import React from "react";
import Header from "./layout/Header";
import Logo from "./layout/Logo";
import {observer} from "mobx-react";

interface NbaPageProps {
    renderContent: () => React.ReactNode;
    noLogo?: boolean;
}

function NbaPage({ renderContent, noLogo = false }: NbaPageProps){
    // const style = { width: "100%", height: "100vh", backgroundColor: "#FAFAFB" };
    // const subStyle = { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    const style = {};
    const subStyle = { marginTop:70 };
    return (
        <div>
            <Header nologo={true} />
            <div className={"ui header cards centered"} style={style} >
                <div style={subStyle}>
                    {!!noLogo && <Logo />}
                    <div className="flex-col gap-8 align-items-center">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function renderSmallLogo(){
    return (
        <div className="ui header cards centered" style={{ width: "100%", marginLeft: 0, paddingTop: 45, marginBottom: 20}}>
            <div><a href="/"><img src="/logo-new.png" style={{ width: "80%", maxWidth: 400}} /></a></div>
        </div>
    )
}

export default observer(NbaPage);