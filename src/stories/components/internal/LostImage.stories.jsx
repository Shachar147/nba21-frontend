import React from 'react';

import LostImage from '../../../components/internal/LostImage';

export default {
    title: 'Storybook/components/internal/LostImage',
    component: LostImage,
    argTypes: {
        show: { control: 'boolean' },
        style: { control: 'object' },
        alt: { control: 'text' },
        className: { control: 'text' },
    },
};

const Template = (args) => <LostImage {...args} />;

export const Basic = Template.bind({});
Basic.args = {
};

export const Hidden = Template.bind({});
Hidden.args = {
    show: false,
};

export const Styled = Template.bind({});
Styled.args = {
    style:{ position: "absolute", zIndex: 999, width:"450px", filter: "invert(100%)" },
    onClick: () => { alert('Here!') },
};

export const DifferentAlt = Template.bind({});
DifferentAlt.args = {
    alt: 'Hover me! I have a custom alt!'
};
