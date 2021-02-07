import React from 'react';

import LoadingPage from "../../pages/LoadingPage";
import {LOADER_DETAILS} from "../../helpers/consts";

const SERVER = "http://localhost:3001";

export default {
    title: 'Storybook/pages/LoadingPage',
    component: LoadingPage,
    argTypes: {
        loaderDetails: { control: "object" },
        title: { control: "text" },
        message: { control: "text" },
    },
};

const Template = (args) => <LoadingPage {...args} />;

export const Basic = Template.bind({});
Basic.args = {
};

export const NonWhiteBackgroundColor = Template.bind({});
NonWhiteBackgroundColor.args = {
    loaderDetails: {
        loader: SERVER + '/loaders/loading.gif',
        backgroundColor: '#F0F0F0',
        top: '-100px',
    }
};

export const CustomTitleAndMessage = Template.bind({});
CustomTitleAndMessage.args = {
    loaderDetails: {
        loader: SERVER + '/loaders/Curry.gif',
        backgroundColor: 'white',
        top: '0px',
    },
    title: 'This is the title',
    message: 'This is the message'
};

export const RandomLoader = Template.bind({});
RandomLoader.args = {
    loaderDetails: LOADER_DETAILS(),
    title: 'This is the title',
    message: 'This is the message'
};