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

    // // idKey
    // it('Should render options texts based on nameKey', () => {
    //     let screen = render(<DropdownInput {...setProps({ options: [{"id":"1","name":"Option1","value":"val1"},{"id":"2","name":"Option2","value":"val2"}] })} />);
    //     expect(screen.getByText('Option1')).toHaveProperty("key", "val1");
    //     expect(screen.getByText('Option2')).toHaveProperty("key", "val2");
    //
    //     cleanup();
    //
    //     screen = render(<DropdownInput {...setProps({ idKey: "name", options: [{"id":"1","name":"Option1","value":"val1"},{"id":"2","name":"Option2","value":"val2"}] })} />);
    //     expect(screen.getByText('Option1')).toHaveProperty("key", "Option1");
    //     expect(screen.getByText('Option2')).toHaveProperty("key", "Option2");
    //
    //     cleanup();
    //
    //     screen = render(<DropdownInput {...setProps({ idKey: "id", options: [{"id":"1","name":"Option1","value":"val1"},{"id":"2","name":"Option2","value":"val2"}] })} />);
    //     expect(screen.getByText('Option1')).toHaveProperty("key", "1");
    //     expect(screen.getByText('Option2')).toHaveProperty("key", "2");
    // });

    // sort
    // todo complete

    // sortKey
    // todo complete

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