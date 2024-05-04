import StatsTable from "@components/StatsTable";
import {
    ICE_COLD_COLOR, ICE_COLD_ICON, ICE_COLD_STYLE,
    ICE_COLD_THRESHOLD,
    ON_FIRE_COLOR, ON_FIRE_ICON,
    ON_FIRE_STYLE,
    ON_FIRE_THRESHOLD,
    TOP_STATS_MAX_VIEW_MORE,
    TOP_STATS_NUMBER
} from "@helpers/consts";
import {formatDate, getRandomElement, isDefined} from "@helpers/utils";
import React from "react";

export const statsStyle = {
    margin: "30px auto 20px",
    width: "40%",
    minWidth: "700px",
    backgroundColor: "rgba(255,255,255,0.6)",
    padding: "20px",
    border: "1px solid #eaeaea",
    borderRadius: "20px",
}

export function BuildStatsTable(general_stats, wrap, game_mode, mvp_block, mvp_stats, percents, tournamentStats) {

    let totalTournaments;
    let moreStats;
    let tournament_mvps;

    if (tournamentStats) {
        totalTournaments = tournamentStats.totalTournaments;
        moreStats = tournamentStats.moreStats;
        tournament_mvps = tournamentStats.tournament_mvps;
    }

    let tournament_mvps_block = null;
    let mvp_stats_block = null;
    let general_stats_block = null;

    // console.log(general_stats);
    if (general_stats['total_games'] > 0) {

        const description = [];
        const total_description = [];

        const dtToday = formatDate(new Date());
        const total_games_today = general_stats['total_games_per_day'][dtToday] || 0;

        const key1 = (percents) ? 'total_percents_per_day' : 'total_points_per_day';
        let total_points_today = general_stats[key1][dtToday] || 0
        if (percents){
            let details = general_stats['total_percents_per_day_details'][dtToday] || "";
            details = details.replace(/(<([^>]+)>)/gi, "");
            total_points_today += `%${details}`
        }

        const what_stat = (percents) ? "Percents" : "Points";

        // console.log(general_stats);

        const key2 = (percents) ? 'total_percents' : 'total_points';
        description.push(`Games: ${total_games_today}`);
        description.push(`${what_stat}: ${total_points_today}`);

        if (totalTournaments) total_description.push(totalTournaments);
        total_description.push(`Games: ${general_stats['total_games']}`);
        total_description.push(`${what_stat}: ${general_stats[key2]}`);

        const values = {};
        const mvp_values = {};

        let cols = (percents) ? ["","Days with most games", "Days with most percents"] : false;

        const ppd = Object.keys(general_stats[key1]).sort((a, b) => {
            return general_stats[key1][b] - general_stats[key1][a];
        });

        const gpd = Object.keys(general_stats['total_games_per_day']).sort((a, b) => {
            return general_stats['total_games_per_day'][b] - general_stats['total_games_per_day'][a];
        });

        if (gpd.length === 0) {
            values['#1'] = values['#1'] || [];
            values[`#1`].push(`-`);
        }
        for (let i = 0; i < gpd.length && i <= TOP_STATS_MAX_VIEW_MORE - 1; i++) {
            values[`#${i+1}`] = values[`#${i+1}`] || [];
            const date = gpd[i];
            const value = general_stats['total_games_per_day'][gpd[i]];

            let row = `${date} - ${value}`;
            if (date === dtToday){
                row = `<span style="font-weight:bold">${row}</span>`;
            }

            values[`#${i+1}`].push(row);
        }

        if (ppd.length === 0) {
            values[`#1`] = values[`#1`] || [];
            values[`#1`].push(`-`);
        }
        const key3 = (percents) ? 'total_percents_per_day' : 'total_points_per_day';
        const suffix = (percents) ? '%' : '';
        for (let i = 0; i < ppd.length && i <= TOP_STATS_MAX_VIEW_MORE - 1; i++) {
            values[`#${i+1}`] = values[`#${i+1}`] || [];

            const date = ppd[i];
            let value = general_stats[key3][ppd[i]];

            let details = (percents) ? `${general_stats['total_percents_per_day_details'][ppd[i]]}` : '';

            let row = `${date} - ${value}${suffix}`;
            if (date === dtToday){
                details = details.replace('gray','black').replace('normal','bold');
                row = `<span style="font-weight:bold">${row}</span>`;
            }

            row += details;

            values[`#${i+1}`].push(row);
        }

        let descriptionText = '<b>Today: </b>' + description.join(' | ') + '<br><b>Totals: </b>' + total_description.join(' | ');

        if (general_stats['shortest_game']){
            descriptionText += '<br><b>Shortest Game: </b>' + formatDate(new Date(general_stats['shortest_game_at'])) + ' - ' +  formatTimeAgo(general_stats['shortest_game']);
        }
        if (general_stats['longest_game']){
            descriptionText += '<br><b>Longest Game: </b>' + formatDate(new Date(general_stats['longest_game_at'])) + ' - ' + formatTimeAgo(general_stats['longest_game']);
        }

        if (moreStats){
            descriptionText += moreStats;
        }

        general_stats_block = (
            <StatsTable
                title={`${game_mode} Stats`}
                description={descriptionText}
                cols={cols || ["","Days with most games", "Days with most points"]}
                stats={values}
            />
        );

        // ------------------------------------------------------
        // NBA21-173
        // ------------------------------------------------------
        let perfect_scores_block = undefined;
        let no_scores_block = undefined;
        if (general_stats['rounds_per_day'] && Object.keys(general_stats['rounds_per_day']).length > 0){

            const hash = {};
            let i;

            // no scores per day
            ['no_scores_data', 'perfect_scores_data'].forEach((what) => {
                ['per_day', 'percents_per_day'].forEach((key) => {

                    i = 0;
                    Object.keys(general_stats[what][key]).sort((a, b) => {
                        return general_stats[what][key][b] - general_stats[what][key][a];
                    }).forEach((day) => {
                        if (i <= TOP_STATS_MAX_VIEW_MORE) {

                            hash[what] = hash[what] || [];

                            hash[what][`#${i + 1}`] = hash[what][`#${i + 1}`] || [];

                            let total = general_stats[what][key][day];
                            let row = day + ' - ' + total;

                            if (key.indexOf('percents') !== -1) {
                                total = (general_stats[what][key][day]).toFixed(2);
                                row = day + ' - ' + total + '% (' + general_stats[what]['per_day'][day] + '/' + general_stats['rounds_per_day'][day] + ')';
                            }

                            if (day === dtToday) {
                                row = `<span style="font-weight:bold">${row}</span>`;
                            }

                            hash[what][`#${i + 1}`].push(row);
                        }
                        i++;
                    });

                });
            });

            perfect_scores_block = (
                <StatsTable
                    title={`Perfect Scores`}
                    // description={descriptionText}
                    cols={["","Days with most perfect scores", "Days with most perfect scores percents"]}
                    stats={hash['perfect_scores_data']}
                />
            );

            no_scores_block = (
                <StatsTable
                    title={`No Scores`}
                    // description={descriptionText}
                    cols={["","Days with most no-scores", "Days with most no-scores percents"]}
                    stats={hash['no_scores_data']}
                />
            );

        }
        // ------------------------------------------------------

        if (mvp_block && Object.keys(mvp_stats).length > 0) {

            const { total_mvps_per_player, total_mvps_on_knockouts_per_player, total_mvps, total_mvps_on_knockouts } = mvp_stats;

            const mvps_leaderboard = Object.keys(total_mvps_per_player).sort((a,b) => { return total_mvps_per_player[b] - total_mvps_per_player[a] });
            mvps_leaderboard.forEach((player, i) => {

                if (i < TOP_STATS_NUMBER * 100) {
                    mvp_values[`#${i + 1}`] = mvp_values[`#${i + 1}`] || [];
                    mvp_values[`#${i + 1}`].push(`${player} - ${total_mvps_per_player[player]}`);
                }
            });

            const mvps_knockouts_leaderboard = Object.keys(total_mvps_on_knockouts_per_player).sort((a,b) => { return total_mvps_on_knockouts_per_player[b] - total_mvps_on_knockouts_per_player[a] });
            mvps_knockouts_leaderboard.forEach((player, i) => {
                if (i < TOP_STATS_NUMBER * 100) {
                    mvp_values[`#${i + 1}`] = mvp_values[`#${i + 1}`] || [];
                    mvp_values[`#${i + 1}`].push(`${player} - ${total_mvps_on_knockouts_per_player[player]}`);
                }
            });

            const mvp_description = [];
            mvp_description.push(`Total MVPs: ${total_mvps}`);
            mvp_description.push(`Total Knockouts MVPs: ${total_mvps_on_knockouts}`);

            mvp_stats_block = (
                <StatsTable
                    title={`MVP Stats`}
                    description={mvp_description.join(' | ')}
                    cols={["","Total MVPs", "Total MVPs on Knockouts"]}
                    stats={mvp_values}
                />
            );
        }

        if (tournament_mvps) {

            const tournament_mvps_values = {};

            let total_mvps = 0;

            const mvps_leaderboard = Object.keys(tournament_mvps).sort((a,b) => { return tournament_mvps[b] - tournament_mvps[a] });
            mvps_leaderboard.forEach((player, i) => {

                total_mvps += tournament_mvps[player];

                tournament_mvps_values[`#${i + 1}`] = tournament_mvps_values[`#${i + 1}`] || [];
                tournament_mvps_values[`#${i + 1}`].push(`${player} - ${tournament_mvps[player]}`);
            });

            const tournament_mvps_description = [];
            tournament_mvps_description.push(`Total MVPs: ${total_mvps}`);
            tournament_mvps_description.push(`Total Players: ${Object.keys(tournament_mvps).length}`);

            tournament_mvps_block = (
                <StatsTable
                    title={`Tournament MVP Stats`}
                    description={tournament_mvps_description.join(' | ')}
                    cols={["","Total Tournament MVPs"]}
                    stats={tournament_mvps_values}
                />
            );
        }

        // if (!wrap && no_scores_block){
        //     general_stats_block = (
        //         <div className="ui link cards centered">
        //             {general_stats_block}
        //             {perfect_scores_block}
        //             {no_scores_block}
        //         </div>
        //     )
        // }

        if (wrap){
            general_stats_block = (
                <div className="ui link cards centered" style={statsStyle}>
                    {general_stats_block}
                    {perfect_scores_block}
                    {no_scores_block}
                    {tournament_mvps_block}
                    {mvp_stats_block}
                </div>
            );
        }
    }

    return general_stats_block;
}

