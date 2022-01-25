import React from "react";
import PropTypes from "prop-types";
import {isDefined} from "@helpers/utils";

export default class ShootingBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            shoot_score: 0,
        };
    }

    render() {

        const { wrapper, show, is_winner, is_loser, round_length, onScore,
                singleShot, onChange } = this.props;
        const { shoot_score } = this.state;

        if (!show){
            return "";
        }

        let input_style= { height: "38px", width: "30%", border: "1px solid #eaeaea", padding:"0px 5px" };

        // shoot
        let shoot_block = (!is_winner && !is_loser) ? (
            <div style={{display: "inline-block", paddingTop: "10px", marginTop: "10px", borderTop: "1px solid #eaeaea"}} data-testid={"shooting-box"}>
                <input
                    type={"number"}
                    value={shoot_score}
                    min={0}
                    max={round_length}
                    onChange={(e) => {
                        e.target.value = Number(e.target.value).toString();
                        this.setState({
                            shoot_score: Math.min(round_length, Number(e.target.value))
                        })
                    }}
                    style={input_style}
                    data-testid={"shooting-box-score"}
                />
                <span style={{ margin: "0px 5px" }} > / </span>
                <input type={"number"} value={round_length} data-testid={"shooting-box-round-length"} disabled style={input_style}/>
                <div className={"ui basic buttons"} style={{ marginLeft: "10px" }}>
                    <input
                        type={"button"}
                        className={"ui basic button"}
                        value={"Go"}
                        onClick={() => {
                            if (onScore) onScore(shoot_score);
                            this.setState({ shoot_score: 0});
                        }}
                        data-testid={"shooting-box-go"}
                    />
                </div>
            </div>
        ) : undefined;

        // single shoot (one on one)
        if (isDefined(singleShot)) {
            input_style.width = "100%";
            const shot_style = {
                display: "inline-block",
                paddingTop: "10px",
                marginTop: "10px",
                paddingBottom: "10px",
                marginBottom: "10px",
                borderTop: "1px solid #eaeaea",
                width: "100%"
            };
            shoot_block = (
                <div style={shot_style}>
                    <input
                        type={"number"}
                        value={singleShot}
                        min={0}
                        onChange={(e) => {
                            e.target.value = Number(e.target.value).toString();
                            if (onChange) onChange(e);
                        }}
                        style={input_style}
                    />
                </div>
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
                <div className={"card ui centered"}>
                    <div className="content">
                        {shoot_block}
                    </div>
                </div>
            );
        }
        return shoot_block;
    }
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