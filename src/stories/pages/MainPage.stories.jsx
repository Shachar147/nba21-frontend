import React from 'react';

import MainPage from "../../pages/MainPage";

export default {
    title: 'Storybook/pages/MainPage',
    component: MainPage,
    argTypes: {
    },
};

const Template = (args) => <MainPage {...args} />;

export const Basic = Template.bind({});
Basic.args = {
};