export function BuildMVPStatsTable(general_stats, wrap, game_mode) {

    let general_stats_block = null;
    if (general_stats['total_games'] > 0) {

        const description = [];

        const dtToday = formatDate(new Date());
        const total_games_today = general_stats['total_games_per_day'][dtToday] || 0;
        const total_points_today = general_stats['total_points_per_day'][dtToday] || 0;

        description.push(`Total Games Today: ${total_games_today}`);
        description.push(`Total Points Today: ${total_points_today}`);
        description.push(`Total Games: ${general_stats['total_games']}`);
        description.push(`Total Points: ${general_stats['total_points']}`);

        const values = {};

        const ppd = Object.keys(general_stats['total_points_per_day']).sort((a, b) => {
            return general_stats['total_points_per_day'][b] - general_stats['total_points_per_day'][a];
        });

        const gpd = Object.keys(general_stats['total_games_per_day']).sort((a, b) => {
            return general_stats['total_games_per_day'][b] - general_stats['total_games_per_day'][a];
        });

        if (gpd.length === 0) {
            values['#1'] = values['#1'] || [];
            values[`#1`].push(`-`);
        }
        for (let i = 0; i < gpd.length && i <= TOP_STATS_MAX_VIEW_MORE - 1; i++) {
            values[`#${i+1}`] = values[`#${i+1}`] || [];
            values[`#${i+1}`].push(`${gpd[i]} - ${general_stats['total_games_per_day'][gpd[i]]}`);
        }

        if (ppd.length === 0) {
            values[`#1`] = values[`#1`] || [];
            values[`#1`].push(`-`);
        }
        for (let i = 0; i < ppd.length && i <= TOP_STATS_MAX_VIEW_MORE - 1; i++) {
            values[`#${i+1}`] = values[`#${i+1}`] || [];
            values[`#${i+1}`].push(`${ppd[i]} - ${general_stats['total_points_per_day'][ppd[i]]}`);
        }

        general_stats_block = (
            <StatsTable
                title={`${game_mode} Stats`}
                description={description.join(' | ')}
                cols={["","Days with most games", "Days with most points"]}
                stats={values}
            />
        );

        if (wrap){
            general_stats_block = (
                <div className="ui link cards centered" style={statsStyle}>
                    {general_stats_block}
                </div>
            );
        }
    }

    return general_stats_block;
}

