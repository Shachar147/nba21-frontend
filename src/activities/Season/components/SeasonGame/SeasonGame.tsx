import React, {useEffect, useMemo, useState} from "react";
import {observer} from "mobx-react";
import NbaPage, {renderSmallLogo} from "../../../../components/NbaPage";
import LoadingPage from "../../../../pages/LoadingPage";
import {errorTestId, messageTestId} from "../../../../pages/Login/Model";
import style from "../../../../pages/Login/style";
import {Player, SeasonGameTeam, Team} from "../../utils/interfaces";
import PlayerCard from "../../../../components/PlayerCard";
import {styles} from "../../../Tournament/Tournament";
import {PLAYER_NO_PICTURE} from "../../../../helpers/consts";
import {getClasses, getPlayerShortenPosition, toPascalCase} from "../../../../helpers/utils";
import ButtonInput from "../../../../components/inputs/ButtonInput";
import './SeasonGame.scss';
import TextInput from "../../../../components/inputs/TextInput";
import DropdownInput from "../../../../components/inputs/DropdownInput";
import SeasonGameStore from "../../stores/SeasonGameStore";
import {game_mode, percents, what} from "../../utils/consts";
import {BuildStatsTable} from "../../../shared/OneOnOneHelper";
import StatsTable from "../../../../components/StatsTable";
import OneOnOneStats from "../../../shared/OneOnOneStats";

