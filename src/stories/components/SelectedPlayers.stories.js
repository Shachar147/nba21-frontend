import React from 'react';

import SelectedPlayers from "../../components/SelectedPlayers";

export default {
    title: 'Storybook/components/SelectedPlayers',
    component: SelectedPlayers,
    argTypes: {

    },
};

const Template = (args) => <SelectedPlayers {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    title:"Team One",
    onAddRandom: () => { alert("add random!"); },
    onAddComputer: () => { alert("add computer!"); },
    wrapper: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
    title:"Team Two",
    enabled: false,
    wrapper: true,
};

export const WithPlayers = Template.bind({});
WithPlayers.args = {
    title:"Team Two",
    team: [{"id":109,"name":"Stephen Curry","picture":"https:\/\/ak-static.cms.nba.com\/wp-content\/uploads\/headshots\/nba\/latest\/260x190\/201939.png","position":"Guard","height_feet":6,"height_meters":1.9,"height_inches":3,"weight_pounds":185,"weight_kgs":83.9,"jersey":30,"debut_year":2009,"_2k_rating":95,"team":{"id":10,"name":"Golden State Warriors","logo":"https:\/\/www.nba.com\/.element\/img\/1.0\/teamsites\/logos\/teamlogos_500x500\/gsw.png","division":"PACIFIC","conference":"WEST"},"3pt_percents":"43.39%","selected":0},{"name":"Random Player 1 - 1","picture":"\/nopic.png","team":{"name":"Random"}},{"name":"Computer Player 1 - 1","picture":"\/computer.png","team":{"name":"Computer"}}],
    onAddRandom: () => { alert("add random!"); },
    onAddComputer: () => { alert("add computer!"); },
    toggle: () => { alert("toggle selected player!"); },
    onClear: () => { alert("Clear all Players!"); },
    wrapper: true,
};