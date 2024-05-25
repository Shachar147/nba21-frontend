import React from "react";
import {observer} from "mobx-react";
import {ISeasonGame, NextGameDataResponse, SeasonMode, SeasonStats, Team} from "../../utils/interfaces";
import {winsAndMatchupsSort} from "../../../../helpers/sort";
import StatsTableInner from "../../../../components/StatsTableInner";
import {nth} from "../../../../helpers/utils";
import SeasonGameStore from "../../stores/SeasonGameStore";
import {ON_FIRE_COLOR} from "../../../../helpers/consts";

interface SeriesStandingsProps {
    stats: SeasonStats;
    rStats: SeasonStats;
    teamsByName: Record<string, Team>;
    mode: SeasonMode;
    store: SeasonGameStore;
    max?: number;
    teamsData: NextGameDataResponse;
}

function SeriesStandings({ rStats, teamsData, stats, mode, teamsByName, store, max=8 }: SeriesStandingsProps){

    // get regular season top8 teams:
    const rTeamStats = {...store.regularSeasonStats};
    Object.keys(rTeamStats).forEach((teamName) => {
        rTeamStats[teamName]["teamName"] = teamName;
    });
    const rTeamsByStanding = Object.values(rTeamStats).sort(winsAndMatchupsSort);

    // @ts-ignore
    const rOrder: string[] = rTeamsByStanding.map((s) => s.teamName).slice(0, 8);

    const teamStats = {...rStats};
    Object.keys(teamStats).forEach((teamName) => {
        teamStats[teamName]["teamName"] = teamName;
    });
    const teamsByStanding = Object.values(teamStats).sort(winsAndMatchupsSort);
    const standingStats: Record<string, (number|string)[]> = {};

    // @ts-ignore
    const order: string[] = teamsByStanding.map((s) => s.teamName).slice(0, max);
    const series: string[] = [];
    const seriesWithLogos: string[] = [];
    order.forEach((team, idx) => {
        if (idx <= max/2 - 1) {

            const team1 = team;
            const team2 = order[order.length - 1 - idx];

            series.push(`${team1} vs ${team2}`);

            // @ts-ignore
            seriesWithLogos.push(`<div style="position:relative;"><div style="position:absolute; top:12.5px;">vs</div><div class="flex-col gap-4" style="position:relative; left:20px;">${getTeamCell(team, stats[team]?.total_wins ?? 0, stats[team2]?.total_wins ?? 0)}${getTeamCell(team2, stats[team2]?.total_wins ?? 0, stats[team]?.total_wins ?? 0)}</div></div>`)
        }
    })

    series.forEach((seriesName, idx) => {
        const teams = seriesName.split(' vs ');
        const team1 = teams[0];
        const team2 = teams[1];

        let w_l = [];
        if (stats[team1]) {
            w_l.push(`${team1} &nbsp;<b><u>${stats[team1].total_wins}W</u></b>`);
        }
        if (stats[team2]) {
            w_l.push(`${team2} &nbsp;<b><u>${stats[team2].total_wins}W</u></b>`);
        }

        if ((stats[team2]?.total_wins ?? 0) > (stats[team1]?.total_wins ?? 0)) {
            w_l = w_l.reverse();
        }

        let sweepBlock = '';
        let gameSevenBlock = '';
        if (stats[team1]?.total_wins == 4 || stats[team2]?.total_wins == 4) {
            w_l[1] = `<span class='strike-through nba-red-color'>${w_l[1]}</span>`;

            if (w_l[1].includes("0W")){
                sweepBlock = '<span class="color-brown">Sweep! &nbsp;🧹</span>';
            } else if (w_l[1].includes("3W")) {
                gameSevenBlock = '<span class="color-yellow">Game 7! &nbsp;💪</span>';

                const teamData = getTeamData()?.find((t: any) => t.teamName == team1);
                const team2Data = getTeamData()?.find((t: any) => t.teamName == team2);
                if (teamData?.is_3_0_comeback || team2Data?.is_3_0_comeback) {
                    gameSevenBlock += `<span style="color:${ON_FIRE_COLOR}">Comeback from 3-0!! &nbsp;🔥🔥🔥 </span>`;
                } else if (teamData?.is_3_1_comeback || team2Data?.is_3_1_comeback) {
                    gameSevenBlock += `<span style="color:${ON_FIRE_COLOR}">Comeback from 3-1!! &nbsp;🔥 </span>`;
                }
            }
        }

        const _idx = rOrder.findIndex((s) => s == team1);
        const _idx2 = rOrder.findIndex((s) => s == team2);
        standingStats[`${_idx+1}${nth(_idx+1)} vs ${_idx2 + 1}${nth(_idx2 + 1)}`] = [
            seriesWithLogos[idx],
            `<span class="font-weight-normal flex-column">${w_l.length == 0 ? 'Not started yet' : sweepBlock.length + gameSevenBlock.length == 0 ? '-' : `${sweepBlock}${gameSevenBlock}`}</span>`,
            `${team1}<br/><span class="font-weight-normal">${w_l.length == 0 ? "-" : getMvps(stats[team1]?.records ?? [], team1)}</span>`,
            `${team2}<br/><span class="font-weight-normal">${w_l.length == 0 ? "-" : getMvps(stats[team2]?.records ?? [], team2)}</span>`
        ];
    });

    function getTeamData() {
        if (mode == "Finals") {
            return teamsData.finalsStats;
        }
        else if (mode == "SemiFinals") {
            return teamsData.semiFinalsStats;
        }
        else if (mode == "Playoff") {
            return teamsData.playoffStats;
        }
        return teamsData.stats;
    }

    function isTeamWon(x: ISeasonGame, teamName: string) {
        return (x.score1 > x.score2 && x.team1_name == teamName) || (x.score2 > x.score1 && x.team2_name == teamName);
    }

    function getTeamCell(teamName: string, totalWins: number, otherTeamWins: number): string {
        const teamLogo = teamsByName[teamName].logo;

        const teamCell = `<div class="flex-row align-items-center"><img src=${teamLogo} width="24" height="24" class="border-50-percents"/> ${teamName} (${totalWins}W)</div>`;
        if (otherTeamWins == 4){
            return `<span class='strike-through nba-red-color'>${teamCell}</span>`;
        }

        return teamCell;
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

    function getMvpContenders(){
        if (mode !== "Finals"){
            return null;
        }
        let mvpBlock = null;
        if (teamsData.finalsMvpName) {
            mvpBlock = getPlayerCell(teamsData.finalsMvpName);
        }
        const mvps: Record<string, number> = {};
        const playerToTeam: Record<string, string> = {};
        teamsByStanding.slice(0,2).forEach((stat, idx) => {
            const teamName = stat.teamName;
            if (teamName) {
                stat.records.forEach((game) => {
                    if (isTeamWon(game, teamName) && game.mvp_player_name) {
                        // mvps[game.mvp_player_name] = mvps[game.mvp_player_name] || 0;
                        // mvps[game.mvp_player_name] += 1;

                        mvps[game.mvp_player_name] = mvps[game.mvp_player_name] || 0;
                        // mvps[game.mvp_player_name] += 1;
                        mvps[game.mvp_player_name] +=
                            Math.max(game.score1, game.score2) -
                            Math.min(game.score1, game.score2);
                        if (game.is_comeback) {
                            mvps[game.mvp_player_name] += 3;
                            mvps[game.mvp_player_name] += game.total_overtimes;
                        }
                        // knockout
                        if (game.score1 == 0 || game.score2 == 0) {
                            mvps[game.mvp_player_name] += 3;
                        }

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
                <div className="flex-row width-100-percents justify-content-center"><b>MVP Contenders:</b> &nbsp;{sorted_mvps.map((x) => x === "None" ? x :`${x} (${mvps[x]} pts)`).slice(0, 3).join(", ")}</div>
            </div>
        )
    }

    return (
        <div>
            <div className="ui header margin-top-10">{mode} Standings</div>
            {getMvpContenders()}
            <StatsTableInner
                cols={['#', 'Series', 'Notes', 'MVPs 1', 'MVPs 2']}
                stats={standingStats}
                showMoreOpened={true}
                switchMaxNumber={10}
            />
        </div>
    );
}

export default observer(SeriesStandings);