function SeasonGame({ match }: any){

    const { seasonId } = match.params;
    const store = useMemo(() => new SeasonGameStore(seasonId), [seasonId]);

    useEffect(() => {
     store.setMvpPlayer(undefined)
    }, [store.winnerName])

    function calcOT(){
        // @ts-ignore
        const { auto_calc_ot_game_length } = store.settings;

        // @ts-ignore
        const { team1, team2 } = store.teamsData;

        let val = Math.max(store.scores[team1.teamName], store.scores[team2.teamName]);
        let total_overtimes = 0;
        while (val >= Number(auto_calc_ot_game_length) + 2) {
            val -= 2;
            total_overtimes++;
        }
        // console.log("total overtimes: ",total_overtimes);
        store.setTotalOvertimes(total_overtimes)
    }

    function shouldAllowButtons(){
        if (!store.teamsData) {
            return false;
        }

        const team1: SeasonGameTeam = store.teamsData.team1;
        const team2: SeasonGameTeam = store.teamsData.team2;

        if (!team1 || !team2 || store.teamsData.isSeasonOver){
            return false;
        }

        return true;
    }

    function renderSavedMessageIfNeeded() {
        if (!store.isSaved) {
            return undefined;
        }
        return (
            <div className="margin-top-20">
                <style.Message className={"field"} data-testid={messageTestId}>{"Game Saved!"}</style.Message>
            </div>
        )
    }

    function renderSeasonAlreadyOverIfNeeded(){
        if (!store.teamsData) {
            return null;
        }

        const team1: SeasonGameTeam = store.teamsData.team1;
        const team2: SeasonGameTeam = store.teamsData.team2;

        if (!team1 || !team2 || store.teamsData.isSeasonOver){
            return (
                <div className="margin-top-20">
                    <style.Error className={"field"} data-testid={errorTestId}>It seems like this season is already over!</style.Error>
                </div>
            );
        }
        return undefined;
    }

    function renderSeasonGame(){
        if (!store.teamsData) {
            return null;
        }

        const team1: SeasonGameTeam = store.teamsData.team1;
        const team2: SeasonGameTeam = store.teamsData.team2;

        if (!team1 || !team2){
            return null;
        }

        const blocks =
            [team1, team2].map((seasonGameTeam, idx) => {
                const teamId = seasonGameTeam?.teamId;
                const team: Team | undefined = store.allTeamsById[teamId];

                const _2k_rating = team?.['_2k_rating'] || 'N/A';
                let custom_details: string[] = [];
                const original_custom_title = "<div style='border-top:1px solid #eaeaea; width:100%; margin: 10px 0; padding-top: 10px;'>Players:</div>";
                const curr_custom_details_title = `2K Rating: ${_2k_rating}` + original_custom_title;

                team?.players.forEach((player) => {
                    player["rate"] = (player["_2k_rating"]) ? Number(player["_2k_rating"]) : "N/A";
                })

                const arr = team?.players.slice().sort((a,b) => {

                    let rate1 = (a["rate"] === "N/A") ? 0 : Number(a["rate"]);
                    let rate2 = (b["rate"] === "N/A") ? 0 : Number(b["rate"]);

                    return rate2 - rate1;
                }).map((x: Player) => {
                    return (
                        `<div>
                            <img class="ui avatar image" src=${x.picture} onError="this.src='${PLAYER_NO_PICTURE}';" style="width: 39px;" />
                            <span>${x.name} <span style='opacity:0.6;'>(${getPlayerShortenPosition(x.position)})</span> <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: ${x.rate}</span></span>
                        </div>`
                    )
                }) ?? [];
                custom_details = [custom_details.concat(...arr).join("")];

                const onChange = async(e: any) => {
                    store.scores[team.name] = Number(Math.max(0,e.target.value));
                    store.setScores(store.scores);

                    // @ts-ignore
                    if (Number(store.settings.auto_calc_ot)) {
                        calcOT();
                    }
                }

                return (
                    <PlayerCard
                        Key={idx}
                        className={"in-game"}
                        style={{ cursor: "default", textAlign: "left" }}
                        styles={styles}
                        name={team?.name}
                        picture={team?.logo}
                        team_division={(team?.conference && team?.division) ? team.division + " (" + team.conference + ")" : undefined}
                        custom_details_title={curr_custom_details_title}
                        custom_details={custom_details}
                        // stats={{
                        //     win_streak: stats[team.name]?.win_streak || "0",
                        //     max_win_streak: stats[team.name]?.max_win_streak || "0",
                        //     lose_streak: stats[team.name]?.lose_streak || "0",
                        //     max_lose_streak: stats[team.name]?.max_lose_streak || "0",
                        // }}

                        onChange={onChange}
                        singleShot={store.scores[team?.name]}

                        // todo complete:
                        // lost={(this.state.saved && this.state.loser === team.name)}
                        // winner={(this.state.saved && this.state.winner === team.name)}

                        // todo complete:
                        // all_players={this.state.players}
                        // curr_players={[this.state.player1.name, this.state.player2.name]}

                        // todo complete:
                        // onImageClick={(e) => {
                        //
                        //     const target = e.target;
                        //     const html = $(e.target).wrap("<p>").parent().html();
                        //     // console.log(html);
                        //     // to avoid clicking on 'replace' or 'specific rpelace' from openning stats page.
                        //     if (html.indexOf('View Stats') !== -1 && get_stats_specific_route) {
                        //         this.setState({
                        //             selected_player: team.name,
                        //         })
                        //     }
                        //
                        // }}
                    />
                );
            });

        return (
            <div className="ui link cards centered stats-container font-size-14 margin-top-20 position-relative flex-row gap-8 width-100-percents-important">
                {renderHomeGuestHeaders()}
                <div className="ui link cards centered display-flex gap-4 width-100-percents">
                    {blocks[0]}
                    {renderSaveButton()}
                    {blocks[1]}
                </div>
                {renderPreSaveBlocks()}
            </div>
        )
    }

    function renderSaveButton(){
        return (
            <ButtonInput
                text={"Save"}
                classList={"save-button"}
                onClick={() => store.saveGame()}
                disabled={Object.values(store.scores).reduce((a, b) => a+b, 0) == 0}
            />
        );
    }

    function renderHeaderButtons() {
        function goBack(){
            window.location.href = "/season";
        }

        return (
            <>
                <ButtonInput
                    text={"Back To Seasons Lobby"}
                    style={{marginLeft: "5px"}}
                    onClick={goBack}
                />
                {shouldAllowButtons() && <ButtonInput
                    text={"Different Game"}
                    style={{marginLeft: "5px"}}
                    onClick={() => {
                        window.location.reload();
                    }}
                />}
                <ButtonInput
                    text={"View Stats"}
                    style={{marginLeft: "5px"}}
                    onClick={() => {
                        // use stats not window.location.reload, to allow looking at stats while playing without loosing current game.
                        store.setViewStatsPage(true);
                    }}
                />
            </>
        )
    }

    function renderStats(){
        function renderTotals(){
            if (!store.teamsData?.totals?.totalGames) {
                return null;
            }

            return (
                <span style={{ fontWeight: "normal" }}><b>Total Played Games:</b> {store.teamsData.totals.totalPlayedGames}/{store.teamsData.totals.totalGames} | <b>Remaining Games:</b> {store.teamsData.totals.remainingGames}</span>
            )
        }

        // one on one stats
        let general_stats_block, matchups_description;
        if (store.statsInfo){
            general_stats_block = BuildStatsTable(store.statsInfo.general_stats,0, game_mode, percents);

            const { met_each_other } = store.statsInfo;
            const plural = (met_each_other > 1) ? "s" : "";
            matchups_description = `These ${what} met each other ${met_each_other} time${plural}.`;
            if (met_each_other === 0) {
                matchups_description = `This is the first time these ${what} meet each other.`;
            }
        }

        return (
            <div className="ui link cards centered stats-container font-size-14 margin-top-20 position-relative flex-column gap-8">
                <div className="flex-column">
                    {!!store.teamsData && <span style={{ fontWeight: "normal" }}><b>Mode:</b> {store.teamsData.mode}</span>}
                    {renderTotals()}
                </div>
                <a className="show-hide-stats" onClick={() => store.setShowStats(!store.showStats)}>{store.showStats ? "Hide Stats" : "Show Stats"}</a>
                <div className={getClasses("width-100-percents", store.showStats ? 'display-block' : 'display-none')}>
                    {general_stats_block}
                    <StatsTable
                        title={"Previous Matchups Stats"}
                        marginTop="10px"
                        description={matchups_description}
                        hidden={(store.statsInfo?.met_each_other === 0)}
                        cols={["",store.team1Name, store.team2Name]}
                        stats={store.statsInfo?.matchups_values}
                    />
                    <StatsTable
                        title={`${toPascalCase(what)} Individual Stats`}
                        marginTop="10px"
                        cols={["",store.team1Name, store.team2Name]}
                        stats={store.statsInfo?.player_stats_values}
                    />
                </div>
            </div>
        )
    }

    function renderHomeGuestHeaders(){
        const titleStyle = {
            margin: 0,
            padding: 0,
            backgroundColor: "transparent",
            boxShadow: "none",
            fontWeight: "bold",
            fontSize: "18px",
        }

        return (
            <div className="ui link cards centered flex-row align-items-center margin-top-20 width-100-percents">
                <div className={"card in-game"} style={titleStyle}>Home</div>
                <div style={{ width: 110 }} />
                <div className={"card in-game"} style={titleStyle}>Guest</div>
            </div>
        )
    }

    function renderPreSaveBlocks(){
        // <!-- todo complete: remove disabled condition once we will implement update -->

        // comeback
        const comeback_block = (
            <div className="width-100-percents-important" style={{ paddingBottom: "20px", paddingTop: "20px" }}>
                <div
                    className="ui checkbox"
                >
                    <input type="checkbox" checked={store.isComeback} onChange={() => store.setIsComeback(!store.isComeback)} disabled={store.isSaved || store.isSaving || !shouldAllowButtons()}  />
                    <label>Comeback?</label>
                </div>
            </div>
        );

        // overtime
        const overtime_block = (
            <div className="width-100-percents-important" style={{ width: "100%", display:"flex", paddingBottom: "10px", }}>
                <label style={{ display: "inline-block", fontWeight:"bold", marginRight: "7px", lineHeight: "38px" }}>Number of Overtimes:</label>
                <div style={{ flexGrow: "100", display: "inline-block" }}>
                    <TextInput
                        name={'total_overtimes'}
                        type={'number'}
                        value={store.totalOvertimes.toString()}
                        placeholder={"0"}
                        disabled={store.isSaved || store.isSaving || !shouldAllowButtons()}
                        onChange={(e) => {
                            store.setTotalOvertimes(Math.min(20,Math.max(0,Number(e.target.value)) || 0))
                        }}
                    />
                </div>
            </div>
        );

        // mvp
        const options = store.mvpPlayerOptions;
        const mvp_block_html = (
            <div className="ui link cards centered width-100-percents-important" style={{ position:"relative", display: "flex", textAlign: "center", alignItems: "strech", margin: "auto" }}>
                <DropdownInput
                    options={(options)}
                    name={"select_mvp"}
                    placeholder={"Select MVP..."}
                    nameKey={"name"}
                    sortKey={"rate"}
                    sort={"desc"}
                    valueKey={"name"}
                    idKey={"id"}
                    style={{ width: "710px", paddingBottom: "15px" }}
                    disabled={options.length === 0 || store.isSaved || store.isSaving || !shouldAllowButtons()}
                    onChange={(player) => {
                        store.setMvpPlayer(player.name)
                    }}
                />
            </div>
        );

        return (
            <>
                <div className="ui link cards centered" style={{
                    position:"relative", display: "flex", textAlign: "center",
                    width: "710px", alignItems: "strech", margin: "auto"
                }}>
                    {comeback_block}
                </div>

                {mvp_block_html}

                <div className="ui link cards centered" style={{
                    position:"relative", display: "flex", textAlign: "center", alignItems: "strech", margin: "auto", paddingBottom: "20px",
                    width: "710px",
                }}>
                    {overtime_block}
                </div>
            </>
        )
    }

    function renderContent(){
        if (!store.teamsData) {
            return null;
        }

        const home_team_background = store.allTeamsById[store.teamsData?.team1?.teamId]?.logo;
        return (
            <>
                <div className="content flex-column gap-8">
                    {renderSmallLogo()}
                    {renderHeaderButtons()}
                    {renderSavedMessageIfNeeded()}
                    {renderSeasonAlreadyOverIfNeeded()}
                    <div className="display-flex-important flex-column align-items-center">
                        {renderStats()}
                        {renderSeasonGame()}
                    </div>
                </div>
                <div className="bg-container" style={{ backgroundImage: `url("${home_team_background}")` }} />
            </>
        )
    }

    if (store.isLoading) {
        return (
            <LoadingPage />
        )
    }

    if (store.viewStatsPage) {
        return (
            <OneOnOneStats
                what={what}
                stats_title={undefined}
                game_mode={game_mode}
                get_route={"/team"}
                get_stats_route={`/records/season/${seasonId}/stats`}
                get_stats_specific_route={undefined} // todo complete
                mvp_block={true}
                onBack={() => { store.setViewStatsPage(false) }}
                player_from_url={undefined} // ?
            />
        )
    }

    return (
        <div className="season-game">
            <NbaPage renderContent={renderContent} />
        </div>
    );
}

export default observer(SeasonGame);