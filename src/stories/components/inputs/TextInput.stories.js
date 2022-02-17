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
        inputStyle: { control: 'object' },
        containerStyle: { control: 'object' },
        labelStyle: { control: 'object' },
    },
};

const Template = (args) => <TextInput {...args} />;

export const Basic = Template.bind({});
Basic.args = {
};



export const UsernameIconInput = Template.bind({});
UsernameIconInput.args = {
    name: "username",
    type: "text",
    icon: "user",
    disabled: false,
    placeholder: "Please Enter Username...",
    error: false,
};

export const PasswordIconInput = Template.bind({});
PasswordIconInput.args = {
    name: "password",
    placeholder: "Please Enter Password...",
    icon: "lock",
    type: "password",
};

export const LabeledInput = Template.bind({});
LabeledInput.args = {
    name: "number",
    label: "Please Choose a number:",
    type: "number",
    value: 0,
    onChange: (e) => { alert(e.target.value); },
    inputStyle:{
        width: "90px",
    }
};

export const onChange = Template.bind({});
onChange.args = {
    onChange: (e) => { alert(`Change to: ${e.target.value} `) }
};

export const onKeyDown = Template.bind({});
onKeyDown.args = {
    onKeyDown: (e) => { alert(`Key Down! Pressed Key: ${e.keyCode}, Current value: ${e.target.value} `) }
};