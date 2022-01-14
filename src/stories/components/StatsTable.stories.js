import React from 'react';

import StatsTable from "@components/StatsTable";

export default {
    title: 'Storybook/components/StatsTable',
    component: StatsTable,
    argTypes: {

    },
};

const Template = (args) => <StatsTable {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    title: 'One on One Stats',
    description: 'Total Games Today: 0 | Total Points Today: 0 | Total Games: 12 | Total Points: 147',
    cols: ["","Days with most games","Days with most points"],
    stats: {"#1":["29/01/2021 - 12", "29/01/2021 - 147"], "#2":["30/01/2021 - 11", "28/01/2021 - 140"], "#3":["01/02/2021 - 9", "28/01/2021 - 106"]}
};

export const HiddenTable = Template.bind({});
HiddenTable.args = {
    title: "Previous Matchups Stats",
    marginTop: "10px",
    description: "This is the first time these players meet each other.",
    hidden: true,
};
