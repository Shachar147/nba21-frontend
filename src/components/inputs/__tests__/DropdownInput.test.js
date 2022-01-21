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
    // todo complete

    // placeholder
    // todo complete

    // label
    // todo complete

    // width
    // todo complete

    // onChange
    // todo complete

    // styles
    // todo complete

    // disabled
    // todo complete

});