import {calcPercents, reFormatDate} from "./utils";

export function overallSort(a,b){

    // console.log(a,b);

    // first sort
    const percent1 = parseFloat(b['total_win_percents']?.toString().replace('%', ''));
    const percent2 = parseFloat(a['total_win_percents']?.toString().replace('%', ''));

    // // second sort
    // const total_games1 = parseFloat(b['total_games']);
    // const total_games2 = parseFloat(a['total_games']);

    // second sort
    const diff1 = parseFloat(b['total_diff_per_game']);
    const diff2 = parseFloat(a['total_diff_per_game']);

    // // third sort
    const total_knockouts1 = parseFloat(b['total_knockouts']);
    const total_knockouts2 = parseFloat(a['total_knockouts']);

    if (percent1 > percent2) return 1;
    else if (percent1 < percent2) return -1;

    // 3pt
    if (a["average_place"] != undefined && b["average_place"] != undefined){
        const place1 = parseFloat(a["average_place"])
        const place2 = parseFloat(b["average_place"])

        if (place1 > place2) return 1;
        else if (place1 < place2) return -1;
    }
    if (a["total_shot_average"] != undefined && b["total_shot_average"] != undefined){
        const shot1 = parseFloat(b["total_shot_average"].toString().replace('%',''))
        const shot2 = parseFloat(a["total_shot_average"].toString().replace('%',''))

        if (shot1 > shot2) return 1;
        else if (shot1 < shot2) return -1;
    }

    if (diff1 > diff2) return 1;
    else if (diff1 < diff2) return -1;

    if (total_knockouts1 > total_knockouts2) return 1;
    else if (total_knockouts1 < total_knockouts2) return -1;

    return 0;
}


export function overallTournamentSort(a,b){

    // console.log(a,b);

    // first sort
    const champion1 = parseInt(b['total_tournament_wins']);
    const champion2 = parseInt(a['total_tournament_wins']);

    // first sort
    const percent1 = parseFloat(b['total_win_percents']?.toString().replace('%', ''));
    const percent2 = parseFloat(a['total_win_percents']?.toString().replace('%', ''));

    // // second sort
    // const total_games1 = parseFloat(b['total_games']);
    // const total_games2 = parseFloat(a['total_games']);

    // second sort
    const diff1 = parseFloat(b['total_diff_per_game']);
    const diff2 = parseFloat(a['total_diff_per_game']);

    // // third sort
    const total_knockouts1 = parseFloat(b['total_knockouts']);
    const total_knockouts2 = parseFloat(a['total_knockouts']);

    if (champion1 > champion2) return 1;
    else if (champion1 < champion2) return -1;

    if (percent1 > percent2) return 1;
    else if (percent1 < percent2) return -1;

    // 3pt
    if (a["average_place"] != undefined && b["average_place"] != undefined){
        const place1 = parseFloat(a["average_place"])
        const place2 = parseFloat(b["average_place"])

        if (place1 > place2) return 1;
        else if (place1 < place2) return -1;
    }
    if (a["total_shot_average"] != undefined && b["total_shot_average"] != undefined){
        const shot1 = parseFloat(b["total_shot_average"].toString().replace('%',''))
        const shot2 = parseFloat(a["total_shot_average"].toString().replace('%',''))

        if (shot1 > shot2) return 1;
        else if (shot1 < shot2) return -1;
    }

    if (diff1 > diff2) return 1;
    else if (diff1 < diff2) return -1;

    if (total_knockouts1 > total_knockouts2) return 1;
    else if (total_knockouts1 < total_knockouts2) return -1;

    return 0;
}


export const OVERALL_HIGHLIGHTS = ['Total Championships', 'Total Wins Percents', 'Total Diff Per Game', 'Total Knockouts', 'Total Shots Average', 'Average Place'];

export function textSort(key, a, b){
    const value1 = b[key];
    const value2 = a[key];

    // console.log(value1,value2);

    if (value1 > value2) return 1;
    else if (value1 < value2) return -1;

    return 0;
}

