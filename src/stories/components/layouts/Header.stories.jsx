import React from 'react';

import Header from '../../../components/layouts/Header';

export default {
    title: '/components/layout components/Header',
    component: Header,
    argTypes: {
        nologo: { control: 'bool' },
    },
};

const Template = (args) => <Header {...args} />;

export const Basic = Template.bind({});
Basic.args = {
};

export const noLogo = Template.bind({});
noLogo.args = {
    nologo: true
};