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

        const custom_details_title = 'Details:';
        const custom_details = ["detail1","detail2"];

        screen = render(<PlayerCard {...setProps({
            custom_details_title,
            custom_details,
        } )} />);

        const regex = `${defaultProps['name']}.*${custom_details_title}.*${custom_details.join('.*')}`;
        expect(screen.getByTestId(defaultProps['data-testid'])).toHaveTextContent(new RegExp(regex), { exact: false });
    });

    // SpecificReplace
    it('Specific Replace Behavior - Appears only after clicking on replace', async () => {

        const onReplace = jest.fn();
        const onSpecificReplace = jest.fn();

        screen = render(<PlayerCard {...setProps({
            onSpecificReplace,
            onReplace
        } )} />);

        // make sure specific replace appears only after clicking on replace.
        expect(screen.getByText('Replace')).toBeInTheDocument();
        expect(screen.queryByText('Specific Replace')).not.toBeInTheDocument();
        expect(screen.queryByTestId('specific-replace-select')).not.toBeInTheDocument();
        await fireEvent.click(screen.getByText('Replace'));
        expect(screen.getByText('Specific Replace')).toBeInTheDocument();
        expect(screen.queryByText('specific-replace-select')).not.toBeInTheDocument();
        await fireEvent.click(screen.getByText('Specific Replace'));
        expect(screen.getByTestId('specific-replace-select')).toBeInTheDocument();
    });

    it('Specific Replace Behavior - Options are all_players minus curr player (by name)', async () => {

        const onReplace = jest.fn();
        const onSpecificReplace = jest.fn();

        const all_players = JSON.parse('[{"id":233,"name":"LeBron James", "picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/2544.png", "position":"Forward","heightfeet":6,"heightmeters":2.06,"heightinches":9,"weightpounds":250, "weightkgs":113.4,"jersey":23,"debutyear":2003, "2krating":97,"team":{"id":14,"name":"Los Angeles Lakers", "logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/lal.png", "division":"PACIFIC","conference":"WEST"}}, {"id":184,"name":"James Harden", "picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201935.png", "position":"Guard","heightfeet":6,"heightmeters":1.96,"heightinches":5,"weightpounds":220, "weightkgs":99.8,"jersey":13,"debutyear":2009,"2krating":95, "team":{"id":3,"name":"Brooklyn Nets", "logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/bkn.png","division":"ATLANTIC", "conference":"EAST"}}, {"id":109,"name":"Stephen Curry", "picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201939.png", "position":"Guard","heightfeet":6,"heightmeters":1.9,"heightinches":3,"weightpounds":185,"weight_kgs":83.9, "jersey":30,"debutyear":2009,"2k_rating":95, "team":{"id":10,"name":"Golden State Warriors", "logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/gsw.png", "division":"PACIFIC","conference":"WEST"}}]');

        screen = render(<PlayerCard {...setProps({
            name: 'Stephen Curry',
            all_players,
            onSpecificReplace,
            onReplace
        } )} />);

        //
        await fireEvent.click(screen.getByText('Replace'));
        await fireEvent.click(screen.getByText('Specific Replace'));

        const specificReplaceSelect = screen.getByTestId('specific-replace-select');
        expect(specificReplaceSelect).toBeInTheDocument();

        // make sure only players that aren't current one are rendered.
        expect(screen.queryByText("Select Replacement...")).toBeInTheDocument();
        expect(screen.queryByText("James Harden")).toBeInTheDocument();
        expect(screen.queryByText("LeBron James")).toBeInTheDocument();
        expect(document.querySelector("option[value='Stephen Curry']")).not.toBeInTheDocument();

        // make sure value is same as text
        expect(screen.queryByText("Select Replacement...")).toHaveAttribute("value", "Select Replacement...");
        expect(screen.queryByText("James Harden")).toHaveAttribute("value", "James Harden");
        expect(screen.queryByText("LeBron James")).toHaveAttribute("value", "LeBron James");
    });

    it('Specific Replace Behavior - Options are all_players minus curr player (by curr_players)', async () => {

        const onReplace = jest.fn();
        const onSpecificReplace = jest.fn();

        const all_players = JSON.parse('[{"id":233,"name":"LeBron James", "picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/2544.png", "position":"Forward","heightfeet":6,"heightmeters":2.06,"heightinches":9,"weightpounds":250, "weightkgs":113.4,"jersey":23,"debutyear":2003, "2krating":97,"team":{"id":14,"name":"Los Angeles Lakers", "logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/lal.png", "division":"PACIFIC","conference":"WEST"}}, {"id":184,"name":"James Harden", "picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201935.png", "position":"Guard","heightfeet":6,"heightmeters":1.96,"heightinches":5,"weightpounds":220, "weightkgs":99.8,"jersey":13,"debutyear":2009,"2krating":95, "team":{"id":3,"name":"Brooklyn Nets", "logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/bkn.png","division":"ATLANTIC", "conference":"EAST"}}, {"id":109,"name":"Stephen Curry", "picture":"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/201939.png", "position":"Guard","heightfeet":6,"heightmeters":1.9,"heightinches":3,"weightpounds":185,"weight_kgs":83.9, "jersey":30,"debutyear":2009,"2k_rating":95, "team":{"id":10,"name":"Golden State Warriors", "logo":"https://www.nba.com/.element/img/1.0/teamsites/logos/teamlogos_500x500/gsw.png", "division":"PACIFIC","conference":"WEST"}}]');

        screen = render(<PlayerCard {...setProps({
            name: 'Stephen Curry',
            curr_players: ['Stephen Curry', 'LeBron James'],
            all_players,
            onSpecificReplace,
            onReplace
        } )} />);

        //
        await fireEvent.click(screen.getByText('Replace'));
        await fireEvent.click(screen.getByText('Specific Replace'));

        const specificReplaceSelect = screen.getByTestId('specific-replace-select');
        expect(specificReplaceSelect).toBeInTheDocument();

        // make sure only players that aren't current one are rendered.
        expect(document.querySelector("option[value='Select Replacement...']")).toBeInTheDocument();
        expect(document.querySelector("option[value='James Harden']")).toBeInTheDocument();
        expect(document.querySelector("option[value='LeBron James']")).not.toBeInTheDocument();
        expect(document.querySelector("option[value='Stephen Curry']")).not.toBeInTheDocument();

        // make sure value is same as text
        expect(screen.queryByText("Select Replacement...")).toHaveAttribute("value", "Select Replacement...");
        expect(screen.queryByText("James Harden")).toHaveAttribute("value", "James Harden");
    });

    it('Should show given players when clicking on replace', () => {
        // todo complete
    });

    // curr_players
    it('Should be used in replace - to filter all players except of curr players as options.', () => {
        // todo complete
    });

    // position
    it('Should render the given position, if passed', () => {
        screen = render(<PlayerCard {...setProps({
            position: "Guard",
        } )} />);

        const text = `Position: Guard`;
        expect(screen.getByText(text)).toBeInTheDocument();
    });

    // team_division
    it('Should render the given team_division, if passed', () => {
        screen = render(<PlayerCard {...setProps({
            team_division: "Pacific",
        } )} />);
        const text = `Division: Pacific`;
        expect(screen.getByText(text)).toBeInTheDocument();

        cleanup();

        screen = render(<PlayerCard {...setProps({
            position: "Guard",
            team_division: "Pacific"
        } )} />);

        expect(screen.getByText(text)).toBeInTheDocument();
        let element = screen.queryByText('Position: Guard');
        expect(element).not.toBeInTheDocument();
    });

    // debut_year
    it('Should render the given debut, if passed', () => {
        screen = render(<PlayerCard {...setProps({
            debut_year: 2009
        } )} />);
        const text = `Joined in 2009`;
        expect(screen.getByText(text)).toBeInTheDocument();
    });

    // stats
    it('Should render the given stats, if passed', () => {
        const stats = {
            "win_streak": 2,
            "max_win_streak": 10,
            "lose_streak": 0,
            "max_lose_streak": 0,
            "total_win_percents": "80.00%",
            "total_games": 100,
            "total_wins": 80,
            "total_lost": 20,
            "total_diff": 250,
            "total_diff_per_game": 2.5,
            "total_away_games": 50,
            "total_home_games": 50,
            "total_knockouts": 25,
            "avg_opponent_2k_rating": 95,
            "total_scored": 1250,
            "total_suffered": 1000,
            "total_suffered_knockouts": 3
        };

        screen = render(<PlayerCard {...setProps({
            stats
        } )} />);

        const settings_ordered = [
            stats.total_win_percents,
            stats.total_games,
            stats.win_streak,
            stats.max_win_streak,
            stats.lose_streak,
            stats.max_lose_streak,
            stats.total_home_games,
            stats.total_away_games,
        ];
        const regex = settings_ordered.join('.*');
        expect(screen.getByTestId(defaultProps['data-testid'])).toHaveTextContent(new RegExp(regex), { exact: false });
        expect(screen.getByText("Show More")).toBeInTheDocument();
    });

    // place
    it('Should render the given place, if passed', () => {
        screen = render(<PlayerCard {...setProps({
            place: 1,
            styles: {
                placeRibbon: "blue"
            }
        } )} />);

        expect(screen.getByTestId("place-ribbon")).toBeInTheDocument();
        expect(screen.getByTestId("place-ribbon").textContent).toBe("#1");
        expect(screen.getByTestId("place-ribbon")).toHaveClass("ribbon");
        expect(screen.getByTestId("place-ribbon")).toHaveClass("blue");

        cleanup();

        screen = render(<PlayerCard {...setProps({
            place: 4,
            styles: {
                placeRibbon: "red"
            }
        } )} />);

        expect(screen.getByTestId("place-ribbon")).toBeInTheDocument();
        expect(screen.getByTestId("place-ribbon").textContent).toBe("#4");
        expect(screen.getByTestId("place-ribbon")).toHaveClass("ribbon");
        expect(screen.getByTestId("place-ribbon")).toHaveClass("red");
    });

    // winner
    it('Should render the given winner, if passed', () => {
        screen = render(<PlayerCard {...setProps({
            shoot: true,
            winner: true
        } )} />);
        expect(screen.getByText("Winner!")).toBeInTheDocument();
    });

    // lost
    it('Should render the given lost, if passed', () => {
        screen = render(<PlayerCard {...setProps({
            shoot: true,
            lost: true
        } )} />);
        expect(screen.getByText("Loser")).toBeInTheDocument();
        const lost_image = screen.getByTestId("lost-image")
        expect(lost_image).toBeInTheDocument();
        expect(lost_image).toHaveAttribute('src','/x-png-icon-8.jpg');
    });

    // singleShot
    it('Should render the given singleShot, if passed', () => {
        screen = render(<PlayerCard {...setProps({
            shoot: true,
            singleShot: 4
        } )} />);
        expect(screen.queryByTestId("single-shot")).toBeInTheDocument();
        expect(screen.queryByTestId("single-shot")).toHaveAttribute("type","number");
        expect(screen.queryByTestId("single-shot")).toHaveAttribute("value", "4");
    });

    // singleRounds
    it('Should render the given singleRounds, if passed', () => {
        const singleRounds = [7,5,10];
        screen = render(<PlayerCard {...setProps({
            shoot: true,
            singleShot: 4,
            singleRounds,
        } )} />);

        const regex = singleRounds.map(x => x + ' Points').join('.*');
        expect(screen.getByTestId(defaultProps['data-testid'])).toHaveTextContent(new RegExp(regex), { exact: false });

    });

    // className
    it('Should render the given className, if passed', () => {
        screen = render(<PlayerCard {...setProps({
            className: "some-class"
        } )} />);
        expect(screen.getByTestId(defaultProps['data-testid'])).toHaveClass('some-class');
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
    it('', () => {

    });

    // ice cold
    // todo complete
    it('', () => {

    });

    // fallback picture
    // todo complete
    it('', () => {

    });

    // unknown player
    // todo complete
    it('', () => {

    });

    // full stats
    // todo complete
    it('', () => {

    });

    // replace - check that it works
    // todo complete
    it('', () => {

    });

    // specific replace - check that clicking on replace once, shows the specific replace
    // todo complete
    it('', () => {

    });

    // specific replace - check that specific replace works
    // todo complete
    it('', () => {

    });

    // show stats link - check that it appears
    // todo complete
    it('', () => {

    });

    // show more appears if data is too long
    // todo complete
    it('', () => {

    });
});