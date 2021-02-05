import React from 'react';

import PlayerCard from "../../components/PlayerCard";
import {ICE_COLD_THRESHOLD, ON_FIRE_THRESHOLD, TEAM1_COLOR} from "../../helpers/consts";

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
    onReplace: undefined,
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
    },
    onReplace: undefined,
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
    },
    onReplace: undefined,
};

export const fallbackPicture = Template.bind({});
fallbackPicture.args = {
    name:"Stephen Curry",
    picture:"broken link",
    onReplace: undefined,
    wrapper: true,
};

export const unknownPlayer = Template.bind({});
unknownPlayer.args = {
    name:"Unknown Player",
    picture:"broken link",
    onReplace: undefined,
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
    },
    onReplace: undefined,
};

export const ScoredFromShot = Template.bind({});
const example_round_length = 5;
ScoredFromShot.args = {
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
    shoot: true,
    round_length: example_round_length,
    onScore: (value) => { alert(`Player scored ${value}/${example_round_length}`) },
    onReplace: undefined,
};

export const SingleShot = Template.bind({});
SingleShot.args = {
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
    singleShot: 8,
    onChange: (e) => { alert(`Current Score Value: ${e.target.value}`) },
    onReplace: undefined,
};

export const Replace = Template.bind({});
Replace.args = {
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
    singleShot: 8,
    onChange: (e) => { alert(`Current Score Value: ${e.target.value}`) },
    onReplace: (e) => { alert("Randomly Get a Different Player"); },
    onSpecificReplace: undefined,
};

export const SpecificReplace = Template.bind({});
SpecificReplace.args = {
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
    singleShot: 8,
    onChange: (e) => { alert(`Current Score Value: ${e.target.value}`) },
    onReplace: () => { alert("Click on Specific Replace!"); },
    onSpecificReplace: (new_player) => { alert("New Player is: " + new_player.name) },
    all_players: [{"id":233,"name":"LeBron James", "picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/2544.png", "position":"Forward","heightfeet":6,"heightmeters":2.06,"heightinches":9,"weightpounds":250, "weightkgs":113.4,"jersey":23,"debutyear":2003, "2krating":97,"team":{"id":14,"name":"Los Angeles Lakers", "logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/lal.png", "division":"PACIFIC","conference":"WEST"}}, {"id":184,"name":"James Harden", "picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201935.png", "position":"Guard","heightfeet":6,"heightmeters":1.96,"heightinches":5,"weightpounds":220, "weightkgs":99.8,"jersey":13,"debutyear":2009,"2krating":95, "team":{"id":3,"name":"Brooklyn Nets", "logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/bkn.png","division":"ATLANTIC", "conference":"EAST"}}, {"id":109,"name":"Stephen Curry", "picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201939.png", "position":"Guard","heightfeet":6,"heightmeters":1.9,"heightinches":3,"weightpounds":185,"weight_kgs":83.9, "jersey":30,"debutyear":2009,"2k_rating":95, "team":{"id":10,"name":"Golden State Warriors", "logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/gsw.png", "division":"PACIFIC","conference":"WEST"}}],
};

export const OnClick = Template.bind({});
OnClick.args = {
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
    onReplace: undefined,
    onClick: (e) => { alert(`This player was selected! do something with this information.`) }
};

export const Styled = Template.bind({});
Styled.args = {
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
    onReplace: undefined,
    style: {"border": "1px solid " + TEAM1_COLOR, opacity: 1},
};

export const Winner = Template.bind({});
Winner.args = {
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
    onReplace: undefined,
    shoot: false,
    round_length: 3,
    rounds: [3,3,3],
    winner: true,
};

export const Loser = Template.bind({});
Loser.args = {
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
    onReplace: undefined,
    shoot: false,
    round_length: 3,
    rounds: [0,1,0],
    lost: true,
};