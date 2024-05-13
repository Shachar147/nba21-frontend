import React from "react";
import {observer} from "mobx-react";
import {ISeasonGame, SeasonMode, SeasonStats, Team} from "../../utils/interfaces";
import {overallSortTotalWins} from "../../../../helpers/sort";
import StatsTableInner from "../../../../components/StatsTableInner";
import {nth} from "../../../../helpers/utils";
import SeasonGameStore from "../../stores/SeasonGameStore";

interface RegularSeasonStandingsProps {
    stats: SeasonStats;
    teamsByName: Record<string, Team>;
    mode: SeasonMode;
    store: SeasonGameStore;
}

function RegularSeasonStandings({ stats, mode, teamsByName, store }: RegularSeasonStandingsProps){

    const seasonMode = store.teamsData?.mode;

    const teamStats = {...stats};
    Object.keys(teamStats).forEach((teamName) => {
        teamStats[teamName]["teamName"] = teamName;
    });
    const teamsByStanding = Object.values(teamStats).sort(overallSortTotalWins);
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

    function getTeamCell(teamName: string, idx: number): string {
        const teamLogo = teamsByName[teamName].logo;

        let textDecorationStyle = "";
        if (seasonMode && seasonMode != 'Regular Season' && mode == 'Regular Season' && idx >= 8) {
            textDecorationStyle += ' strike-through nba-red-color'
        }

        return `<div class="flex-row align-items-center gap-4${textDecorationStyle}"><img src=${teamLogo} width="24" height="24" class="border-50-percents"/> ${teamName}</div>`;
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

    return (
        <div>
            <div className="ui header margin-top-10">{mode} Standings</div>
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