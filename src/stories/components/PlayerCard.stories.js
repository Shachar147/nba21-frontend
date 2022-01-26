import React from 'react';

import PlayerCard from "@components/PlayerCard";
import {ICE_COLD_THRESHOLD, ON_FIRE_THRESHOLD, TEAM1_COLOR} from "@helpers/consts";

const SERVER = "http://localhost:3001";

export default {
    title: 'Storybook/components/PlayerCard',
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

export const AllPlayers = Template.bind({});
const allPlayers = JSON.parse('[{"id":363,"name":"Ja Morant","picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629630.png","position":"Guard","height_feet":6,"height_meters":1.9,"height_inches":3,"weight_pounds":174,"weight_kgs":78.9,"jersey":12,"debut_year":2019,"_2k_rating":null,"lastSyncAt":"2022-01-25T23:30:00.521Z","last2KSyncAt":null,"draft_pick":2,"date_of_birth":"1999-08-10","college_name":"Murray State","country":"USA","draft_round":1,"isActive":true,"team":{"id":15,"name":"Memphis Grizzlies","logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/mem.png","division":"SOUTHWEST","conference":"WEST","lastSyncAt":"2022-01-25T23:29:55.407Z","_2k_rating":null,"last2KSyncAt":null},"allStarTeam":null},{"id":351,"name":"Khris Middleton","picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/203114.png","position":"Forward","height_feet":6,"height_meters":2.01,"height_inches":7,"weight_pounds":222,"weight_kgs":100.7,"jersey":22,"debut_year":2012,"_2k_rating":null,"lastSyncAt":"2022-01-25T23:30:00.368Z","last2KSyncAt":null,"draft_pick":39,"date_of_birth":"1991-08-12","college_name":"Texas A&M","country":"USA","draft_round":2,"isActive":true,"team":{"id":17,"name":"Milwaukee Bucks","logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/mil.png","division":"CENTRAL","conference":"EAST","lastSyncAt":"2022-01-25T23:29:55.422Z","_2k_rating":null,"last2KSyncAt":null},"allStarTeam":null},{"id":530,"name":"John Wall","picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/202322.png","position":"Guard","height_feet":6,"height_meters":1.9,"height_inches":3,"weight_pounds":210,"weight_kgs":95.3,"jersey":1,"debut_year":2010,"_2k_rating":null,"lastSyncAt":"2022-01-25T23:30:02.589Z","last2KSyncAt":null,"draft_pick":1,"date_of_birth":"1990-09-06","college_name":"Kentucky","country":"USA","draft_round":1,"isActive":true,"team":{"id":11,"name":"Houston Rockets","logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/hou.png","division":"SOUTHWEST","conference":"WEST","lastSyncAt":"2022-01-25T23:29:55.376Z","_2k_rating":null,"last2KSyncAt":null},"allStarTeam":null},{"id":135,"name":"Luka Doncic","picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629029.png","position":"Forward/Guard","height_feet":6,"height_meters":2.01,"height_inches":7,"weight_pounds":230,"weight_kgs":104.3,"jersey":77,"debut_year":2018,"_2k_rating":null,"lastSyncAt":"2022-01-25T23:29:57.853Z","last2KSyncAt":null,"draft_pick":3,"date_of_birth":"1999-02-28","college_name":"Real Madrid","country":"Slovenia","draft_round":1,"isActive":true,"team":{"id":7,"name":"Dallas Mavericks","logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/dal.png","division":"SOUTHWEST","conference":"WEST","lastSyncAt":"2022-01-25T23:29:55.343Z","_2k_rating":null,"last2KSyncAt":null},"allStarTeam":{"id":31,"name":"Team LeBron","logo":"/team-lebron.png","division":"ALLSTAR","conference":"WEST","lastSyncAt":"2022-01-25T23:29:55.526Z","_2k_rating":null,"last2KSyncAt":null}},{"id":230,"name":"Jrue Holiday","picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201950.png","position":"Guard","height_feet":6,"height_meters":1.9,"height_inches":3,"weight_pounds":205,"weight_kgs":93,"jersey":21,"debut_year":2009,"_2k_rating":null,"lastSyncAt":"2022-01-25T23:29:58.893Z","last2KSyncAt":null,"draft_pick":17,"date_of_birth":"1990-06-12","college_name":"UCLA","country":"USA","draft_round":1,"isActive":true,"team":{"id":17,"name":"Milwaukee Bucks","logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/mil.png","division":"CENTRAL","conference":"EAST","lastSyncAt":"2022-01-25T23:29:55.422Z","_2k_rating":null,"last2KSyncAt":null},"allStarTeam":null},{"id":16,"name":"OG Anunoby","picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1628384.png","position":"Forward","height_feet":6,"height_meters":2.01,"height_inches":7,"weight_pounds":232,"weight_kgs":105.2,"jersey":3,"debut_year":2017,"_2k_rating":null,"lastSyncAt":"2022-01-25T23:29:56.284Z","last2KSyncAt":null,"draft_pick":23,"date_of_birth":"1997-07-17","college_name":"Indiana","country":"United Kingdom","draft_round":1,"isActive":true,"team":{"id":28,"name":"Toronto Raptors","logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/tor.png","division":"ATLANTIC","conference":"EAST","lastSyncAt":"2022-01-25T23:29:55.503Z","_2k_rating":null,"last2KSyncAt":null},"allStarTeam":null},{"id":397,"name":"Victor Oladipo","picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/203506.png","position":"Guard","height_feet":6,"height_meters":1.93,"height_inches":4,"weight_pounds":213,"weight_kgs":96.6,"jersey":4,"debut_year":2013,"_2k_rating":null,"lastSyncAt":"2022-01-25T23:30:00.968Z","last2KSyncAt":null,"draft_pick":2,"date_of_birth":"1992-05-04","college_name":"Indiana","country":"USA","draft_round":1,"isActive":true,"team":{"id":16,"name":"Miami Heat","logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/mia.png","division":"SOUTHEAST","conference":"EAST","lastSyncAt":"2022-01-25T23:29:55.414Z","_2k_rating":null,"last2KSyncAt":null},"allStarTeam":null},{"id":50,"name":"Eric Bledsoe","picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/202339.png","position":"Guard","height_feet":6,"height_meters":1.85,"height_inches":1,"weight_pounds":214,"weight_kgs":97.1,"jersey":12,"debut_year":2010,"_2k_rating":null,"lastSyncAt":"2022-01-25T23:29:56.750Z","last2KSyncAt":null,"draft_pick":18,"date_of_birth":"1989-12-09","college_name":"Kentucky","country":"USA","draft_round":1,"isActive":true,"team":{"id":13,"name":"LA Clippers","logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/lac.png","division":"PACIFIC","conference":"WEST","lastSyncAt":"2022-01-25T23:29:55.392Z","_2k_rating":null,"last2KSyncAt":null},"allStarTeam":null},{"id":146,"name":"Kevin Durant","picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201142.png","position":"Forward","height_feet":6,"height_meters":2.08,"height_inches":10,"weight_pounds":240,"weight_kgs":108.9,"jersey":7,"debut_year":2007,"_2k_rating":96,"lastSyncAt":"2022-01-25T23:29:57.978Z","last2KSyncAt":"2022-01-25T21:30:23.612Z","draft_pick":2,"date_of_birth":"1988-09-29","college_name":"Texas-Austin","country":"USA","draft_round":1,"isActive":true,"team":{"id":3,"name":"Brooklyn Nets","logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/bkn.png","division":"ATLANTIC","conference":"EAST","lastSyncAt":"2022-01-25T23:29:55.309Z","_2k_rating":82,"last2KSyncAt":"2022-01-02T13:26:07.662Z"},"allStarTeam":{"id":32,"name":"Team Durant","logo":"/team-durant.png","division":"ALLSTAR","conference":"EAST","lastSyncAt":"2022-01-25T23:29:55.534Z","_2k_rating":null,"last2KSyncAt":null}},{"id":251,"name":"Kyrie Irving","picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/202681.png","position":"Guard","height_feet":6,"height_meters":1.88,"height_inches":2,"weight_pounds":195,"weight_kgs":88.5,"jersey":11,"debut_year":2011,"_2k_rating":91,"lastSyncAt":"2022-01-25T23:29:59.153Z","last2KSyncAt":"2022-01-25T21:30:23.612Z","draft_pick":1,"date_of_birth":"1992-03-23","college_name":"Duke","country":"Australia","draft_round":1,"isActive":true,"team":{"id":3,"name":"Brooklyn Nets","logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/bkn.png","division":"ATLANTIC","conference":"EAST","lastSyncAt":"2022-01-25T23:29:55.309Z","_2k_rating":82,"last2KSyncAt":"2022-01-02T13:26:07.662Z"},"allStarTeam":{"id":32,"name":"Team Durant","logo":"/team-durant.png","division":"ALLSTAR","conference":"EAST","lastSyncAt":"2022-01-25T23:29:55.534Z","_2k_rating":null,"last2KSyncAt":null}}]');
AllPlayers.args = {
    name:"Ja Morant",
    picture: "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629630.png",
    wrapper: true,
    position: "Guard",
    details: {
        height_meters: 1.9,
        team: "Memphis Grizzlies",
    },
    all_players: allPlayers,
    curr_players: ['Ja Morant'],
};

export const ExtraStyled = Template.bind({});
ExtraStyled.args = {
    name:"Miami Heat",
    picture: SERVER + "/stories/miami.heat.png",
    wrapper: true,
    team_division: "SouthWest",
    custom_details:[
        "<div>\n<img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/202710.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Jimmy Butler <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 92</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1628389.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Bam Adebayo <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 89</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629639.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Tyler Herro <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 82</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201609.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Goran Dragic <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 81</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629130.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Duncan Robinson <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 78</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1630173.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Precious Achiuwa <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 76</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/202340.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Avery Bradley <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 76</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/203086.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Meyers Leonard <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 75</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/203482.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Kelly Olynyk <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 75</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/2738.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Andre Iguodala <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 74</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629134.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Kendrick Nunn <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 74</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/203090.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Maurice Harkless <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 72</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629735.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Chris Silva <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 72</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629644.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>KZ Okpala <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 71</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/2617.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Udonis Haslem <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 70</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629622.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Max Strus <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 69</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629216.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Gabe Vincent <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 67</span></span>\n</div>"
    ],
    custom_details_title: '<div style="border-top:1px solid #eaeaea; width:100%; margin: 10px 0px; padding-top: 10px;">List of Players:</div>',
    singleShot: 0,
    place: 1,
    styles:{
        descriptionStyle: { minHeight: "290px" },
        imageContainerStyle: { backgroundColor: "#F2F2F2" },
        imageStyle: { width: 200, margin: "auto", padding: "20px" },
        extraContentStyle: { display: "none" },
        placeRibbon: 'blue',
    },
    onReplace: undefined,
};