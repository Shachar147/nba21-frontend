import React from 'react';

import Card from "../../components/Card";

const SERVER = "http://localhost:3001";

export default {
    title: '/components/Card',
    component: Card,
    argTypes: {
        picture: { control: "text" },
        className: { control: "text" },
        name: { control: "text" },
        style: { control: "object" },
        disabled: { control: 'boolean' },
        wrapper: { control: 'boolean' },
        href: { control: "text" },
        disabledAltAddition: { control: "text" },
    },
};

const Template = (args) => <Card {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    name:"Three Points Contest",
    picture: SERVER + "/thumbnails/3pointsContest.png",
    style:{ width: "160px" },
    href:"/three-points",
    wrapper: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
    name:"Allstar Weekend",
    picture: SERVER + "/thumbnails/allstar.png",
    style:{ width: "160px" },
    disabled: true,
    disabledAltAddition: "(Not Implemented Yet)",
    wrapper: true,
};