export function buildStatsInformation(player1, player2, stats, player_stats_values, matchups_values, what, percents){

    const noStats = { records: [], win_streak: 0, lose_streak: 0, max_lose_streak: 0, max_win_streak: 0, total_knockouts: 0, total_diff: 0, total_diff_per_game: 0, total_games:0, total_wins: 0, total_lost: 0, total_win_percents: "" };

    const stats1 = isDefined(stats[player1?.name]) ? stats[player1.name] : Object.assign({},noStats);
    const stats2 = isDefined(stats[player2?.name]) ? stats[player2.name] : Object.assign({},noStats);

    const curr_stats = [];
    const player_stats = [];

    // stats counter
    let met_each_other = 0;
    let mutual_games_wins1 = 0;
    let mutual_scored1 = 0;
    let mutual_scored2 = 0;
    let mutual_knockouts1 = 0;
    let mutual_knockouts2 = 0;

    const arr = (stats1.records.length > stats2.records.length) ? stats1.records : stats2.records; // in case one of them is empty

    arr.forEach((record) => {

        if (record.team1_name) {
            record.player1_name = record.team1_name;
        }
        if (record.team2_name) {
            record.player2_name = record.team2_name;
        }

        if ((record.player1_name === player1.name && record.player2_name === player2.name) || (record.player1_name === player2.name && record.player2_name === player1.name)) {

            // met each other
            met_each_other += 1;

            if (record.player1_name === player1.name){

                // total scored (for diff)
                mutual_scored1 += record.score1;
                mutual_scored2 += record.score2;

                // counting player1 wins in these mutual games
                if (record.score1 > record.score2) mutual_games_wins1+=1;

                // knockouts
                if (record.score1 === 0 && record.score2 > 0) mutual_knockouts2 += 1;
                else if (record.score2 === 0 && record.score1 > 0) mutual_knockouts1 += 1;

            } else if (record.player2_name === player1.name) {

                // total scored (for diff)
                mutual_scored1 += record.score2;
                mutual_scored2 += record.score1;

                // counting player1 wins in these mutual games
                if (record.score2 > record.score1) mutual_games_wins1+=1;

                // knockouts
                if (record.score1 === 0 && record.score2 > 0) mutual_knockouts1 += 1;
                else if (record.score2 === 0 && record.score1 > 0) mutual_knockouts2 += 1;
            }
        }
    });

    // met each other stat
    if (met_each_other === 0) {
        curr_stats.push(`This is the first time these ${what} meet each other.`);
    } else {
        const plural = (met_each_other > 1) ? "s" : "";

        let mutual_games_wins2 = met_each_other - mutual_games_wins1;
        if (player1.name === player2.name){
            mutual_games_wins1 = met_each_other;
            mutual_games_wins2 = met_each_other;
        }

        // matchups stats
        curr_stats.push(`These ${what} met each other ${met_each_other} time${plural}.`);
        curr_stats.push(`Wins: ${mutual_games_wins1} - ${mutual_games_wins2}`);
        curr_stats.push(`Total Scored: ${mutual_scored1} - ${mutual_scored2}`);
        curr_stats.push(`Total Diff: ${Math.max(0,mutual_scored1-mutual_scored2)} - ${Math.max(0,mutual_scored2-mutual_scored1)}`);
        curr_stats.push(`Knockouts: ${mutual_knockouts1} - ${mutual_knockouts2}`);

        // matchups stats - table
        // matchups_values['Total Previous Matchups'] = [met_each_other,met_each_other];
        matchups_values['Wins'] = [mutual_games_wins1,mutual_games_wins2];
        matchups_values['Total Scored'] = [mutual_scored1,mutual_scored2];
        matchups_values['Total Diff'] = [Math.max(0,mutual_scored1-mutual_scored2), Math.max(0,mutual_scored2-mutual_scored1)];
        matchups_values['Knockouts'] = [mutual_knockouts1, mutual_knockouts2];
    }

    // on fire / ice cold
    let onfire1 = "";
    let icecold1 = "";
    let onfire2 = "";
    let icecold2 = "";
    if (stats1.win_streak >= ON_FIRE_THRESHOLD){
        onfire1 = ` <span style="color:${ON_FIRE_COLOR}">On Fire! <img className="on-fire-image" style="${ON_FIRE_STYLE}; top:4px;" src="${ON_FIRE_ICON}" /></span>`

        stats1.win_streak += onfire1;
    }
    if (stats1.lose_streak >= ICE_COLD_THRESHOLD){
        icecold1 = ` <span style="color:${ICE_COLD_COLOR}">Ice Cold <img className="ice-cold-image" style="${ICE_COLD_STYLE}; top:4px;" src="${ICE_COLD_ICON}" /></span>`

        stats1.lose_streak += icecold1;
    }
    if (stats2.win_streak >= ON_FIRE_THRESHOLD){
        onfire2 = ` <span style="color:${ON_FIRE_COLOR}">On Fire! <img className="on-fire-image" style="${ON_FIRE_STYLE}; top:4px;" src="${ON_FIRE_ICON}" /></span>`

        stats2.win_streak += onfire2;
    }
    if (stats2.lose_streak >= ICE_COLD_THRESHOLD){
        icecold2 = ` <span style="color:${ICE_COLD_COLOR}">Ice Cold <img className="ice-cold-image" style="${ICE_COLD_STYLE}; top:4px;" src="${ICE_COLD_ICON}" /></span>`

        stats2.lose_streak += icecold2;
    }

    // player stats
    player_stats.push(`Total Played Games: ${stats1.total_games} - ${stats2.total_games}`);
    player_stats.push(`Standing: ${stats1.total_wins}W ${stats1.total_lost}L ${(stats1.total_win_percents) ? '(' + stats1.total_win_percents + ')' : ''} - ${stats2.total_wins}W ${stats2.total_lost}L ${(stats2.total_win_percents) ? '(' + stats2.total_win_percents + ')' : ''}`);
    player_stats.push(`Current Win Streak: ${stats1.win_streak} - ${stats2.win_streak}`);
    player_stats.push(`Current Lose Streak: ${stats1.lose_streak} - ${stats2.lose_streak}`);
    player_stats.push(`Best Win Streak: ${stats1.max_win_streak} - ${stats2.max_win_streak}`);
    player_stats.push(`Worst Lose Streak: ${stats1.max_lose_streak} - ${stats2.max_lose_streak}`);
    player_stats.push(`Total Knockouts: ${stats1.total_knockouts} - ${stats2.total_knockouts}`);
    player_stats.push(`Total Diff: ${stats1.total_diff} / ${stats2.total_diff}`);
    player_stats.push(`Total Diff Per Game: ${stats1.total_diff_per_game} / ${stats2.total_diff_per_game}`);

    // player stats - table
    player_stats_values['Total Played Games'] = [stats1.total_games, stats2.total_games];
    player_stats_values['Standing'] = [`${stats1.total_wins}W ${stats1.total_lost}L ${(stats1.total_win_percents)}`, `${stats2.total_wins}W ${stats2.total_lost}L ${(stats2.total_win_percents)}`];
    player_stats_values['Current Win Streak'] = [stats1.win_streak, stats2.win_streak];
    player_stats_values['Current Lose Streak'] = [stats1.lose_streak, stats2.lose_streak];
    player_stats_values['Best Win Streak'] = [stats1.max_win_streak, stats2.max_win_streak];
    player_stats_values['Worst Lose Streak'] = [stats1.max_lose_streak, stats2.max_lose_streak];
    player_stats_values['Total Knockouts'] = [stats1.total_knockouts, stats2.total_knockouts];
    player_stats_values['Total Diff'] = [stats1.total_diff, stats2.total_diff];
    player_stats_values['Total Diff Per Game'] = [stats1.total_diff_per_game, stats2.total_diff_per_game];

    // general stats
    const { general_stats } = buildGeneralStats(stats, percents);

    return {curr_stats, player_stats, player_stats_values, matchups_values, met_each_other, general_stats};
}

