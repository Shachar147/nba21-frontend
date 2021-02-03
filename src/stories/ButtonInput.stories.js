import React from 'react';

import ButtonInput from '../components/shared/ButtonInput';

export default {
    title: 'Components/ButtonInput',
    component: ButtonInput,
    argTypes: {
        text: { control: 'text' },
        style: { control: 'object' },
        onClick: { control: 'function' },
        disabled: { control: 'boolean' },
    },
};

const Template = (args) => <ButtonInput {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    text: 'Basic'
};

export const Disabled = Template.bind({});
Disabled.args = {
    text: 'Disabled',
    disabled: true,
};

export const Clickable = Template.bind({});
Clickable.args = {
    text: 'Alert onClick',
    onClick: () => { alert('Here!') },
};

export const Styled = Template.bind({});
Styled.args = {
    text: 'Styled',
    style: { fontSize: "30px", fontWeight:"bold" },
};
