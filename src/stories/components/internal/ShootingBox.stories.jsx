import React from 'react';

import ShootingBox from '../../../components/internal/ShootingBox';

export default {
    title: 'Storybook/components/internal/ShootingBox',
    component: ShootingBox,
    argTypes: {
        show: { control: 'boolean' },
        is_winner: { control: 'boolean' },
        is_loser: { control: 'boolean' },
        round_length: { control: 'number' },
        singleShot: { control: 'number' },
        onScore: { control: 'func' },
        onChange: { control: 'function' },
        wrapper: { control: 'boolean' },
    },
};

const Template = (args) => <ShootingBox {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    show: true,
};

export const Wrapped = Template.bind({});
Wrapped.args = {
    show: true,
    wrapper: true
};

export const Range = Template.bind({});
Range.args = {
    show: true,
    wrapper: true,
    round_length: 5,
};

export const Hidden = Template.bind({});
Hidden.args = {
    show: false,
};

export const OnScore = Template.bind({});
OnScore.args = {
    show: true,
    round_length: 5,
    wrapper: true,
    onScore: () => { alert('Here!') },
};

export const SingleShot = Template.bind({});
SingleShot.args = {
    singleShot: 0,
    wrapper: true,
    onChange: (e) => { alert(`value is ${e.target.value}`) }
};

export const Winner = Template.bind({});
Winner.args = {
    is_winner: true,
    wrapper: true,
};

export const Loser = Template.bind({});
Loser.args = {
    is_loser: true,
    wrapper: true,
};

export const WinnerSingleShot = Template.bind({});
WinnerSingleShot.args = {
    is_winner: true,
    singleShot: 0,
    wrapper: true,
    onChange: (e) => { alert(`value is ${e.target.value}`) }
};

export const LoserSingleShot = Template.bind({});
LoserSingleShot.args = {
    is_loser: true,
    singleShot: 0,
    wrapper: true,
    onChange: (e) => { alert(`value is ${e.target.value}`) }
};