export function buildGeneralStats(stats, percents, stopwatch) {
    let general_stats = {
        'total_games': 0,
        'total_games_per_day': {},
        'total_points': 0,
        'total_points_per_day': {},
    };

    if (percents){
        general_stats = {
            'total_games': 0,
            'total_games_per_day': {},
            'total_percents': 0,
            'total_percents_per_day': {},
            'total_percents_per_day_details': {},
            'total_scored': 0,
            'total_attempts': 0,
        };
    }

    const mvp_stats = {
        'total_mvps': 0,
        'total_mvps_per_player': {},
        'total_mvps_on_knockouts': 0,
        'total_mvps_on_knockouts_per_player': {},
    };

    const date_stats = {};
    const base_stats = {
        total_games: 0,
        total_percents: 0,
        total_scored: 0,
        total_from: 0,
    }

    // ------------------------------------------------------
    // NBA21-173
    // ------------------------------------------------------
    let seen_games = {};
    let no_scores_data = {
        total: 0,
        per_day: {},
    };
    let perfect_scores_data = {
        total: 0,
        per_day: {},
    }
    let rounds_per_day = {};
    // ------------------------------------------------------

    Object.keys(stats).forEach((player) => {

        if (!stats[player].records) { return; }

        stats[player].records.forEach((record,idx) => {

            // ------------------------------------------------------
            // NBA21-173
            // ------------------------------------------------------
            if (record.scoresHistory) {
                // perfect and no scores totals and percents
                if (!seen_games[record.id]) {
                    const dt = formatDate(new Date(record['addedAt']));
                    // console.log(dt);
                    Object.keys(record.scoresHistory)
                        .filter(player => player.toLowerCase().indexOf('computer') === -1)
                        .forEach((player) => {

                            let total_rounds = record.scoresHistory[player].length;
                            let total_no_scores = record.scoresHistory[player].filter(score => score === 0).length;
                            let total_perfect_scores = record.scoresHistory[player].filter(score => score === record.roundLength).length;

                            rounds_per_day[dt] = rounds_per_day[dt] || 0;
                            rounds_per_day[dt] += total_rounds;

                            no_scores_data['total'] += total_no_scores;
                            no_scores_data['per_day'][dt] = no_scores_data['per_day'][dt] || 0;
                            no_scores_data['per_day'][dt] += total_no_scores;

                            perfect_scores_data['total'] += total_perfect_scores;
                            perfect_scores_data['per_day'][dt] = perfect_scores_data['per_day'][dt] || 0;
                            perfect_scores_data['per_day'][dt] += total_perfect_scores;
                        });
                    // console.log(record);
                    seen_games[record.id] = 1;
                }
            }
            // ------------------------------------------------------

            let divide = (percents && record.scoresHistory) ? Object.keys(record.scoresHistory).filter(x => x.indexOf('Computer') === -1).length : 2;
            if (stopwatch) { divide = 1; } // stopwatch shootout

            // console.log(player, "game #" + idx, "participants " + divide);

            if (record.gameTotalTime){
                general_stats['shortest_game'] =
                    (isDefined(general_stats['shortest_game'])) ?
                        Math.min(general_stats['shortest_game'], record.gameTotalTime) :
                        record.gameTotalTime;

                if (general_stats['shortest_game'] == record.gameTotalTime) {
                    general_stats['shortest_game_at'] = record.addedAt;
                }

                general_stats['longest_game'] =
                    (isDefined(general_stats['longest_game'])) ?
                        Math.max(general_stats['longest_game'], record.gameTotalTime) :
                        record.gameTotalTime;

                if (general_stats['longest_game'] == record.gameTotalTime) {
                    general_stats['longest_game_at'] = record.addedAt;
                }
            }

            if (divide > 0) {
                general_stats['total_games'] += (1 / divide);
            }

            // console.log("total games: ", general_stats['total_games']);

            if (percents) { }
            else if (stopwatch) { general_stats['total_points'] += record.score; }
            else { general_stats['total_points'] += ((record.score1 + record.score2)/2); }

            const dt = formatDate(new Date(record.addedAt));
            general_stats['total_games_per_day'][dt] = general_stats['total_games_per_day'][dt] || 0;
            if (divide) {
                general_stats['total_games_per_day'][dt] += 1/divide;
            }

            if (percents) {

                date_stats[dt] = date_stats[dt] || {...base_stats};

                // for Randoms. (there name is "playerName (Random 123)"
                let temp = {...record.scoresHistory};
                let scoresHistory = {};
                Object.keys(temp).forEach((x) => { scoresHistory[x.split(' (')[0]] = temp[x] });

                const values = scoresHistory[player] || [0];
                const sum = values.reduce((a, b) => a + b, 0);
                date_stats[dt].total_scored += sum;
                date_stats[dt].total_from += (values.length * record.roundLength);

                general_stats.total_scored += sum;
                general_stats.total_attempts += (values.length * record.roundLength);

                date_stats[dt].total_percents = ((date_stats[dt].total_scored / date_stats[dt].total_from)*100).toFixed(2);

            }
            else {
                general_stats['total_points_per_day'][dt] = general_stats['total_points_per_day'][dt] || 0;

                if (stopwatch) {
                    general_stats['total_points_per_day'][dt] += record.score;
                }
                else {
                    general_stats['total_points_per_day'][dt] += ((record.score1 + record.score2) / 2);
                }
            }

            if (record.mvp_player){
                const mvp = record.mvp_player?.name || record.mvp_player;
                mvp_stats['total_mvps'] += 0.5;
                mvp_stats['total_mvps_per_player'][mvp] = mvp_stats['total_mvps_per_player'][mvp] || 0;
                mvp_stats['total_mvps_per_player'][mvp] += 0.5;

                if (record.score1 === 0 || record.score2 === 0){
                    mvp_stats['total_mvps_on_knockouts'] += 0.5;
                    mvp_stats['total_mvps_on_knockouts_per_player'][mvp] = mvp_stats['total_mvps_on_knockouts_per_player'][mvp] || 0;
                    mvp_stats['total_mvps_on_knockouts_per_player'][mvp] += 0.5;
                }
            }
        })
    });

    // ------------------------------------------------------
    // NBA21-173
    // ------------------------------------------------------
    Object.keys(rounds_per_day).forEach((day) => {
        const total_rounds = rounds_per_day[day];

        const total_no_scores = no_scores_data['per_day'][day];
        const total_perfect_scores = perfect_scores_data['per_day'][day];

        no_scores_data['percents_per_day'] = no_scores_data['percents_per_day'] || {};
        perfect_scores_data['percents_per_day'] = perfect_scores_data['percents_per_day'] || {};

        no_scores_data['percents_per_day'][day] = (total_no_scores / total_rounds).toFixed(2) * 100;
        perfect_scores_data['percents_per_day'][day] = (total_perfect_scores / total_rounds).toFixed(2) * 100;

    })
    // console.log(no_scores_data);
    // console.log(perfect_scores_data);
    // console.log(rounds_per_day);
    general_stats['no_scores_data'] = no_scores_data;
    general_stats['perfect_scores_data'] = perfect_scores_data;
    general_stats['rounds_per_day'] = rounds_per_day;
    // ------------------------------------------------------

    // console.log(date_stats);

    general_stats['total_games'] = Math.round(general_stats['total_games']).toFixed(0);

    if (percents) {
        Object.keys(general_stats.total_games_per_day).forEach((dt) => {
            general_stats.total_games_per_day[dt] = general_stats.total_games_per_day[dt].toFixed(0);
        })
    }

    if (percents) {
        const days_with_most_percents = Object.keys(date_stats).sort((a, b) => {
            return date_stats[b].total_percents - date_stats[a].total_percents;
        });

        const arr = [];
        days_with_most_percents.forEach((dt) => {
            const curr_percents = date_stats[dt].total_percents
            general_stats.total_percents_per_day[dt] = curr_percents;

            general_stats.total_percents_per_day_details[dt] = ` <span style="color:gray; font-weight:normal;">(${date_stats[dt].total_scored}/${date_stats[dt].total_from})</span>`;

            arr.push(curr_percents);
        });

        // console.log(general_stats);

        // const sum = arr.reduce((a, b) => Number(a) + Number(b), 0);
        // const avg = sum/arr.length;
        const { total_scored, total_attempts } = general_stats;
        const avg = (total_scored/total_attempts) * 100;
        general_stats.total_percents = `${avg.toFixed(2)}% (${total_scored}/${total_attempts})`;
    }

    return { general_stats, mvp_stats };
}

// ms to verbal
export function formatTimeAgo(time_ago_ms) {

    let parts = [];
    if (time_ago_ms > 60){
        let min = parseInt((time_ago_ms / 60).toString());
        time_ago_ms = time_ago_ms -= (min * 60);

        parts.push(min + " minutes");
    }
    time_ago_ms = parseInt((time_ago_ms).toString());
    if (time_ago_ms > 0){
        parts.push(time_ago_ms + " seconds");
    }

    return parts.join(", ");
}