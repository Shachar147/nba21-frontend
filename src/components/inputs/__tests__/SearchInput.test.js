import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import SearchInput from "../SearchInput";

const defaultProps = {}

describe('<SearchInput /> test suite', () => {

    const setProps = (props = {}) => Object.assign({}, { ...defaultProps, ...props });

    afterEach(cleanup);

    // onKeyUp
    it('Should fire onKeyUp event.', () => {
        const onKeyUp = jest.fn();
        const screen = render(<SearchInput {...setProps({ onKeyUp, 'data-testid': "search-input" })} />);
        fireEvent.keyUp(screen.getByTestId("search-input"));
        expect(onKeyUp).toHaveBeenCalled();
    });
});