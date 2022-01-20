import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import ButtonInput from "../ButtonInput";

const defaultProps = {
    text: 'Button Text',
    // style: undefined,
    // disabled: false,
    // onClick: undefined,
}

describe('<ButtonInput /> test suite', () => {

    const setProps = (props = {}) => Object.assign({}, { ...defaultProps, ...props });

    afterEach(cleanup);

    // default props
    it('Verify default props', () => {
        const screen = render(<ButtonInput {...setProps()} />);
        expect(screen.getByText(/Button Text/i)).toBeInTheDocument();
        expect(screen.getByText(/Button Text/i)).not.toHaveAttribute('disabled');
        expect(screen.getByText(/Button Text/i)).not.toHaveAttribute('onclick');
    });

    // text
    it('Should render the given text, if passed', () => {
        const screen = render(<ButtonInput {...setProps({ text: 'Other Text' })} />);
        expect(screen.getByText(/Other Text/i)).toBeInTheDocument();
    });

    // disable property
    it('Should be disabled if disabled property was passed as true', () => {
        const screen = render(<ButtonInput {...setProps({ disabled: true })} />);
        expect(screen.getByText(/Button Text/i)).toHaveAttribute('disabled');
    });

    it('Should be disabled if disabled property was passed as false', () => {
        const screen = render(<ButtonInput {...setProps({ disabled: false })} />);
        expect(screen.getByText(/Button Text/i)).not.toHaveAttribute('disabled');
    });

    // style
    it('Should apply style settings if passed', () => {
        const screen = render(<ButtonInput {...setProps({ style: { opacity: '0.5' } })} />);
        expect(screen.getByText(/Button Text/i)).toHaveAttribute('style');
        expect(screen.getByText(/Button Text/i)).toHaveStyle('opacity: 0.5');
    });

    // onClick
    it('Should fire onclick event if onClick callback was passed.', () => {
        const onClick = jest.fn();
        const screen = render(<ButtonInput {...setProps({ onClick })} />);
        fireEvent.click(screen.getByText(/Button Text/i));
        expect(onClick).toHaveBeenCalled();
    });
});