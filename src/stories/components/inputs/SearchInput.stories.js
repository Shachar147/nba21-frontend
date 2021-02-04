import React from 'react';

import SearchInput from '../../../components/inputs/SearchInput';

export default {
    title: '/components/inputs/SearchInput',
    component: SearchInput,
    argTypes: {
        onKeyUp: { control: 'function' },
    },
};

const Template = (args) => <SearchInput {...args} />;

export const Basic = Template.bind({});
Basic.args = {
};

export const onKeyUp = Template.bind({});
onKeyUp.args = {
    onKeyUp: (e) => { alert(`Search for: ${e.target.value} `) }
};