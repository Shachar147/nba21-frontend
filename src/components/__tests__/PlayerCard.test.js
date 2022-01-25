import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import PlayerCard from "../PlayerCard";

const defaultProps = {
    name: "Stephen Curry",
    picture: "/stories/stephen.curry.png",
    wrapper: true,
    'data-testid': "my-player-card",
}

describe('<PlayerCard /> test suite', () => {

    const setProps = (props = {}) => Object.assign({}, { ...defaultProps, ...props });

    let screen, wrapper;

    afterEach(cleanup);

    // default props
    it('Verify default props', () => {
        screen = render(<PlayerCard {...setProps()} />);

        // verify playercard exists
        expect(screen.getByTestId(defaultProps['data-testid'])).toBeInTheDocument();

        // verify wrapper exists
        wrapper = screen.queryByTestId(defaultProps['data-testid'] + '-wrapper');
        expect(wrapper).toBeInTheDocument();

        // verify image
        expect(screen.getByRole(/img/i)).toBeInTheDocument();
        expect(screen.getByRole(/img/i)).toHaveAttribute('alt',defaultProps.name);
        expect(screen.getByRole(/img/i)).toHaveAttribute('src',defaultProps.picture);

        // verify name
        expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
    });

    // wrapper
    it('Should render the given wrapper, if passed', () => {
        screen = render(<PlayerCard {...setProps({wrapper: false} )} />);
        wrapper = screen.queryByTestId(defaultProps['data-testid'] + '-wrapper');
        expect(wrapper).not.toBeInTheDocument();
        cleanup();
        screen = render(<PlayerCard {...setProps({wrapper: true} )} />);
        wrapper = screen.queryByTestId(defaultProps['data-testid'] + '-wrapper');
        expect(wrapper).toBeInTheDocument();
    });

    // name
    it('Should render the given name, if passed', () => {
        screen = render(<PlayerCard {...setProps({ name: 'Some Player' } )} />);
        expect(screen.getByText('Some Player')).toBeInTheDocument();
        expect(screen.getByRole(/img/i)).toHaveAttribute('alt','Some Player');
    });

    // picture
    it('Should render the given picture, if passed', () => {
        screen = render(<PlayerCard {...setProps({ name: 'Some Player', picture: '/logo-new.png' } )} />);
        expect(screen.getByRole(/img/i)).toBeInTheDocument();
        expect(screen.getByRole(/img/i)).toHaveAttribute('alt','Some Player');
        expect(screen.getByRole(/img/i)).toHaveAttribute('src','/logo-new.png');
    });

    // rounds
    it('Should render rounds if passed', () => {
        screen = render(<PlayerCard {...setProps({ rounds: [1,0,3,2,3] } )} />);
        expect(screen.getAllByText('0/3').length).toEqual(1);
        expect(screen.getAllByText('1/3').length).toEqual(1);
        expect(screen.getAllByText('2/3').length).toEqual(1);
        expect(screen.getAllByText('3/3').length).toEqual(2);
    });

    // shoot
    it('Should render shoot block, if shoot param passed', () => {
        screen = render(<PlayerCard {...setProps({ shoot: true, round_length: 5 } )} />);
        expect(screen.getByTestId("shooting-box")).toBeInTheDocument();
        expect(screen.getByTestId("shooting-box-score")).toBeInTheDocument();
        expect(screen.getByTestId("shooting-box-round-length")).toBeInTheDocument();
        expect(screen.getByTestId("shooting-box-go")).toBeInTheDocument();

        expect(screen.getByTestId("shooting-box-score")).toHaveAttribute("value","0");
        expect(screen.getByTestId("shooting-box-round-length")).toHaveAttribute("value","5");
        expect(screen.getByTestId("shooting-box-score")).toHaveAttribute("type","number");
        expect(screen.getByTestId("shooting-box-round-length")).toHaveAttribute("type","number");
        expect(screen.getByTestId("shooting-box-go")).toHaveAttribute("type","button");
    });

    // onScore works
    it('Executes onScore if passed when clicking on shooting box Go button', () => {
        const onScore = jest.fn();
        screen = render(<PlayerCard {...setProps({ onScore, shoot: true })} />);
        fireEvent.click(screen.getByTestId('shooting-box-go'));
        expect(onScore).toHaveBeenCalled();
    });

    // round length
    it('Round length should affect rounds total number if passed.', () => {
        screen = render(<PlayerCard {...setProps({ rounds: [1,0,3,2,3], round_length: 10 } )} />);
        expect(screen.getAllByText('0/10').length).toEqual(1);
        expect(screen.getAllByText('1/10').length).toEqual(1);
        expect(screen.getAllByText('2/10').length).toEqual(1);
        expect(screen.getAllByText('3/10').length).toEqual(2);

        cleanup();

        screen = render(<PlayerCard {...setProps({ rounds: [1,0,3,2,3], round_length: 10, shoot: true } )} />);
        expect(screen.getByTestId("shooting-box-round-length")).toHaveAttribute("value","10");
    });

    // details
    it('Should render the given details, if passed', () => {
        const details = {
            _2k_rating: 100,
            height_meters: 1.8,
            percents: '43.43%',
            team: 'Golden State Warriors',
            weight_kgs: 83.9
        };

        screen = render(<PlayerCard {...setProps({
            details
        } )} />);

        const regex = `${defaultProps['name']}.*${details.team}.*${details.percents}.*${details._2k_rating}.*${details.height_meters}.*${details.weight_kgs}`;
        expect(screen.getByTestId(defaultProps['data-testid'])).toHaveTextContent(new RegExp(regex), { exact: false });
    });

    // custom_details_title
    it('Should render a title to details, if passed', () => {
        const details = {
            _2k_rating: 100,
            height_meters: 1.8,
            percents: '43.43%',
            team: 'Golden State Warriors',
            weight_kgs: 83.9
        };

        const custom_details_title = 'Details:';

        screen = render(<PlayerCard {...setProps({
            custom_details_title,
            details
        } )} />);

        const regex = `${defaultProps['name']}.*${details.team}.*${custom_details_title}.*${details.percents}.*${details._2k_rating}.*${details.height_meters}.*${details.weight_kgs}`;
        expect(screen.getByTestId(defaultProps['data-testid'])).toHaveTextContent(new RegExp(regex), { exact: false });
    });

    // custom_details
    it('Should render the given custom_details, if passed', () => {
        // todo complete
    });

    // all_players
    it('Should render the given all_players, if passed', () => {
        // todo complete
    });
    it('Should show given players when clicking on replace', () => {
        // todo complete
    });

    // curr_players
    it('Should render the given curr_players, if passed', () => {
        // todo complete
    });

    // position
    it('Should render the given position, if passed', () => {
        // todo complete
    });

    // team_division
    it('Should render the given team_division, if passed', () => {
        // todo complete
    });

    // debut
    it('Should render the given debut, if passed', () => {
        // todo complete
    });

    // stats
    it('Should render the given stats, if passed', () => {
        // todo complete
    });

    // place
    it('Should render the given place, if passed', () => {
        // todo complete
    });

    // winner
    it('Should render the given winner, if passed', () => {
        // todo complete
    });

    // lost
    it('Should render the given lost, if passed', () => {
        // todo complete
    });

    // singleShot
    it('Should render the given singleShot, if passed', () => {
        // todo complete
    });

    // singleRounds
    it('Should render the given singleRounds, if passed', () => {
        // todo complete
    });

    // className
    it('Should render the given className, if passed', () => {
        // todo complete
    });

    // style
    it('Should render the given style, if passed', () => {
        // todo complete
    });

    // styles
    it('Should render the given styles, if passed', () => {
        // todo complete
    });

    // onClick
    it('Should fire onclick event if onClick callback was passed.', () => {
        const onClick = jest.fn();
        screen = render(<PlayerCard {...setProps({ onClick })} />);
        fireEvent.click(screen.getByTestId(defaultProps['data-testid']));
        expect(onClick).toHaveBeenCalled();
    });

    // disabled
    it('if disabled, onclick shouldn\'t be triggered.', () => {

        const onClick = jest.fn();
        screen = render(<PlayerCard {...setProps({ onClick, disabled: true })} />);
        fireEvent.click(screen.getByTestId(defaultProps['data-testid']));
        expect(onClick).not.toHaveBeenCalled();

        cleanup();

        screen = render(<PlayerCard {...setProps({ onClick, disabled: false })} />);
        fireEvent.click(screen.getByTestId(defaultProps['data-testid']));
        expect(onClick).toHaveBeenCalled();
    });

    // onReplace
    it('Should fire onclick event if onReplace callback was passed.', () => {
        // const onClick = jest.fn();
        // screen = render(<PlayerCard {...setProps({ onClick })} />);
        // fireEvent.click(screen.getByTestId(defaultProps['data-testid']);
        // expect(onClick).toHaveBeenCalled();
        // todo complete
    });

    // onSpecificReplace
    it('Should fire onclick event if onSpecificReplace callback was passed.', () => {
        // const onClick = jest.fn();
        // screen = render(<PlayerCard {...setProps({ onClick })} />);
        // fireEvent.click(screen.getByTestId(defaultProps['data-testid']);
        // expect(onClick).toHaveBeenCalled();
        // todo complete
    });

    // onChange
    it('Should fire onclick event if onChange callback was passed.', () => {
        // const onClick = jest.fn();
        // screen = render(<PlayerCard {...setProps({ onClick })} />);
        // fireEvent.click(screen.getByTestId(defaultProps['data-testid']);
        // expect(onClick).toHaveBeenCalled();
        // todo complete
    });

    // onScore
    it('Should fire onclick event if onScore callback was passed.', () => {
        // const onClick = jest.fn();
        // screen = render(<PlayerCard {...setProps({ onClick })} />);
        // fireEvent.click(screen.getByTestId(defaultProps['data-testid']);
        // expect(onClick).toHaveBeenCalled();
        // todo complete
    });

    // on fire
    // todo complete

    // ice cold
    // todo complete

    // fallback picture
    // todo complete

    // unknown player
    // todo complete

    // full stats
    // todo complete

    // replace - check that it works
    // todo complete

    // specific replace - check that clicking on replace once, shows the specific replace
    // todo complete

    // specific replace - check that specific replace works
    // todo complete

    // show stats link - check that it appears
    // todo complete

    // show more appears if data is too long
});