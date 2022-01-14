import React from 'react';

import PlayerDetails from "@components/internal/PlayerDetails";

export default {
    title: 'Storybook/components/internal/PlayerDetails',
    component: PlayerDetails,
    argTypes: {

    },
};

const Template = (args) => <PlayerDetails {...args} />;

export const BasicDetails = Template.bind({});
BasicDetails.args = {
    details:{
        _2k_rating: '95',
        height_meters: 1.9,
        percents: '43.43%',
        weight_kgs: '83.9'
    },
    wrapper: true,
};

export const DetailsAndStats = Template.bind({});
DetailsAndStats.args = {
    details:{
        _2k_rating: '95',
        height_meters: 1.9,
        percents: '43.43%',
        weight_kgs: '83.9'
    },
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
        total_suffered_knockouts: 3,
    },
    wrapper:true
};

export const ShowMore = Template.bind({});
ShowMore.args = {
    details:{
        _2k_rating: '95',
        height_meters: 1.9,
        percents: '43.43%',
        weight_kgs: '83.9'
    },
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
    wrapper:true
};

export const Highlighted = Template.bind({});
Highlighted.args = {
    details:{
        _2k_rating: '95',
        height_meters: 1.9,
        percents: '43.43%',
        weight_kgs: '83.9'
    },
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
        win_streak: 2,

        highlights: ["Total Home Games"],
    },
    wrapper:true
};

export const CustomDetails = Template.bind({});
CustomDetails.args = {
    custom_details_title: '<b>This is a custom bold Title</b>',
    custom_details: ['<span>a list of something:</span>','<ul><li>1</li><li>2</li></ul>','<span>And a footer</span>'],
    wrapper:true
};

export const CustomDetailsTeam = Template.bind({});
CustomDetailsTeam.args = {
    custom_details_title: "<div style='border-top:1px solid #eaeaea; width:100%; margin: 10px 0px; padding-top: 10px;'>Players:</div>",
    custom_details: [
        "<div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201142.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Kevin Durant <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 96</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201935.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>James Harden <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 95</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/202681.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Kyrie Irving <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 92</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/203915.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Spencer Dinwiddie <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 83</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/203925.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Joe Harris <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 79</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201599.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>DeAndre Jordan <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 79</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1628971.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Bruce Brown <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 76</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201145.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Jeff Green <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 76</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629651.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Nicolas Claxton <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 73</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1627789.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Timothe Luwawu-Cabarrot <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 72</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629617.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Reggie Perry <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 72</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629185.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Chris Chiozza <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 72</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/204020.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Tyler Johnson <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 72</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/202697.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Iman Shumpert <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 72</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/203658.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Norvel Pelle <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 71</span></span>\n                        </div><div>\n                            <img class=\"ui avatar image\" src=https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629013.png onError=\"this.src='/nopic.png';\" style=\"width: 39px;\" />\n                            <span>Landry Shamet <span style='opacity:0.6; display:block; padding-left: 45px;top: -8px;position: relative;'>2K Rating: 71</span></span>\n                        </div>"
    ],
    wrapper:true
};

// custom details + custom details title