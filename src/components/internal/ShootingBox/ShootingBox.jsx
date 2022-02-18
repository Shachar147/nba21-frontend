import React, {useState} from "react";
import PropTypes from "prop-types";
import {isDefined} from "@helpers/utils";
import style from './style';

const ShootingBox = ({ wrapper, show, is_winner, is_loser, round_length, onScore, singleShot, onChange }) => {
    const [shootScore, setShootScore] = useState(0);

    if (!show) return "";

    // shoot
    let shoot_block = (!is_winner && !is_loser) ? (
        <style.ShootingBox data-testid={"shooting-box"}>
            <style.InputStyle
                type={"number"}
                value={shootScore}
                min={0}
                max={round_length}
                onChange={(e) => {
                    e.target.value = Number(e.target.value).toString();
                    setShootScore(Math.min(round_length, Number(e.target.value)));
                }}
                data-testid={"shooting-box-score"}
            />
            <span style={{ margin: "0px 5px" }} > / </span>
            <style.InputStyle type={"number"} value={round_length} data-testid={"shooting-box-round-length"} disabled/>
            <style.ButtonWrapper className={"ui basic buttons"}>
                <input
                    type={"button"}
                    className={"ui basic button"}
                    value={"Go"}
                    onClick={() => {
                        if (onScore) onScore(shootScore);
                        setShootScore(0);
                    }}
                    data-testid={"shooting-box-go"}
                />
            </style.ButtonWrapper>
        </style.ShootingBox>
    ) : undefined;

    // single shoot (one on one)
    if (isDefined(singleShot)) {
        shoot_block = (
            <style.SingleShot data-testid={"single-shot-style"}>
                <style.InputStyle
                    width={"100%"}
                    type={"number"}
                    value={singleShot}
                    min={0}
                    onChange={(e) => {
                        e.target.value = Number(e.target.value).toString();
                        if (onChange) onChange(e);
                    }}
                    data-testid={"single-shot"}
                />
            </style.SingleShot>
        );
    }

    shoot_block = (
        <div>
            {shoot_block}
            {(is_winner) ? "Winner!" : (is_loser) ? "Loser" : ""}
        </div>
    )

    if (wrapper) {
        return (
            <div className={"card ui centered"} data-testid={"shooting-box-wrapper"}>
                <div className="content">
                    {shoot_block}
                </div>
            </div>
        );
    }
    return shoot_block;
}

ShootingBox.propTypes = {
    /**
     * Should we show this block or not?
     *
     */
    show: PropTypes.bool,
    /**
     * Is this player won? if so, range shooting box won't appear.
     * Also it will show appropriate message.
     *
     */
    is_winner: PropTypes.bool,
    /**
     * Is this player lost? if so, range shooting box won't appear.
     * Also it will show appropriate message.
     *
     */
    is_loser: PropTypes.bool,
    /**
     * Round length, for range shooting box.
     *
     */
    round_length: PropTypes.number,
    /**
     * onScore function, for range shooting box.
     *
     */
    onScore: PropTypes.func,

    /**
     * Current value for single shooting box.
     *
     */
    singleShot: PropTypes.number,
    /**
     * onChange function, for single shooting box.
     *
     */
    onChange: PropTypes.func,

    /**
     * should we wrap this card with cards wrapper?
     *
     * default is false because usually we would like to print multiple cards under the same wrapper, so we will print the wrapper outside.
     */
    wrapper: PropTypes.bool,
};

ShootingBox.defaultProps = {
    show: true,
    wrapper: false,
    round_length: 3,
};

export default ShootingBox;