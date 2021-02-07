import React from 'react';

import PlayerContent from "../../../components/internal/PlayerContent";

export default {
    title: 'Storybook/components/internal/PlayerContent',
    component: PlayerContent,
    argTypes: {

    },
};

const Template = (args) => <PlayerContent {...args} />;

export const Basic = Template.bind({});
Basic.args = {

};

export const Details = Template.bind({});
Details.args = {
    details:{
        _2k_rating: '95',
        height_meters: 1.9,
        percents: '43.43%',
        team: 'Golden State Warriors',
        weight_kgs: '83.9'
    },
    name:"Kyrie Irving",
    round_length:5,
    rounds:['3','2','3'],
    singleShot:5,
    stats:{
        avg_opponent_2k_rating: 95,
        lose_streak: 0,
        max_lose_streak: 0,
        max_win_streak: 12,
        total_away_games: 50,
        total_diff: 250,
        total_diff_per_game: 2.5,
        total_games: 100,
        total_home_games: 50,
        total_knockouts: 25,
        total_lost: 20,
        total_scored: 1250,
        total_suffered: 1000,
        total_suffered_knockouts: 3,
        total_win_percents: '80.00%',
        total_wins: 80,
        win_streak: 2
    },
    team:"Brooklyn Nets",
    wrapper:true
};