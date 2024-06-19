import React from "react";
import {observer} from "mobx-react";
import {ISeasonGame, NextGameDataResponse, SeasonMode, SeasonStats, Team} from "../../utils/interfaces";
import {winsAndMatchupsSort} from "../../../../helpers/sort";
import StatsTableInner from "../../../../components/StatsTableInner";
import {nth} from "../../../../helpers/utils";
import SeasonGameStore from "../../stores/SeasonGameStore";
import './RegularSeasonStandings.scss';

interface RegularSeasonStandingsProps {
    stats: SeasonStats;
    teamsByName: Record<string, Team>;
    mode: SeasonMode;
    store: SeasonGameStore;
    teamsData: NextGameDataResponse;
}

function RegularSeasonStandings({ stats, teamsData, mode, teamsByName, store }: RegularSeasonStandingsProps){

    const seasonMode = store.teamsData?.mode;

    const teamStats = {...stats};
    Object.keys(teamStats).forEach((teamName) => {
        teamStats[teamName]["teamName"] = teamName;
    });
    const teamsByStanding = Object.values(teamStats).sort(winsAndMatchupsSort);
    const standingStats: Record<string, (number|string)[]> = {};
    let firstTeamWins: number = 0;
    teamsByStanding.forEach((stat, idx) => {
        const teamName = stat.teamName;
        if (teamName) {
            standingStats[`${idx+1}${nth(idx+1)}`] = [
                getTeamCell(teamName, idx),
                stat.total_games,
                stat.total_wins,
                stat.total_lost,
                idx == 0 ? "-" : (firstTeamWins - stat.total_wins),
                getLastTenGameStats(stat.records, teamName),
                getMvps(stat.records, teamName)
            ];

            if (idx == 0) {
                firstTeamWins = stat.total_wins;
            }
        }
    });

    function isTeamWonMvp(teamName: string, mvpType: 'regularSeason' | 'finals' | 'postSeason'){
        const rMvp = mvpType === 'regularSeason' ? teamsData.regularSeasonMvpName : mvpType === 'postSeason' ? teamsData.postSeasonMvpName : teamsData.finalsMvpName;
        if (!rMvp) {
            return false;
        }
        return !!teamsByName[teamName].players.find((player) => player.name == rMvp);
    }

    function getTeamCell(teamName: string, idx: number): string {
        const teamLogo = teamsByName[teamName].logo;

        let textDecorationStyle = "";
        if (seasonMode && seasonMode != 'Regular Season' && mode == 'Regular Season' && idx >= 8) {
            textDecorationStyle += ' strike-through nba-red-color'
        }

        const awards = [];
        if (isTeamWonMvp(teamName, 'regularSeason')) {
            awards.push(`<img src="/trophies/mvp.png" width="16" height="16" />`);
        }
        if (isTeamWonMvp(teamName, 'postSeason')) {
            awards.push(`<img src="/trophies/post-season.png" width="16" height="16" />`);
        }
        if (isTeamWonMvp(teamName, 'finals')) {
            awards.push(`<img src="/trophies/fmvp.png" width="16" height="16" />`);
        }
        if (teamsData.winner && teamsData.isSeasonOver && teamsData.winner === teamName) {
            awards.push(`<img src="/trophies/championship.png" width="16" height="16" />`);
        }
        const awardsBlock = awards.length > 0 ? `<span class='flex-row gap-4 margin-inline-start-4'>${awards.join("")}</span>` : "";

        let secured = "";
        let isSecured = "";
        if (teamsData.insights?.find((i) => i.includes("Secured"))?.includes(teamName)) {
            secured += '<div title="secured a playoff spot!">🔒</div>';
            isSecured += ' secured-playoff';
        }
        else if (teamsData.insights?.find((i) => i.includes("out of playoff"))?.includes(teamName)) {
            isSecured = " out-of-playoff";
        }

        return `<div class="flex-row align-items-center gap-4${textDecorationStyle}${isSecured}"><img src=${teamLogo} width="24" height="24" class="border-50-percents"/> ${teamName} ${secured} ${awardsBlock}</div>`;
    }

    function isTeamWon(x: ISeasonGame, teamName: string) {
        return (x.score1 > x.score2 && x.team1_name == teamName) || (x.score2 > x.score1 && x.team2_name == teamName);
    }

    function getLastTenGameStats(records: ISeasonGame[], teamName: string): string{
        const last10Games = [...records].sort((a,b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()).slice(0, 10);
        const wins = last10Games.filter((x) => isTeamWon(x, teamName)).length;
        const lost = last10Games.length - wins;

        return `${wins}W - ${lost}L`;
    }

    function getMvps(records: ISeasonGame[], teamName: string): string{
        const mvps: Record<string, number> = {};
        records.forEach((game) => {
            if (isTeamWon(game, teamName) && game.mvp_player_name) {
                mvps[game.mvp_player_name] = mvps[game.mvp_player_name] || 0;
                mvps[game.mvp_player_name] += 1;
            }
        });
        const bestMvps = Object.keys(mvps).sort((a, b) => mvps[b] - mvps[a]);
        const mvp = bestMvps?.[0];
        const secondMvp = bestMvps?.[1];
        if (!mvp) {
            return "-";
        }
        if (bestMvps.length == 1) {
            return `${mvp} - ${mvps[mvp]}`;
        } else {
            return `${mvp} - ${mvps[mvp]},<br/>${secondMvp} - ${mvps[secondMvp]}`;
        }
    }

    function getPlayerCell(playerName: string): React.ReactNode {
        const allPlayers = Object.values(teamsByName).map((teamData) => teamData.players).flat();
        const playerLogo = allPlayers.find((player) => player.name == playerName)?.picture;

        return (
            <div className="flex-row align-items-center justify-content-center width-100-percents gap-4">
                <b>Regular Season MVP:</b>
                <img src={playerLogo} width="36" height="24" className="border-50-percents"/>
                <u><b><span>{playerName}</span></b></u>
            </div>
        );
    }

    function getMvpContenders() {
        let mvpBlock = null;
        if (teamsData.regularSeasonMvpName) {
            mvpBlock = getPlayerCell(teamsData.regularSeasonMvpName);
        }
        const mvps = store.regularSeasonMvpContenders?.mvps ?? {};
        const sorted_mvps = store.regularSeasonMvpContenders?.sorted_mvps ?? [];
        const details = store.regularSeasonMvpContenders?.details ?? {};

        const other_two = Object.keys(mvps).filter((k) => !sorted_mvps.includes(k)).sort((b, a) => mvps[a] - mvps[b]);

        const currMode = store.teamsData?.mode;
        const isSeasonOver = store.teamsData?.isSeasonOver;

        return (
            <div className="flex-column">
                {mvpBlock}
                <div className="flex-row width-100-percents justify-content-center"><b>Regular Season MVP Contenders:</b> &nbsp;{sorted_mvps.map((x) => x === "None" ? x : `${x} (${mvps[x]} pts)`).slice(0, 3).join(", ")}
                </div>
                <div className="flex-row width-100-percents justify-content-center opacity-06">
                    {
                        sorted_mvps.map((playerName) => `${playerName} (${details[playerName]['mvps']}w / ${details[playerName]['diff']}+- / ${details[playerName]['comebacks']}cb / ${details[playerName]['overtimes']}ot / ${details[playerName]['knockouts']}ko)`).slice(0, 3).join(", ")}
                </div>
                {(currMode != "Finals" && !isSeasonOver) && !!other_two.length && <div className="flex-row width-100-percents justify-content-center opacity-06">
                    <b>On the race:</b> &nbsp;{
                    other_two.map((x) => `${x} (${mvps[x]} pts)`).slice(0, 3).join(", ")}
                </div>}
            </div>
        )
    }

    function getMvpContendersOld(){
        let mvpBlock = null;
        if (teamsData.regularSeasonMvpName) {
            mvpBlock = getPlayerCell(teamsData.regularSeasonMvpName);
        }
        const mvps: Record<string, number> = {};
        const playerToTeam: Record<string, string> = {};
        teamsByStanding.slice(0,8).forEach((stat, idx) => {
            const teamName = stat.teamName;
            if (teamName) {
                stat.records.forEach((game) => {
                    if (isTeamWon(game, teamName) && game.mvp_player_name) {
                        mvps[game.mvp_player_name] = mvps[game.mvp_player_name] || 0;
                        mvps[game.mvp_player_name] += 1;
                        playerToTeam[game.mvp_player_name] = teamName;
                    }
                });
            }
        });

        const teams_order = teamsByStanding.map((x) => x.teamName);
        const sorted_mvps = Object.keys(mvps).sort((a, b) => {
            if (mvps[a] > mvps[b]){
                return -1;
            } else if (mvps[a] < mvps[b]) {
                return 1;
            }

            const team1Standing = teams_order.indexOf(playerToTeam[a]);
            const team2Standing = teams_order.indexOf(playerToTeam[b]);

            if (team1Standing < team2Standing) {
                return -1;
            } else if (team1Standing > team2Standing) {
                return 1;
            }

            return 0;
        });

        if (sorted_mvps.length == 0){
            sorted_mvps.push("None");
        }

        return (
            <div className="flex-column">
                {mvpBlock}
                <div className="flex-row width-100-percents justify-content-center"><b>MVP Contenders:</b> &nbsp;{sorted_mvps.map((x) => x === "None" ? x :`${x} (${mvps[x]})`).slice(0, 3).join(", ")}</div>
            </div>
        )
    }

    function renderInsights() {
        const securedInsight = teamsData.insights?.find((i) => i.includes("Secured"));
        let insights = [];
        if (securedInsight) {
            const parts = securedInsight.split(":");
            insights.push(
                <div><b>{parts[0]}</b>: {parts[1]}</div>
            );
        }
        if (store.team1Name && store.team2Name) {
            const team1: string = store.team1Name;
            const team2: string = store.team2Name;
            insights.push(...(teamsData.insights?.filter((i) => i !== securedInsight && (i.includes(team1) || i.includes(team2))) ?? []).map((s) => <span className="nba-red-color">{s}</span>));
        }

        return (
            <div className="flex-column">{insights.map((s) => <span>{s}</span>)}</div>
        )
    }

    return (
        <div>
            <div className="ui header margin-top-10">{mode} Standings</div>
            {getMvpContenders()}
            {renderInsights()}
            <StatsTableInner
                cols={['Standing', 'Team', 'G', 'W', 'L', 'GB', 'Last 10 Games', 'MVPs']}
                stats={standingStats}
                showMoreOpened={true}
                switchMaxNumber={10}
            />
        </div>
    );
}

export default observer(RegularSeasonStandings);