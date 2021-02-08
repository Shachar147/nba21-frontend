import React from 'react';

import OneOnOneManager from "../../activities/OneOnOne/OneOnOneManager";

export default {
    title: 'Storybook/activities/OneOnOneManager',
    component: OneOnOneManager,
    argTypes: {
    },
};

const Template = (args) => <OneOnOneManager {...args} />;

export const MissingOpponentsType = Template.bind({});
MissingOpponentsType.args = {
};

export const MissingGameMode = Template.bind({});
MissingGameMode.args = {
    what: 'players',
};

export const MissingGetRoute = Template.bind({});
MissingGetRoute.args = {
    what: 'players',
    game_mode: 'One on One',
};

export const Basic = Template.bind({});
Basic.args = {
    what: 'players',
    game_mode: 'One on One',
    get_route: '/player/popular'
};

export const OneOnOne = Template.bind({});
OneOnOne.args = {
    game_mode:"One on One",
    get_route:"/player/popular",
    get_stats_route:"/records/one-on-one/by-player",
    what:"players",
    save_result_route:"/records/one-on-one/",
    update_result_route:"/records/one-on-one/",
    stats_page:true,
};

export const RandomTeamGames = Template.bind({});
RandomTeamGames.args = {
    game_mode:"Random Games",
    get_route:"/team",
    get_stats_route:"",
    what:"teams",
    custom_details_title:"Players:",
    styles:{
        imageContainerStyle: { backgroundColor: "#F2F2F2" },
        imageStyle: { width: 200, margin: "auto", padding: "20px" },
        extraContentStyle: { display: "none" },
    },
    save_result_route:"",
    stats_page:false,
};
