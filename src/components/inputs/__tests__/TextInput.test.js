import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TextInput from "../TextInput";

const defaultProps = {
    'data-testid': "text-input",
    onChange: () => {},
}

describe('<TextInput /> test suite', () => {

    const setProps = (props = {}) => Object.assign({}, { ...defaultProps, ...props });

    afterEach(cleanup);

    // default props
    it('Verify default props', () => {
        const screen = render(<TextInput {...setProps()} />);
        expect(screen.getByTestId('text-input')).toBeInTheDocument();
        expect(screen.getByTestId('text-input')).not.toHaveAttribute('disabled');
        expect(screen.getByTestId('text-input')).not.toHaveAttribute('onChange');
        expect(screen.getByTestId('text-input')).not.toHaveAttribute('onKeyDown');
        expect(screen.getByTestId('text-input').value).toEqual('');
        expect(screen.getByTestId('text-input').type).toEqual('text');
    });

    // type text
    it('Should render a text input when text type is passed', () => {
        const screen = render(<TextInput {...setProps({ type: 'text' })} />);
        expect(screen.getByTestId('text-input').type).toEqual('text');
    });

    // type password
    it('Should render a password input when password type is passed', () => {
        const screen = render(<TextInput {...setProps({ type: 'password' })} />);
        expect(screen.getByTestId('text-input').type).toEqual('password');
    });

    // type checkbox
    it('Should render a number input when number type is passed', () => {
        const screen = render(<TextInput {...setProps({ type: 'number' })} />);
        expect(screen.getByTestId('text-input').type).toEqual('number');
    });

    // disabled
    it('Should be disabled if disabled property was passed', () => {
        const screen = render(<TextInput {...setProps({ disabled: true })} />);
        expect(screen.getByTestId('text-input')).toHaveAttribute('disabled');
    });

    // name
    it('Should have the given name if name property was passed', () => {
        const screen = render(<TextInput {...setProps({ name: 'input-name' })} />);
        expect(screen.getByTestId('text-input')).toHaveAttribute('name','input-name');
    });

    // placeholder
    it('Should have the given placeholder if placeholder property was passed', () => {
        const screen = render(<TextInput {...setProps({ placeholder: 'Type Something...' })} />);
        expect(screen.getByTestId('text-input')).toHaveAttribute('placeholder','Type Something...');
    });

    // error
    it('Should have red border on input if error property was passed.', () => {
        const screen = render(<TextInput {...setProps({ error: true })} />);
        expect(screen.getByTestId('text-input')).toHaveStyle('border:1px solid #F10B45');
    });
    it('Should not have red border on input if error property was passed as false.', () => {
        const screen = render(<TextInput {...setProps({ error: false })} />);
        expect(screen.getByTestId('text-input')).not.toHaveStyle('border:1px solid #F10B45');
    });
    it('Should not have red border on input if error property was not passed.', () => {
        const screen = render(<TextInput {...setProps({ error: undefined })} />);
        expect(screen.getByTestId('text-input')).not.toHaveStyle('border:1px solid #F10B45');
    });

    // value
    it('Should have value if value property was passed', () => {
        const screen = render(<TextInput {...setProps({ value: 'Input Value' })} />);
        expect(screen.getByTestId('text-input')).toHaveAttribute('value', 'Input Value');
    });

    // onKeyDown
    it('Should fire onKeyDown event if onKeyDown callback was passed.', () => {
        const onKeyDown = jest.fn();
        const screen = render(<TextInput {...setProps({ onKeyDown })} />);
        fireEvent.keyDown(screen.getByTestId('text-input'), {key: 'Enter', code: 'Enter', keyCode:13, charCode: 13})
        expect(onKeyDown).toHaveBeenCalled();
        expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ keyCode: 13 }));
    });

    // onKeyUp
    it('Should fire onKeyUp event if onKeyUp callback was passed.', () => {
        const onKeyUp = jest.fn();
        const screen = render(<TextInput {...setProps({ onKeyUp })} />);
        fireEvent.keyUp(screen.getByTestId('text-input'), {key: 'Enter', code: 'Enter', keyCode:13, charCode: 13})
        expect(onKeyUp).toHaveBeenCalled();
        expect(onKeyUp).toHaveBeenCalledWith(expect.objectContaining({ keyCode: 13 }));
    });

    // onChange
    it('Should fire onChange event if onChange callback was passed.', async () => {
        const onChange = jest.fn();
        const screen = render(<TextInput {...setProps({ onChange })} />);
        const value = 'a';
        const element = screen.getByTestId('text-input');
        // userEvent.type(element, value);
        fireEvent.change(element, { target: { value } });
        expect(onChange).toHaveBeenCalled();
        // expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: value }) }));
    });

    // icon
    it('Should render iconblock if icon prop was passed', () => {
        let screen;

        screen = render(<TextInput {...setProps({ icon: 'user' })} />);
        expect(screen.getByTestId('text-input-icon')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-icon')).toHaveClass('icon user');

        cleanup();

        screen = render(<TextInput {...setProps({ icon: 'password' })} />);
        expect(screen.getByTestId('text-input-icon')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-icon')).toHaveClass('icon password');
    });

    // label
    it('Should render label if label property was passed', () => {
        const screen = render(<TextInput {...setProps({ label: 'Please choose a number:', type: 'number' })} />);
        expect(screen.getByTestId('text-input-label')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-label').textContent).toEqual('Please choose a number:');
    });

    // inputStyle
    it('input should have the style given as inputStyle, if property was passed.', () => {
        let screen;

        // default style
        screen = render(<TextInput {...setProps({ })} />);
        expect(screen.getByTestId('text-input')).toHaveStyle('width: 100%');
        cleanup();

        // input style as property
        screen = render(<TextInput {...setProps({ inputStyle: { width: '90px' } })} />);
        expect(screen.getByTestId('text-input')).toHaveStyle('width: 90px');
        cleanup();

        // input style as property
        screen = render(<TextInput {...setProps({ inputStyle: { backgroundColor: 'red' } })} />);
        expect(screen.getByTestId('text-input')).toHaveStyle('background-color: red');
        cleanup();
    });

    // containerStyle
    it('container should have the style given as containerStyle, if property was passed', () => {
        const screen = render(<TextInput {...setProps({ containerStyle: { fontSize: '20px' } })} />);
        expect(screen.getByTestId('text-input-container')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-container')).toHaveStyle('font-size: 20px');
    });

    // labelStyle
    it('label should have the style given as labelStyle, if property was passed', () => {
        const screen = render(<TextInput {...setProps({ label: 'Please choose a number:', labelStyle: { fontSize: '20px' } })} />);
        expect(screen.getByTestId('text-input-label')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-label')).toHaveStyle('font-size: 20px');
    });
});