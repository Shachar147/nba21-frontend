import React from "react";
import PropTypes from "prop-types";

export default class Timer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            time_minutes: this.props.time_minutes * 2 + 1
        };

    }

    componentDidMount() {
       this.setTime();
    }

    setTime = () => {
        let { time_minutes } = this.state;

        if (time_minutes > 0){
            time_minutes--;
            this.setState({ time_minutes });
        }

        if (time_minutes > 0){
            setTimeout(this.setTime,1000)
        }
    }

    render() {

        const { time_minutes } = this.state;

        if (time_minutes === 0){
            let audio = new Audio('https://soundbible.com/mp3/Buzzer-SoundBible.com-188422102.mp3');
            audio.play();

            if (this.props.onFinish) {
                this.props.onFinish();
            }
        }

        return (
            <div className="ui link cards centered" style={{ margin: "auto" }}>
                <h1>
                    {time_minutes}
                </h1>
            </div>
        );
    }
}

Timer.propTypes = {
    /**
     * How much time (in minutes)?
     */
    time_minutes: PropTypes.number.isRequired,

    /**
     * What to do when timer finished?
     */
    onFinish:PropTypes.func,
};

Timer.defaultProps = {
    time_minutes: 1,
};