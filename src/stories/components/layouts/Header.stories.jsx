import React from 'react';

import Header from '../../../components/layouts/Header';

export default {
    title: 'Storybook/components/layout components/Header',
    component: Header,
    argTypes: {
        nologo: { control: 'boolean' },
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