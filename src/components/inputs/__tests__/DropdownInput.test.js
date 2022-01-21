import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import DropdownInput from "../DropdownInput";

const defaultProps = {
    options: [],
    nameKey: "name",
    valueKey: "value",
    idKey: "id",
    disabled: false,
};

describe('<DropdownInput /> test suite', () => {

    const setProps = (props = {}) => Object.assign({}, { ...defaultProps, ...props });

    afterEach(cleanup);

    // default props
    it('Verify default props', () => {
        const screen = render(<DropdownInput {...setProps()} />);
        expect(screen.getByText('No Options')).toBeInTheDocument();
        expect(screen.getAllByRole(/option/i)).toHaveLength(1);
    });

    // options
    it('Should render options if passed', () => {
        const screen = render(<DropdownInput {...setProps({ options: [{"id":"1","name":"Option1","value":"1"},{"id":"2","name":"Option2","value":"2"}] })} />);
        expect(screen.getByText('Option1')).toBeInTheDocument();
        expect(screen.getByText('Option2')).toBeInTheDocument();
        expect(screen.getAllByRole(/option/i)).toHaveLength(2);
    });

    // valueKey
    it('Should render options values based on valueKey', () => {
        let screen = render(<DropdownInput {...setProps({ options: [{"id":"1","name":"Option1","value":"val1"},{"id":"2","name":"Option2","value":"val2"}] })} />);
        expect(screen.getByText('Option1')).toHaveProperty("value", "val1");
        expect(screen.getByText('Option2')).toHaveProperty("value", "val2");

        cleanup();

        screen = render(<DropdownInput {...setProps({ valueKey: "name", options: [{"id":"1","name":"Option1","value":"val1"},{"id":"2","name":"Option2","value":"val2"}] })} />);
        expect(screen.getByText('Option1')).toHaveProperty("value", "Option1");
        expect(screen.getByText('Option2')).toHaveProperty("value", "Option2");

        cleanup();

        screen = render(<DropdownInput {...setProps({ valueKey: "id", options: [{"id":"1","name":"Option1","value":"val1"},{"id":"2","name":"Option2","value":"val2"}] })} />);
        expect(screen.getByText('Option1')).toHaveProperty("value", "1");
        expect(screen.getByText('Option2')).toHaveProperty("value", "2");
    });

    // nameKey
    it('Should render options texts based on nameKey', () => {
        const screen = render(<DropdownInput {
            ...setProps({
                nameKey: "label",
                options: [{"id":"1","name":"Option1","label": "label1", "value":"val1"},{"id":"2","name":"Option2","label": "label2", "value":"val2"}]
            })
        } />);

        expect(screen.getByText('label1')).toBeInTheDocument();
        expect(screen.getByText('label2')).toBeInTheDocument();
    });

    // sort
    it('Should render options texts based on the given sortKey and sort',  () => {

        const OPTIONS = [{"id":"1","name":"ZZZ","label": "BBB", "value":"val1"},{"id":"2","name":"AAA","label": "YYY", "value":"val2"}];

        let screen, options;

        // order by name desc
        screen = render(<DropdownInput {
             ...setProps({ sortKey: "name", sort: "desc", options: OPTIONS })
         } />);
        options = screen.queryAllByRole(/option/i);
        expect(options[0].textContent).toEqual("ZZZ"); // ZZZ
        expect(options[1].textContent).toEqual("AAA"); // AAA

        cleanup();

        // order by name asc
        screen = render(<DropdownInput {
           ...setProps({ sortKey: "name", sort: "asc", options: OPTIONS })
        } />);
        options = Array.from(screen.queryAllByRole(/option/i));
        expect(options[0].textContent).toEqual("AAA"); // AAA
        expect(options[1].textContent).toEqual("ZZZ"); // ZZZ

        cleanup();

        // order by label desc
        screen = render(<DropdownInput {
           ...setProps({ sortKey: "label", sort: "asc", options: OPTIONS })
        } />);
        options = screen.getAllByRole(/option/i);
        expect(options[0].textContent).toEqual("ZZZ"); // since the label is BBB
        expect(options[1].textContent).toEqual("AAA"); // since the label is YYY

        cleanup();

        // order by label desc
        screen = render(<DropdownInput {
           ...setProps({ sortKey: "label", sort: "desc", options: OPTIONS })
        } />);
        options = screen.getAllByRole(/option/i);
        expect(options[0].textContent).toEqual("AAA"); // since the label is YYY
        expect(options[1].textContent).toEqual("ZZZ"); // since the label is BBB
    });

    // selectedOption
    it('Should select given option, if selectedOption was given',  () => {

        // define variables
        const option1 = {"id":"1","name":"Option1","value":"val1"};
        const option2 = {"id":"2","name":"Option2","value":"val2"};
        const option3 = {"id":"3","name":"Option3","value":"val3"};
        let testProps = {
            options: [option1, option2, option3],
            'data-testid': 'my-select',
        };
        let screen;

        // when selectedOption not passed - should select first option
        screen = render(<DropdownInput {...setProps(testProps)} />);
        expect((screen.getByText("Option1")).selected).toBeTruthy();
        expect((screen.getByText("Option2")).selected).toBeFalsy();
        expect((screen.getByText("Option3")).selected).toBeFalsy();
        cleanup();

        // when selectedOption passed - should select what was passed. (option 2)
        testProps["selectedOption"] = option2;
        screen = render(<DropdownInput {...setProps(testProps)} />);
        expect((screen.getByText("Option1")).selected).toBeFalsy();
        expect((screen.getByText("Option2")).selected).toBeTruthy();
        expect((screen.getByText("Option3")).selected).toBeFalsy();
        cleanup();

        // when selectedOption passed - should select what was passed. (option 3)
        testProps["selectedOption"] = option3;
        screen = render(<DropdownInput {...setProps(testProps)} />);
        expect((screen.getByText("Option1")).selected).toBeFalsy();
        expect((screen.getByText("Option2")).selected).toBeFalsy();
        expect((screen.getByText("Option3")).selected).toBeTruthy();
        cleanup();

        // when selectedOption passed - should select what was passed. (option 1)
        testProps["selectedOption"] = option1;
        screen = render(<DropdownInput {...setProps(testProps)} />);
        expect((screen.getByText("Option1")).selected).toBeTruthy();
        expect((screen.getByText("Option2")).selected).toBeFalsy();
        expect((screen.getByText("Option3")).selected).toBeFalsy();
        cleanup();

        // when wrong option was passed - should select first option
        testProps["selectedOption"] = { };
        screen = render(<DropdownInput {...setProps(testProps)} />);
        expect((screen.getByText("Option1")).selected).toBeTruthy();
        expect((screen.getByText("Option2")).selected).toBeFalsy();
        expect((screen.getByText("Option3")).selected).toBeFalsy();
    });

    // placeholder
    it('Should show placeholder if it was passed.', () => {
        const OPTIONS = [{"id":"1","name":"ZZZ","label": "BBB", "value":"val1"},{"id":"2","name":"AAA","label": "YYY", "value":"val2"}];
        let screen, options;

        // no placeholder
        screen = render(<DropdownInput {...setProps({ options: OPTIONS })} />);
        options = screen.queryAllByRole(/option/i);
        expect(options.length).toBe(2);
        cleanup();

        // placeholder, make sure its first.
        screen = render(<DropdownInput {...setProps({ 'data-testid':'my-select', placeholder: 'Choose Something...', options: OPTIONS })} />);
        options = screen.queryAllByRole(/option/i);
        expect(options.length).toBe(3);
        expect(options[0].textContent).toBe("Choose Something...");

        // choose something, make sure placeholder still first.
        const select = screen.getByTestId('my-select');
        fireEvent.change(select, { target: { value: 'val2' } } );
        expect(options[0].textContent).toBe("Choose Something...");
    });

    // label
    it('Should show label if it was passed.', () => {
        const OPTIONS = [{"id":"1","name":"ZZZ","label": "BBB", "value":"val1"},{"id":"2","name":"AAA","label": "YYY", "value":"val2"}];
        const labelText = "Please Select an Option:"
        let screen = render(<DropdownInput {...setProps({ options: OPTIONS, label: labelText })} />);
        expect(screen.getByText(labelText)).toBeInTheDocument();
    });

    // width
    it('Should set select width based on given width prop, if passed', () => {
        const OPTIONS = [{"id":"1","name":"ZZZ","label": "BBB", "value":"val1"},{"id":"2","name":"AAA","label": "YYY", "value":"val2"}];
        let width, screen;

        // width 300
        width = 300;
        screen = render(<DropdownInput {...setProps({ options: OPTIONS, width, "data-testid":"my-select" })} />);
        expect(screen.getByTestId('my-select')).toHaveStyle('width: ' + width + 'px');

        cleanup();

        // width 400
        width = 400;
        screen = render(<DropdownInput {...setProps({ options: OPTIONS, width, "data-testid":"my-select" })} />);
        expect(screen.getByTestId('my-select')).toHaveStyle('width: ' + width + 'px');
    });

    // onChange
    it('Should fire onChange event if onChange callback was passed.', () => {
        const onChange = jest.fn();
        const screen = render(<DropdownInput {...setProps({ onChange, 'data-testid': 'my-select' })} />);
        fireEvent.change(screen.getByTestId('my-select'));
        expect(onChange).toHaveBeenCalled();
    });

    // styles
    it('Should apply styles on wrapper div, if styles prop was passed.', () => {
        const screen = render(<DropdownInput {...setProps({
            style: {
                textAlign: 'center',
                width: '420px',
                backgroundColor: 'rgba(0,0,0,0.08)',
                fontSize: '14px',
                padding: '10px',
                borderRadius: '30px',
                border: '1px solid #ccc'
            } , 'data-testid': 'my-select'
        })} />);
        expect(screen.getByTestId('my-select-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId('my-select-wrapper')).toHaveStyle('text-align: center');
        expect(screen.getByTestId('my-select-wrapper')).toHaveStyle('width: 420px');
        expect(screen.getByTestId('my-select-wrapper')).toHaveStyle('font-size: 14px');
        expect(screen.getByTestId('my-select-wrapper')).toHaveStyle('padding: 10px');
        expect(screen.getByTestId('my-select-wrapper')).toHaveStyle('border-radius: 30px');
        expect(screen.getByTestId('my-select-wrapper')).toHaveStyle('border: 1px solid #ccc');
    });

    // disabled
    it('Should be disabled if disabled prop was passed.', () => {
        const screen = render(<DropdownInput {...setProps({
            'data-testid': 'my-select',
            disabled: true
        })} />);
        expect(screen.getByTestId('my-select')).toHaveAttribute('disabled');
    });

});