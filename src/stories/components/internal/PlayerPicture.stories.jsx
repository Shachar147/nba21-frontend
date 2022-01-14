import React from 'react';

import PlayerPicture from '@components/internal/PlayerPicture';

export default {
    title: 'Storybook/components/internal/PlayerPicture',
    component: PlayerPicture,
    argTypes: {
        name: { control: 'text' },
        picture: { control: 'text' },
        place: { control: 'text' },
        styles: { control: 'object' },
    },
};

const Template = (args) => <PlayerPicture {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    name: 'Stephen Curry',
    picture: '/stories/stephen.curry.png'
};

export const Wrapped = Template.bind({});
Wrapped.args = {
    name: 'Stephen Curry',
    picture: '/stories/stephen.curry.png',
    wrapper: true,
};

export const Place = Template.bind({});
Place.args = {
    name: 'Stephen Curry',
    picture: '/stories/stephen.curry.png',
    place: 8,
    styles: {
        placeRibbon: "blue",
    },
    wrapper: true,
};

export const FallbackPicture = Template.bind({});
FallbackPicture.args = {
    name: 'Stephen Curry',
    picture: 'broken link',
    wrapper: true,
};

export const UnknownPlayer = Template.bind({});
UnknownPlayer.args = {
    name: 'Moshe Misheo',
    picture: 'broken link',
    wrapper: true,
};