export function specificSort(key, a, b){
    let value1 = parseFloat(b[key]);
    let value2 = parseFloat(a[key]);

    // console.log(key);
    // console.log(a,b);
    // console.log(value1,value2);

    if (key === 'average_place'){
        if (value1 == 0) { value1 = 999999; }
        if (value2 == 0) { value2 = 999999; }
    }

    if (value1 > value2) return 1;
    else if (value1 < value2) return -1;

    return 0;
}

export function specificSortDate(key, a, b){
    const value1 = (b[key]) ? new Date(reFormatDate(b[key])) : -1;
    const value2 = (a[key]) ? new Date(reFormatDate(a[key])) : -1;

    // console.log(a,b,key,value1,value2);

    return value1 - value2;

    // if (value1 > value2) return 1;
    // else if (value1 < value2) return -1;
    //
    // return 0;
}

export function TeamSort(a,b) {
    const value1 = b?.team?.name;
    const value2 = a?.team?.name;

    if(value1 < value2) { return 1; }
    if(value1 > value2) { return -1; }
    return 0;
}

export function totalGamesSort(a,b){
    return specificSort('total_games',a,b);
}

export function totalWinsPercentsSort(a,b){
    return specificSort('total_win_percents',a,b);
}

export function totalKnockoutsSort(a,b){
    return specificSort('total_knockouts',a,b);
}
export function totalSufferedKnockoutsSort(a,b){
    return specificSort('total_suffered_knockouts',a,b);
}

export function currentWinStreakSort(a,b){
    return specificSort('win_streak',a,b);
}

export function currentLoseStreakSort(a,b){
    return specificSort('lose_streak',a,b);
}

export function maxLoseStreakSort(a,b){
    return specificSort('max_lose_streak',a,b);
}

export function maxWinStreakSort(a,b){
    return specificSort('max_win_streak',a,b);
}

export function totalDiffSort(a,b){
    return specificSort('total_diff',a,b);
}

export function totalDiffPerGameSort(a,b){
    return specificSort('total_diff_per_game',a,b);
}

export function _2kRatingSort(a,b){
    return specificSort('_2k_rating',a,b);
}

export function totalHomeGames(a,b){
    return specificSort('total_home_games',a,b);
}

export function totalAwayGames(a,b){
    return specificSort('total_away_games',a,b);
}

export function totalScored(a,b){
    return specificSort('total_scored',a,b);
}

export function totalSuffered(a,b){
    return specificSort('total_suffered',a,b);
}

export function average2kRatingSort(a,b){
    return specificSort('avg_2k_rating',a,b);
}

export function totalWinsSort(a,b){
    return specificSort('total_wins',a,b);
}

export function totalOTWinsSort(a,b){
    return specificSort('total_ot_wins',a,b);
}

export function totalOTLostSort(a,b){
    return specificSort('total_ot_lost',a,b);
}

export function totalOTWinsPercentSort(a,b){
    function getPercent({ total_ot_wins, total_ot_lost }) {
        return calcPercents(total_ot_wins, total_ot_wins + total_ot_lost);
    }
    return specificSort('percent',{ "percent": getPercent(a) }, { "percent": getPercent(b) });
}

export function totalGamesWithOTSort(a, b){
    function getTotal({ total_ot_wins, total_ot_lost }) {
        return total_ot_wins + total_ot_lost;
    }
    return specificSort('total',{ "total": getTotal(a) }, { "total": getTotal(b) });
}

export function totalFinalsPercentsSort(a, b) {
    function getPercents(settings){
        calcPercents(settings['total_finals_appearances'], settings['total_tournaments']);
    }

    return specificSort('total', { "total": getPercents(a) }, { "total": getPercents(b) });
}

export function totalLostSort(a,b){
    return specificSort('total_lost',a,b);
}

export function WPSort(a,b){
    return specificSort('WP',a,b);
}

export function GPSort(a,b){
    return specificSort('GP',a,b);
}