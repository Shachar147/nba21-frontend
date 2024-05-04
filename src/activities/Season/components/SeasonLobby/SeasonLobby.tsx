import React, {useMemo} from "react";
import SeasonStore from "../../stores/SeasonStore";
import LoadingPage from "../../../../pages/LoadingPage";
import Header from "../../../../components/layout/Header";
import Logo from "../../../../components/layout/Logo";
import Card from "../../../../components/Card";
import {observer} from "mobx-react";
import ButtonInput from "../../../../components/inputs/ButtonInput";

function SeasonLobby(){
    const store: SeasonStore = useMemo(() => new SeasonStore(), []);

    if (store.isLoading) {
        return (
            <LoadingPage />
        );
    }

    function renderSeasons(){
        if (!store.seasons?.length){
            return (
                <div className="sub cards header content" style={{ width:"100%", bottom: "0px" }}>
                    Hi! It seems like you do not have any season yet. Create one now!
                    <br/><br/>
                </div>
            )
        }
        return (
            <div className="sub cards header content" style={{ width:"100%", bottom: "0px" }}>
                Hello! Choose the season you want to play or create a new season
                <br/><br/>
                {renderViewStatsButton()}
                <br/><br/>
                <div className="ui link cards centered" style={{ margin: "auto" }}>
                    {store.seasons.map((season, idx) => (
                        <Card
                            name={`${season.name}<br/><span style="color: gray;">${season.teamsCount} teams<br/>${season.playedGamesCount} played games</span>`}
                            picture={"/thumbnails/season.png"}
                            style={{ width: "160px" }}
                            href={`/season/${season.id}`}
                            data-testid={`season-${idx}`}
                            key={`${season.id}-${idx}`}
                        />
                    ))}
                </div>
            </div>
        )
    }

    function renderCreateNewSeason(){
        return (
            <ButtonInput
                text={"Create New Season"}
                className={"ui blue submit button width-max-content"}
                onClick={() => window.location.href = "/season/create"}
                classList={undefined}
            />
        )
    }

    function renderViewStatsButton(){
        return (
            <ButtonInput
                text={"View Stats"}
                style={{marginLeft: "5px"}}
                onClick={() => {
                    alert("todo complete");
                }}
            />
        )
    }

    return (
        <div>
            <Header nologo={true} />
            <div className={"ui header cards centered"} style={{ width: "100%", height: "100vh", backgroundColor: "#FAFAFB" }} >
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    <Logo />
                    <div className="flex-col gap-8 align-items-center">
                        {renderSeasons()}
                        {renderCreateNewSeason()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default observer(SeasonLobby);