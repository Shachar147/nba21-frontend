import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import ShootingBox from "../ShootingBox";

const defaultProps = {
    // show: true,
    // wrapper: true,
    // round_length: 3,
    // singleShot
    // onChange
    // onScore
    // is_loser
    // is_winner
}

describe('<ShootingBox /> test suite', () => {

    const setProps = (props = {}) => Object.assign({}, { ...defaultProps, ...props });

    afterEach(cleanup);

    // default props
    it('Verify default props', () => {
        const screen = render(<ShootingBox {...setProps()} />);
        expect(screen.queryByTestId('shooting-box')).toBeInTheDocument();
        expect(screen.queryByTestId('shooting-box-score')).toBeInTheDocument();
        expect(screen.queryByTestId('shooting-box-round-length')).toBeInTheDocument();
        expect(screen.queryByTestId('shooting-box-go')).toBeInTheDocument();

        expect(screen.queryByTestId('shooting-box-score')).toHaveValue(0);
        expect(screen.queryByTestId('shooting-box-round-length')).toHaveValue(3);
    });

    // show
    it('Should be shown if show property was passed as true', () => {
        let screen = render(<ShootingBox {...setProps({ show: true })} />);
        expect(screen.queryByTestId('shooting-box')).toBeInTheDocument();
        expect(screen.queryByTestId('shooting-box-score')).toBeInTheDocument();
        expect(screen.queryByTestId('shooting-box-round-length')).toBeInTheDocument();
        expect(screen.queryByTestId('shooting-box-go')).toBeInTheDocument();
        cleanup();

        screen = render(<ShootingBox {...setProps({ show: false })} />);
        expect(screen.queryByTestId('shooting-box')).not.toBeInTheDocument();
        expect(screen.queryByTestId('shooting-box-score')).not.toBeInTheDocument();
        expect(screen.queryByTestId('shooting-box-round-length')).not.toBeInTheDocument();
        expect(screen.queryByTestId('shooting-box-go')).not.toBeInTheDocument();
    });

    // wrapper
    it('Should be wrapped in wrapper if wrapper property was passed as true', () => {
        let screen = render(<ShootingBox {...setProps()} />);
        expect(screen.queryByTestId('shooting-box-wrapper')).not.toBeInTheDocument();
        cleanup();

        screen = render(<ShootingBox {...setProps({ wrapper: false })} />);
        expect(screen.queryByTestId('shooting-box-wrapper')).not.toBeInTheDocument();
        cleanup();

        screen = render(<ShootingBox {...setProps({ wrapper: true })} />);
        expect(screen.queryByTestId('shooting-box-wrapper')).toBeInTheDocument();
    });

    // round_length
    it('Should render shooting box round length with value based on the given round_length property', () => {
        let screen = render(<ShootingBox {...setProps({ round_length: 5 })} />);
        expect(screen.queryByTestId('shooting-box-round-length')).toHaveValue(5);
        cleanup();
        screen = render(<ShootingBox {...setProps({ round_length: 10 })} />);
        expect(screen.queryByTestId('shooting-box-round-length')).toHaveValue(10);
    });

    // onScore
    it('Should fire onclick event if onClick callback was passed.', () => {
        const onScore = jest.fn();
        const screen = render(<ShootingBox {...setProps({ onScore })} />);
        fireEvent.click(screen.getByTestId('shooting-box-go'));
        expect(onScore).toHaveBeenCalled();
    });

    // singleShot
    it('Should show single shot input if singleShot param was passed', () => {
        const screen = render(<ShootingBox {...setProps({ singleShot: 0 })} />);
        expect(screen.queryByTestId('single-shot')).toBeInTheDocument();

        expect(screen.queryByTestId('shooting-box')).not.toBeInTheDocument();
        expect(screen.queryByTestId('shooting-box-score')).not.toBeInTheDocument();
        expect(screen.queryByTestId('shooting-box-round-length')).not.toBeInTheDocument();
        expect(screen.queryByTestId('shooting-box-go')).not.toBeInTheDocument();
    });

    // singleShot
    it('Sinel Shot value should be same as singleShot Parameter', () => {
        let screen;

        screen = render(<ShootingBox {...setProps({ singleShot: 0 })} />);
        expect(screen.queryByTestId('single-shot')).toBeInTheDocument();
        expect(screen.queryByTestId('single-shot')).toHaveValue(0);
        cleanup();

        screen = render(<ShootingBox {...setProps({ singleShot: 3 })} />);
        expect(screen.queryByTestId('single-shot')).toBeInTheDocument();
        expect(screen.queryByTestId('single-shot')).toHaveValue(3);
        cleanup();

        screen = render(<ShootingBox {...setProps({ singleShot: 50 })} />);
        expect(screen.queryByTestId('single-shot')).toBeInTheDocument();
        expect(screen.queryByTestId('single-shot')).toHaveValue(50);
    });

    // onChange
    it('Should call onChange function if passed, whenever score changes.', () => {
        const onChange = jest.fn();
        const screen = render(<ShootingBox {...setProps({ singleShot:0, onChange })} />);
        fireEvent.change(screen.getByTestId('single-shot'), { target: { value: '3' }} );
        expect(onChange).toHaveBeenCalled();
    });

    // make sure score can't be greater then round length.
    it('Should set value to round length if user tries to set value that is bigger then that.', () => {
        const screen = render(<ShootingBox {...setProps({ round_length: 5 })} />);
        fireEvent.change(screen.getByTestId('shooting-box-score'), { target: { value: '50' }} );
        expect(screen.getByTestId('shooting-box-score')).toHaveValue(5);
    });

    // is_loser
    it('Should render Loser message if is_losser flag was passed.', () => {
        const screen = render(<ShootingBox {...setProps({ is_loser: true })} />);
        expect(screen.getByText(/Loser/i)).toBeInTheDocument();
    });

    // is_winner
    it('Should render Winner message if is_winner flag was passed.', () => {
        const screen = render(<ShootingBox {...setProps({ is_winner: true })} />);
        expect(screen.getByText(/Winner!/i)).toBeInTheDocument();
    });
});