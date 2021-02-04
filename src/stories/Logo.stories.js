import React from 'react';

import Logo from '../components/shared/Logo';

export default {
    title: 'components/shared/Logo',
    component: Logo,
    argTypes: {
        maxWidth: { control: 'number' },
    },
};

const Template = (args) => <Logo {...args} />;

export const Basic = Template.bind({});
Basic.args = {};

export const smallerWidth = Template.bind({});
smallerWidth.args = {
    maxWidth: "200px"
};