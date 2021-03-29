import React from "react";
import PropTypes from "prop-types";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default class TimerView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            time_minutes: this.props.time_minutes * 60 + 2,
            audio: new Audio('/sounds/Buzzer-SoundBible.com-188422102.mp3'), // 'https://soundbible.com/mp3/Buzzer-SoundBible.com-188422102.mp3'
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

    playAudio() {
        const audioPromise = this.state.audio.play();
        if (audioPromise !== undefined) {
            audioPromise
                .then(_ => {
                    // autoplay started
                })
                .catch(err => {
                    // catch dom exception
                    console.info(err)
                })
        }
    }


    render() {

        const { time_minutes, audio } = this.state;

        if (time_minutes === 0){
            audio.load();
            this.playAudio();

            if (this.props.onFinish) {
                this.props.onFinish();
            }
        }

        const minuteSeconds = 60;

        const timerProps = {
            isPlaying: true,
            size: 300,
            strokeWidth: 15
        };

        const renderTime = (dimension, time) => {
            return (
                <div className="time-wrapper">
                    <div className="time">{time}</div>
                    <div>{dimension}</div>
                </div>
            );
        };

        const getTimeSeconds = (time) => (minuteSeconds - time) | 0;

        const remainingTime = time_minutes;

        return (
            <div className="ui link cards centered" style={{ margin: "30px 0px", textAlign: "center", fontWeight:"bold", fontSize:"40px", lineHeight:"40px" }}>
                <CountdownCircleTimer
                    {...timerProps}
                    colors={[["#218380"]]}
                    duration={minuteSeconds}
                    initialRemainingTime={remainingTime}
                    onComplete={(totalElapsedTime) => [
                        remainingTime - totalElapsedTime > 0
                    ]}
                >
                    {({ elapsedTime }) =>
                        renderTime("seconds", getTimeSeconds(elapsedTime))
                    }
                </CountdownCircleTimer>
            </div>
        );

        // return (
        //     <div className="ui link cards centered" style={{ margin: "auto" }}>
        //         <h1>
        //             {time_minutes}
        //         </h1>
        //     </div>
        // );
    }
}

TimerView.propTypes = {
    /**
     * How much time (in minutes)?
     */
    time_minutes: PropTypes.number.isRequired,

    /**
     * What to do when timer finished?
     */
    onFinish:PropTypes.func,
};

TimerView.defaultProps = {
    time_minutes: 1,
};