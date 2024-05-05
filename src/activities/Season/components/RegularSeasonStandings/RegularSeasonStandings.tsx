import React from "react";
import {observer} from "mobx-react";
import {ISeasonGame, SeasonStats, Team} from "../../utils/interfaces";
import {overallSort} from "../../../../helpers/sort";
import StatsTableInner from "../../../../components/StatsTableInner";
import {nth} from "../../../../helpers/utils";

interface RegularSeasonStandingsProps {
    stats: SeasonStats,
    teamsByName: Record<string, Team>
}

function RegularSeasonStandings({ stats, teamsByName }: RegularSeasonStandingsProps){

    const teamStats = {...stats};
    Object.keys(teamStats).forEach((teamName) => {
        teamStats[teamName]["teamName"] = teamName;
    });
    const teamsByStanding = Object.values(teamStats).sort(overallSort);
    const standingStats: Record<string, (number|string)[]> = {};
    let firstTeamWins: number = 0;
    teamsByStanding.forEach((stat, idx) => {
        const teamName = stat.teamName;
        if (teamName) {
            standingStats[getTeamCell(teamName)] = [
                `${idx+1}${nth(idx+1)}`,
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

    function getTeamCell(teamName: string): string {
        const teamLogo = teamsByName[teamName].logo;
        return `<div class="flex-row align-items-center gap-4"><img src=${teamLogo} width="24" height="24" class="border-50-percents"/> ${teamName}</div>`;
    }

    function isTeamWon(x: ISeasonGame, teamName: string) {
        return (x.score1 > x.score2 && x.team1_name == teamName) || (x.score2 > x.score1 && x.team2_name == teamName);
    }

    function getLastTenGameStats(records: ISeasonGame[], teamName: string): string{
        const last10Games = records.slice(0, 10);
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
            return `${mvp} - ${mvps[mvp]}, ${secondMvp} - ${mvps[secondMvp]}`;
        }
    }

    return (
        <div>
            <div className="ui header margin-top-10">Regular Season Standings</div>
            <StatsTableInner
                cols={['Team', 'Standing', 'W', 'L', 'GB', 'Last 10 Games', 'MVPs']}
                stats={standingStats}
                showMoreOpened={true}
                switchMaxNumber={10}
            />
        </div>
    );
}

export default observer(RegularSeasonStandings);