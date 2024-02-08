import {calcPercents, formatDate, isDefined, nth, numberWithCommas} from "./utils";
import {
    ICE_COLD_COLOR, ICE_COLD_ICON, ICE_COLD_STYLE,
    ICE_COLD_THRESHOLD,
    ON_FIRE_COLOR,
    ON_FIRE_ICON,
    ON_FIRE_STYLE,
    ON_FIRE_THRESHOLD
} from "./consts";

export function buildDetails(details, stats){

    const {
        _2k_rating,
        place,
        percents, // 3pt percents
        height_meters,
        weight_kgs,
    } = details;

    let {
        // stats details
        total_win_percents,
        total_wins,
        total_lost,
        total_games,
        win_streak,
        lose_streak,
        total_diff,
        total_diff_per_game,
        avg_opponent_2k_rating,
        total_home_games,
        total_away_games,
        total_scored,
        total_suffered,
        total_knockouts,
        total_suffered_knockouts,
        max_win_streak,
        max_lose_streak,

        // order by highlightes
        highlights,

        // real stats
        WP,
        GP,
        MPG,
        PPG,
        RPG,
        APG,
        SPG,
        BPG,
        TPG,
        FGM,
        FGA,
        FGP,
        FTM,
        FTA,
        FTP,
        _3PM,
        _3PA,
        _3PP,
        MIN,
        PTS,
        REB,
        AST,
        STL,
        BLK,
        TOV,
        PF,
        PM,
        PFP,
        PMP,

        average_place,
        total_computers,
        total_randoms,
        total_shot_average,
        total_from,

        // 3pt
        perfect_scores,
        no_scores,
        total_rounds,
        max_perfect_scores_in_game,
        max_no_scores_in_game,
        average_perfect_scores_in_game,
        perfect_scores_percents,

        max_perfect_scores_in_game_date,
        max_perfect_scores_in_game_percents,
        max_no_scores_in_game_date,
        max_no_scores_in_game_percents,
        max_perfect_scores_in_game_place,
        max_no_scores_in_game_place,

        best_percentage_in_game,
        best_percentage_in_game_date,
        best_percentage_in_game_shots,
        best_percentage_in_game_attempts,
        best_percentage_in_game_place,
        worst_percentage_in_game,
        worst_percentage_in_game_date,
        worst_percentage_in_game_shots,
        worst_percentage_in_game_attempts,
        worst_percentage_in_game_place,

        // stopwatch shootout
        average_points_per_minute,
        average_round_length,
        total_minutes,

        // comebacks and overtimes
        total_overtimes,
        total_won_comebacks,
        total_lost_comebacks,

        injury_last_update,
        injury_status,
        injury_details,

        total_home_wins,
        total_home_lost,
        total_road_wins,
        total_road_lost,

        // tournaments
        total_tournaments,
        total_tournament_wins,
        total_matchups,
        total_ot_wins,
        total_ot_lost,

    } = stats;

    const total_games_with_overtime = total_ot_wins + total_ot_lost;

    total_diff_per_game = total_diff_per_game || 'N/A';
    if(total_win_percents === 0) total_win_percents = "0.00%";

    let settings = {
        '2K Rating': _2k_rating,

        'Total Wins Percents': total_win_percents,
        'Total Wins': `${total_wins}W`,
        'Total Lost': `${total_lost}L`,
        'Total Games': total_games,
        'Current Win Streak': win_streak,
        'Current Lose Streak': lose_streak,
        'Total Diff': total_diff,

        'Average Opponent 2K Rating': avg_opponent_2k_rating?.toFixed(0),

        'Total Diff Per Game': `(${total_diff_per_game} per game)`,
        'Total Home Games': total_home_games,
        'Total Road Games': total_away_games,
        'Total Scored': total_scored,
        'Total Suffered': total_suffered,
        'Total Knockouts': total_knockouts,
        'Total Suffered Knockouts': total_suffered_knockouts,
        'Max Win Streak': `(Max: ${isDefined(max_win_streak) ? max_win_streak : 'N/A'})`,
        'Max Lose Streak': `(Max: ${isDefined(max_lose_streak) ? max_lose_streak : 'N/A'})`,

        // real stats
        'Career Win%': `${WP}%`,
        'Career Games Played': numberWithCommas(GP),
        'Career Minutes Per Game': `${MPG}`,
        'Career Points Per Game': `${PPG}`,
        'Career Rebounds Per Game': `${RPG}`,
        'Career Assists Per Game': `${APG}`,
        'Career Steals Per Game': `${SPG}`,
        'Career Blocks Per Game': `${BPG}`,
        'Career Turnovers Per Game': `${TPG}`,
        'Career FG Made': `${FGM}`,
        'Career FG Attempts': `${FGA}`,
        'Career FG%': `${FGP}%`,
        'Career FT Made': `${FTM}`,
        'Career FT Attempts': `${FTA}`,
        'Career FT%': `${FTP}%`,
        'Career 3P Made': `${_3PM}`,
        'Career 3P Attempts': `${_3PA}`,
        'Career 3P%': `${_3PP}%`,
        'Career Total Minutes': `${numberWithCommas(MIN)}`,
        'Career Total Points': `${numberWithCommas(PTS)}`,
        'Career Total Rebounds': `${numberWithCommas(REB)}`,
        'Career Total Assists': `${numberWithCommas(AST)}`,
        'Career Total Steals': `${numberWithCommas(STL)}`,
        'Career Total Blocks': `${numberWithCommas(BLK)}`,
        'Career Total Turnovers': `${numberWithCommas(TOV)}`,
        'Career Total Personal Fouls': `${numberWithCommas(PF)}`,
        'Career Total +/-': `${numberWithCommas(PM)}`,
        'Personal Fouls Per Game': `${PFP}`,
        '+/- Per Game': `${PMP}`,

        // three points contest
        'Average Place': (average_place === 0) ? "N/A" : `${average_place}${nth(average_place)}`, // 0 - never played as regular player. only computer
        'Total Games Played as Random': `${total_randoms}`,
        'Total Games Played as Computer': `${total_computers}`,
        'Total Shots Average': `${total_shot_average}`,
        'Total Shots Attempts': `${total_from}`,

        'Total Perfect Scores': `${perfect_scores}`,
        'Total No Scores': `${no_scores}`,
        'Total Rounds': `${total_rounds}`,
        'Max Perfect Scores in Game': `${max_perfect_scores_in_game}`,
        'Max No Scores in Game': `${max_no_scores_in_game}`,
        'Average Perfect Scores in Game': `${average_perfect_scores_in_game}`,
        'Perfect Scores Percents': `${perfect_scores_percents}`,

        'Best Percentage in Game': `${best_percentage_in_game}%`,
        'Worst Percentage in Game': `${worst_percentage_in_game}%`,

        // stopwatch shootout
        'Average Scores Per Minute': `${average_points_per_minute}`,
        'Average Round Length': `${average_round_length}`,
        'Total Minutes': `${total_minutes}`,

        // stopwatch shootout
        'Total Overtimes': `${total_overtimes}`,
        'Total Overtimes Wins': `${total_ot_wins}`,
        'Total Overtimes Lost': `${total_ot_lost}`,
        'Total Games with Overtime': `${total_games_with_overtime}`,
        'Total Overtimes Wins Percent': `${calcPercents(total_ot_wins, total_ot_wins + total_ot_lost)}%`,
        'Total Comebacks Made': `${total_won_comebacks}`,
        'Total Comebacks Suffered': `${total_lost_comebacks}`,

        'Injury Last Update': `${injury_last_update}`,
        'Injury Status': `${injury_status}`,
        'Injury Details': `${injury_details}`,

        'Total Home Wins': `${total_home_wins}`,
        'Total Home Lost': `${total_home_lost}`,
        'Total Road Wins': `${total_road_wins}`,
        'Total Road Lost': `${total_road_lost}`,

        'Total Tournaments': `${total_tournaments}`,
        'Total Championships': `${total_tournament_wins}`,
        'Total Matchups': `${total_matchups}`,
    };

    // on fire / ice cold
    let onfire = "";
    let icecold = "";
    if (win_streak >= ON_FIRE_THRESHOLD){
        onfire = ` <span style="color:${ON_FIRE_COLOR}">On Fire! <img style="${ON_FIRE_STYLE}" src="${ON_FIRE_ICON}" /></span>`
    }
    if (lose_streak >= ICE_COLD_THRESHOLD){
        icecold = ` <span style="color:${ICE_COLD_COLOR}">Ice Cold <img style="${ICE_COLD_STYLE}" src="${ICE_COLD_ICON}" /></span>`
    }

    // order by highlights
    if (highlights) {
        Object.keys(settings).map((name) => {
            if(highlights.indexOf(name) !== -1){
                settings[name] = `<b><u>${settings[name]}</u></b>`
            }
        });
    }

    let details_arr = [];

    // general details
    if (place) details_arr.push(place + nth(place));
    if (percents) details_arr.push("3Pt Percents: " + percents);
    if (_2k_rating) details_arr.push(`2K Rating: ${settings['2K Rating']}`);
    if (avg_opponent_2k_rating) details_arr.push(`Average Opponent 2K Rating: ${settings['Average Opponent 2K Rating']}`);
    if (height_meters) details_arr.push("Height: " + height_meters + " meters");
    if (weight_kgs) details_arr.push("Weight: " + weight_kgs + " kgs");

    const hr_style = 'border: 1px solid #eaeaea; border-bottom: 0px; top: 10px; position: relative; margin-bottom:20px';
    const divider = "<hr style='" + hr_style + "'/>";

    // stats
    let stats_arr = [];
    if (isDefined(total_tournament_wins)) stats_arr.push(`Total Championships: ${settings['Total Championships']}`);
    if (total_win_percents) stats_arr.push(`Total Wins Percents: ${settings['Total Wins Percents']} (${settings['Total Wins']} - ${settings['Total Lost']})`);
    if (isDefined(total_tournaments)) stats_arr.push(`Total Tournaments: ${settings['Total Tournaments']}`);
    if (total_games) stats_arr.push(`Total Games: ${settings['Total Games']}`);
    if (isDefined(win_streak)) { stats_arr.push(`Win Streak: ${settings['Current Win Streak']} ${settings['Max Win Streak']}` + onfire); }
    if (isDefined(lose_streak)) { stats_arr.push(`Lose Streak: ${settings['Current Lose Streak']} ${settings['Max Lose Streak']}` + icecold); }
    if (isDefined(total_home_games) && isDefined(total_away_games)) stats_arr.push(`Home/Road Games: ${settings['Total Home Games']} - ${settings['Total Road Games']}`);
    if (isDefined(total_diff)) stats_arr.push(`Total Diff: ${settings['Total Diff']} ${settings['Total Diff Per Game']}`);
    if (isDefined(total_scored) && isDefined(total_suffered)) stats_arr.push(`Total Scored/Suffered: ${settings['Total Scored']} - ${settings['Total Suffered']}`);
    else if (isDefined(total_scored)) stats_arr.push(`Total Scored: ${settings['Total Scored']}`);
    if (isDefined(total_knockouts)) stats_arr.push(`Total Knockouts Did/Suffered: ${settings['Total Knockouts']} - ${settings['Total Suffered Knockouts']}`);

    // real stats
    if (isDefined(WP)) stats_arr.push(`Career Win%: ${settings['Career Win%']}`);
    if (isDefined(GP)) stats_arr.push(`Career Games Played: ${settings['Career Games Played']}`);
    if (isDefined(_3PP)) stats_arr.push(`Career 3P%: ${settings['Career 3P%']}`);
    if (isDefined(FGP)) stats_arr.push(`Career FG%: ${settings['Career FG%']}`);
    if (isDefined(FTP)) stats_arr.push(`Career FT%: ${settings['Career FT%']}`);
    if (isDefined(MPG)) stats_arr.push(`Career MPG: ${settings['Career Minutes Per Game']}`);
    if (isDefined(PPG)) stats_arr.push(`Career PPG: ${settings['Career Points Per Game']}`);
    if (isDefined(RPG)) stats_arr.push(`Career RPG: ${settings['Career Rebounds Per Game']}`);
    if (isDefined(APG)) stats_arr.push(`Career APG: ${settings['Career Assists Per Game']}`);
    if (isDefined(SPG)) stats_arr.push(`Career SPG: ${settings['Career Steals Per Game']}`);
    if (isDefined(BPG)) stats_arr.push(`Career BPG: ${settings['Career Blocks Per Game']}`);
    if (isDefined(TPG)) stats_arr.push(`Career TPG: ${settings['Career Turnovers Per Game']}`);
    if (isDefined(FGM)) stats_arr.push(`Career FGM: ${settings['Career FG Made']}`);
    if (isDefined(FGA)) stats_arr.push(`Career FGA: ${settings['Career FG Attempts']}`);
    if (isDefined(FTM)) stats_arr.push(`Career FTM: ${settings['Career FT Made']}`);
    if (isDefined(FTA)) stats_arr.push(`Career FTA: ${settings['Career FT Attempts']}`);
    if (isDefined(_3PM)) stats_arr.push(`Career 3PM: ${settings['Career 3P Made']}`);
    if (isDefined(_3PA)) stats_arr.push(`Career 3PA: ${settings['Career 3P Attempts']}`);
    if (isDefined(MIN)) stats_arr.push(`Career Total Minutes: ${settings['Career Total Minutes']}`);
    if (isDefined(PTS)) stats_arr.push(`Career Total Points: ${settings['Career Total Points']}`);
    if (isDefined(REB)) stats_arr.push(`Career Total Rebounds: ${settings['Career Total Rebounds']}`);
    if (isDefined(AST)) stats_arr.push(`Career Total Assists: ${settings['Career Total Assists']}`);
    if (isDefined(STL)) stats_arr.push(`Career Total Steals: ${settings['Career Total Steals']}`);
    if (isDefined(BLK)) stats_arr.push(`Career Total Blocks: ${settings['Career Total Blocks']}`);
    if (isDefined(TOV)) stats_arr.push(`Career Total Turnovers: ${settings['Career Total Turnovers']}`);
    if (isDefined(PF)) stats_arr.push(`Career Total Personal Fouls: ${settings['Career Total Personal Fouls']}`);
    if (isDefined(PM)) stats_arr.push(`Career Total +/-: ${settings['Career Total +/-']}`);
    if (isDefined(PFP)) stats_arr.push(`Personal Fouls Per Game: ${settings['Personal Fouls Per Game']}`);
    if (isDefined(PMP)) stats_arr.push(`+/- Per Game: ${settings['+/- Per Game']}`);

    // 3pts
    if (isDefined(average_place)) stats_arr.push(`Average Place: ${settings['Average Place']}`);
    if (isDefined(total_randoms)) stats_arr.push(`Total Games Played as Random: ${settings['Total Games Played as Random']}`);
    if (isDefined(total_computers)) stats_arr.push(`Total Games Played as Computer: ${settings['Total Games Played as Computer']}`);

    if (isDefined(total_from)) stats_arr.push(`Total Shots Attempts: ${settings['Total Shots Attempts']}`);
    if (isDefined(total_shot_average)) stats_arr.push(`Total Shots Average: ${settings['Total Shots Average']}`);

    if (isDefined(perfect_scores)) stats_arr.push(`Total Perfect Scores: ${settings['Total Perfect Scores']}`);
    if (isDefined(no_scores)) stats_arr.push(`Total No Scores: ${settings['Total No Scores']}`);
    if (isDefined(total_rounds)) stats_arr.push(`Total Rounds: ${settings['Total Rounds']}`);
    let when = (isDefined(max_perfect_scores_in_game) && max_perfect_scores_in_game > 0) ? `<br><span style="opacity:0.3; font-weight:normal;">(at: ${max_perfect_scores_in_game_date}, ${max_perfect_scores_in_game_percents}, ${max_perfect_scores_in_game_place})</span>` : "";
    if (isDefined(max_perfect_scores_in_game)) stats_arr.push(`Max Perfect Scores in Game: ${settings['Max Perfect Scores in Game']}${when}`);
    when = (isDefined(max_no_scores_in_game) && max_no_scores_in_game > 0) ? `<br><span style="opacity:0.3; font-weight:normal;">(at: ${max_no_scores_in_game_date}, ${max_no_scores_in_game_percents}, ${max_no_scores_in_game_place})</span></div>` : "";
    if (isDefined(max_no_scores_in_game)) stats_arr.push(`Max No Scores in Game: ${settings['Max No Scores in Game']}${when}`);
    if (isDefined(average_perfect_scores_in_game)) stats_arr.push(`Average Perfect Scores in Game: ${settings['Average Perfect Scores in Game']}`);
    if (isDefined(perfect_scores_percents)) stats_arr.push(`Perfect Scores Percents: ${settings['Perfect Scores Percents']}`);

    when = (isDefined(best_percentage_in_game) && best_percentage_in_game > 0) ? `<br><span style="opacity:0.3; font-weight:normal;">(at: ${best_percentage_in_game_date}, ${best_percentage_in_game_shots}/${best_percentage_in_game_attempts}, ${best_percentage_in_game_place})</span></div>` : "";
    if (isDefined(best_percentage_in_game)) stats_arr.push(`Best Percentage in Game: ${settings['Best Percentage in Game']}${when}`);

    when = (isDefined(worst_percentage_in_game) && worst_percentage_in_game < 999) ? `<br><span style="opacity:0.3; font-weight:normal;">(at: ${worst_percentage_in_game_date}, ${worst_percentage_in_game_shots}/${worst_percentage_in_game_attempts}, ${worst_percentage_in_game_place})</span></div>` : "";
    if (isDefined(worst_percentage_in_game)) stats_arr.push(`Worst Percentage in Game: ${settings['Worst Percentage in Game']}${when}`);


    // stopwatch shootout
    if (isDefined(average_points_per_minute)) stats_arr.push(`Average Scores Per Minute: ${settings['Average Scores Per Minute']}`);
    if (isDefined(average_round_length)) stats_arr.push(`Average Round Length: ${settings['Average Round Length']}`);
    if (isDefined(total_minutes)) stats_arr.push(`Total Minutes: ${settings['Total Minutes']}`);

    if (isDefined(total_overtimes)) stats_arr.push(`Total Overtimes: ${settings['Total Overtimes']}`);
    if (isDefined(total_won_comebacks)) stats_arr.push(`Total Comebacks Made: ${settings['Total Comebacks Made']}`);
    if (isDefined(total_lost_comebacks)) stats_arr.push(`Total Comebacks Suffered: ${settings['Total Comebacks Suffered']}`);

    if (isDefined(injury_last_update)) stats_arr.push(`Injury Last Update: ${settings['Injury Last Update']}`);
    if (isDefined(injury_status)) stats_arr.push(`Injury Status: ${settings['Injury Status']}`);
    if (isDefined(injury_details)) stats_arr.push(`Injury Details: ${settings['Injury Details']}`);

    if (isDefined(total_home_lost) || isDefined(total_home_wins)) stats_arr.push(`Total Home Wins/Lost: ${settings['Total Home Wins']}-${settings['Total Home Lost']}`);
    if (isDefined(total_road_wins) || isDefined(total_road_lost)) stats_arr.push(`Total Road Wins/Lost: ${settings['Total Road Wins']}-${settings['Total Road Lost']}`);

    if (isDefined(total_matchups)) stats_arr.push(`Total Matchups: ${settings['Total Matchups']}`);

    // highlighted items first
    let first = [];
    stats_arr = stats_arr.filter((x) => {
        if (x.indexOf('<b>') !== -1){
            first.push(x);
            return false;
        }
        return true;
    });
    stats_arr = [...first,...stats_arr];

    if (stats_arr.length > 0) {
        details_arr.push(divider);
    }

    // if(stats_arr.length > 3){
    //     details_arr.push(divider);
    // }

    const lastSync1 = (details.lastSyncAt) ? formatDate(new Date(details.lastSyncAt)) : undefined;
    const lastSync2 = (stats.lastSyncAt) ? formatDate(new Date(stats.lastSyncAt)) : undefined;

    if (lastSync1){
        details_arr.unshift(`<span style="opacity:0.6">Updated To: ${lastSync1}</span>`);
    }

    if (lastSync2 && lastSync1 !== lastSync2){
        stats_arr.unshift(`<span style="opacity:0.6">Updated To: ${lastSync2}</span>`);
    }

    // details_arr = [...details_arr,...stats_arr];

    return { details_arr, stats_arr };
}