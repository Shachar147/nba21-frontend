import React from 'react';

import TextInput from '@components/inputs/TextInput';

export default {
    title: 'Storybook/components/inputs/TextInput',
    component: TextInput,
    argTypes: {
        disabled: { control: 'boolean' },
        type: { control: "text" },
        name: { control: "text" },
        icon: { control: "text" },
        placeholder: { control: "text" },
        error: { control: 'boolean' },
        value: { control: "text" },
        onChange: { control: "function" },
        onKeyDown: { control: "function" },
    },
};

const Template = (args) => <TextInput {...args} />;

export const Basic = Template.bind({});
Basic.args = {
};

export const UsernameInput = Template.bind({});
UsernameInput.args = {
    name: "username",
    type: "text",
    icon: "user",
    disabled: false,
    placeholder: "Please Enter Username...",
    error: false,
};

export const PasswordInput = Template.bind({});
PasswordInput.args = {
    name: "password",
    placeholder: "Please Enter Password...",
    icon: "lock",
    type: "password",
};

export const onChange = Template.bind({});
onChange.args = {
    onChange: (e) => { alert(`Change to: ${e.target.value} `) }
};

export const onKeyDown = Template.bind({});
onKeyDown.args = {
    onKeyDown: (e) => { alert(`Key Down! Current value: ${e.target.value} `) }
};