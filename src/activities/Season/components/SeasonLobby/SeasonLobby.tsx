import React, {useEffect, useMemo, useState} from "react";
import SeasonStore from "../../stores/SeasonStore";
import LoadingPage from "../../../../pages/LoadingPage";
import Header from "../../../../components/layout/Header";
import Logo from "../../../../components/layout/Logo";
import Card from "../../../../components/Card";
import {observer} from "mobx-react";
import ButtonInput from "../../../../components/inputs/ButtonInput";
import SeasonApiService from "../../services/SeasonApiService";
import ConfirmationModal from "../../../../components/modals/ConfirmationModal";
import {NextGameDataResponse} from "../../utils/interfaces";
import './SeasonLobby.scss';

function SeasonLobby(){
    const store: SeasonStore = useMemo(() => new SeasonStore(), []);
    const [deleteSeasonId, setDeleteSeasonId] = useState<number|undefined>(undefined);
    const [seasonsData, setSeasonsData] = useState<Record<number, NextGameDataResponse>>({});

    // @ts-ignore
    useEffect(() => loadSeasonsData(), [store.seasons])

    async function loadSeasonsData(){
        const results = await Promise.all(store.seasons.map((season) => SeasonApiService.getNextGameData(season.id)))
        const _seasonsData: Record<number, NextGameDataResponse> = {};
        results.forEach((result) => {
            _seasonsData[result.seasonId] = result;
        })
        setSeasonsData(_seasonsData);
    }

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

        function daysAgo(dateString: string) {
            // Parse the given date string into a Date object
            const givenDate = new Date(dateString). getTime();

            // Get the current date
            const currentDate = new Date().getTime();

            // Calculate the difference in time (in milliseconds) between the two dates
            const timeDifference = currentDate - givenDate;

            // Convert the time difference from milliseconds to days
            return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
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
                            name={`${season.name}<br/><span style="color: gray;">${season.teamsCount} teams<br/>${season.playedGamesCount} played games<br/>created ${daysAgo(season.addedAt)} days ago<br/><hr/>${ seasonsData?.[season.id]?.isSeasonOver ? "Season Over" : seasonsData?.[season.id]?.mode ?? 'loading state...'}</span>`}
                            picture={"/thumbnails/season.png"}
                            className={seasonsData?.[season.id]?.isSeasonOver ? 'opacity-04' : undefined}
                            style={{ width: "160px" }}
                            href={`/season/${season.id}`}
                            data-testid={`season-${idx}`}
                            key={`${season.id}-${idx}`}
                            onDelete={() => setDeleteSeasonId(season.id)}
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
        <div className="season-lobby">
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
            {!!deleteSeasonId && (
                <ConfirmationModal
                    title={"Delete Season"}
                    description={"Are you sure you want to delete this season?\nOnce you do it, you won't be able to undo."}
                    okText={"Delete"}
                    okColor={"nbared"}
                    okFunc={() => {
                        SeasonApiService.deleteSeason(deleteSeasonId).then(() => window.location.reload());
                    }}
                    cancelText={"Cancel"}
                    cancelFunc={() => {
                        setDeleteSeasonId(undefined);
                    }}
                />
            )}
        </div>
    );
}

export default observer(SeasonLobby);