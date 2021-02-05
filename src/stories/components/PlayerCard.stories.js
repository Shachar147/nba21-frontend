import React from 'react';

import PlayerCard from "../../components/PlayerCard";
import {ICE_COLD_THRESHOLD, ON_FIRE_THRESHOLD} from "../../helpers/consts";

const SERVER = "http://localhost:3001";

export default {
    title: '/components/PlayerCard',
    component: PlayerCard,
    argTypes: {

    },
};

const Template = (args) => <PlayerCard {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    name:"Stephen Curry",
    picture: SERVER + "/stories/stephen.curry.png",
    wrapper: true,
};

export const OnFire = Template.bind({});
OnFire.args = {
    name:"Stephen Curry",
    picture: SERVER + "/stories/stephen.curry.png",
    wrapper: true,
    stats: {
        win_streak: ON_FIRE_THRESHOLD,
        max_win_streak: ON_FIRE_THRESHOLD,
        lose_streak: 0,
        max_lose_streak: 0,
    }
};

export const IceCold = Template.bind({});
IceCold.args = {
    name:"Stephen Curry",
    picture: SERVER + "/stories/stephen.curry.png",
    wrapper: true,
    stats: {
        win_streak: 0,
        max_win_streak: 0,
        lose_streak: ICE_COLD_THRESHOLD,
        max_lose_streak: ICE_COLD_THRESHOLD,
    }
};

export const fallbackPicture = Template.bind({});
fallbackPicture.args = {
    name:"Stephen Curry",
    picture:"broken link",
    wrapper: true,
};

export const unknownPlayer = Template.bind({});
unknownPlayer.args = {
    name:"Unknown Player",
    picture:"broken link",
    wrapper: true,
};

export const fullStats = Template.bind({});
fullStats.args = {
    name:"Stephen Curry",
    picture: SERVER + "/stories/stephen.curry.png",
    wrapper: true,
    position: "Guard",
    debut_year: 2009,
    details: {
        _2k_rating: 95,
        height_meters: 1.9,
        weight_kgs: 83.9,
        percents: "43.43%",
        team: "Golden State Warriors",
    },
    stats: {
        win_streak: Math.floor(Math.random() * 5) + 1,
        max_win_streak: Math.floor(Math.random() * 10) + 5,
        lose_streak: 0,
        max_lose_streak: 0,
        total_win_percents: '80.00%',
        total_games: 100,
        total_wins: 80,
        total_lost: 20,
        total_diff: 250,
        total_diff_per_game: 2.5,
        total_away_games: 50,
        total_home_games: 50,
        total_knockouts: 25,
        avg_opponent_2k_rating: 95,
        total_scored: 1250,
        total_suffered:1000,
        total_suffered_knockouts: 3,
    }
};


// todo complete:
// shoot example
// single shoot example
// winner example
// loser example
// onClick, onchange etc events examples
// move styles to a hash too.