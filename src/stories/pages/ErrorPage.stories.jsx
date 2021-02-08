import React from 'react';

import ErrorPage from "../../pages/ErrorPage";
import {UNAUTHORIZED_ERROR} from "../../helpers/consts";

const SERVER = "http://localhost:3001";

export default {
    title: 'Storybook/pages/ErrorPage',
    component: ErrorPage,
    argTypes: {
        title: { control: "text" },
        message: { control: "text" },
    },
};

const Template = (args) => <ErrorPage {...args} />;

export const Basic = Template.bind({});
Basic.args = {
};

export const CustomTitle = Template.bind({});
CustomTitle.args = {
    title: 'This is a cusom error title'
};

export const CustomMessage = Template.bind({});
CustomMessage.args = {
    message: 'This is a custom message'
};

// export const UnauthorizedMessage = Template.bind({});
// UnauthorizedMessage.args = {
//     message: UNAUTHORIZED_ERROR
// };