import React from 'react';

import DropdownInput from '@components/inputs/DropdownInput';

export default {
    title: 'Storybook/components/inputs/DropdownInput',
    component: DropdownInput,
    argTypes: {
        placeholder: { control: 'text' },
        options: { control: 'object' },
        nameKey: { control: 'text' },
        valueKey: { control: 'text' },
        sort: { control: 'select', options: ['asc','desc'] },
        sortKey: { control: 'text' },
        idKey: { control: 'text' },
        label: { control: 'text' },
        width: { control: 'number' },
        onChange: { control: 'func' },
    },
};

const Template = (args) => <DropdownInput {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    options: [{"id":"1","name":"Option1","value":"1"},{"id":"2","name":'Option2',"value":"2"}],
    nameKey: "name",
    idKey: "id",
    valueKey: "value",
};

export const Placeholder = Template.bind({});
Placeholder.args = {
    placeholder: "Select Options..."
};

export const PlaceholderAndOptions = Template.bind({});
PlaceholderAndOptions.args = {
    placeholder: "Select Options...",
    options: [{"id":"1","name":"Option1","value":"1"},{"id":"2","name":'Option2',"value":"2"}],
    nameKey: "name",
    idKey: "id",
    valueKey: "value",
};

export const Labeled = Template.bind({});
Labeled.args = {
    label: "Please Select an Option:",
    width: "200px",
    options: [{"id":"1","name":"Option1","value":"1"},{"id":"2","name":'Option2',"value":"2"}],
    nameKey: "name",
    idKey: "id",
    valueKey: "value",
};

export const onChange = Template.bind({});
onChange.args = {
    label: "Please Select an Option:",
    width: "200px",
    options: [{"id":"1","name":"Option1","value":"1"},{"id":"2","name":'Option2',"value":"2"}],
    nameKey: "name",
    idKey: "id",
    valueKey: "value",
    onChange: (option) => { alert(`You chose ${JSON.stringify(option)}!`) },
};