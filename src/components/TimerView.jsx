import React from "react";
import PropTypes from "prop-types";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default class TimerView extends React.Component {

    constructor(props) {
        super(props);

        const originalTime = this.props.time_minutes * 1 + 5;

        this.state = {
            remainingTime: originalTime,
            originalTime: originalTime,
            audio: new Audio('/sounds/Buzzer-SoundBible.com-188422102.mp3'), // 'https://soundbible.com/mp3/Buzzer-SoundBible.com-188422102.mp3'
        };

    }

    componentDidMount() {
       this.setTime();
    }

    setTime = () => {
        let { remainingTime } = this.state;

        if (remainingTime > 0){
            remainingTime--;
            this.setState({ remainingTime });
        }

        if (remainingTime > 0){
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

        const { remainingTime, audio, originalTime } = this.state;

        if (remainingTime === 0){
            audio.load();
            this.playAudio();

            if (this.props.onFinish) {
                this.props.onFinish();
            }
        }

        const minuteSeconds = originalTime;

        const timerProps = {
            isPlaying: true,
            size: 600,
            strokeWidth: 70
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

        return (
            <div style={{
                margin: "auto",
                textAlign: "center",
                fontWeight:"bold",
                fontSize:"70px",
                lineHeight:"70px",
                position: "fixed",
                top:36,
                width: "100%",
                height: "100%",
                zIndex:99999,
                backgroundColor: "#efefef",
                display: "flex",
                justifyContent: "space-around",
                verticalAlign: "middle",
                paddingTop:"100px",
            }}>
                <CountdownCircleTimer
                    {...timerProps}
                    colors={[['#0068BB', 0.8],
                        ['#F10B45', 0.2],]}
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