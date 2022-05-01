import React, { useRef, useState, useEffect } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsFillSkipStartFill,
  BsFillSkipEndFill,
  BsVolumeUpFill,
  BsVolumeMuteFill,
  BsFullscreen,
} from "react-icons/bs";

function App() {
  const videoRef = useRef();
  const ref = useRef();
  const timelineref = useRef();

  const [videoTime, setVideoTime] = useState();
  const [videoDuration, setVideoDuration] = useState();
  const [timerStyle, setTimerStyle] = useState({
    width: 20,
    backgroundColor: "red",
    height: 20,
  });
  const [timelineStyle, setTimelineStyle] = useState({
    width: 550,
    marginLeft: 0,
  });
  const [move, setMove] = useState("");
  const [speed, setSpeed] = useState(1);
  const [isPlay, setIsPlay] = useState(false);
  const [isMute, setIsMute] = useState(false);

  useEffect(() => {
    isPlay ? videoRef.current.play() : videoRef.current.pause();
    videoRef.current.muted = isMute;
  }, [isPlay, isMute]);

  const restartVideo = () => {
    setIsPlay(false);
    setSpeed(1);
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  const finishVideo = () => {
    setIsPlay(false);
    setSpeed(1);
    videoRef.current.pause();
    videoRef.current.currentTime = videoRef.current.duration;
  };

  useEffect(() => {
    // HOOKS
    let interval;
    if (speed > 1 && isPlay) {
      interval = setInterval(
        () => (videoRef.current.currentTime += speed),
        200
      );
    } else if (speed === 1) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [speed, isPlay]);

  const videoSpeed = (e) => {
    if (speed > 2.5) {
      setSpeed(1);
    } else {
      setSpeed(speed + 0.5);
    }
  };

  const setTime = () => {
    let minutes = Math.floor(videoRef.current.currentTime / 60);
    let seconds = Math.floor(videoRef.current.currentTime - minutes * 60);
    let minuteValue;
    let secondValue;

    if (minutes < 10) {
      minuteValue = "0" + minutes;
    } else {
      minuteValue = minutes;
    }

    if (seconds < 10) {
      secondValue = "0" + seconds;
    } else {
      secondValue = seconds;
    }

    setVideoTime(minuteValue + ":" + secondValue);

    const barLength =
      550 * (videoRef.current.currentTime / videoRef.current.duration);
    setTimerStyle({ ...timerStyle, width: barLength });
  };

  useEffect(() => {
    setTime();
  });



  const setTime2 = () => {
    let minutes = Math.floor(videoRef.current.duration / 60);
    let seconds = Math.floor(videoRef.current.duration - minutes * 60);
    let minuteValue;
    let secondValue;

    if (minutes < 10) {
      minuteValue = "0" + minutes;
    } else {
      minuteValue = minutes;
    }

    if (seconds < 10) {
      secondValue = "0" + seconds;
    } else {
      secondValue = seconds;
    }

    setVideoDuration(minuteValue + ":" + secondValue)
  };

  useEffect(() => {
    setTime2();
  }, [videoDuration])

  const timeline = (e) => {
    videoRef.current.currentTime =
      ((e.pageX - e.target.getBoundingClientRect().left) *
        videoRef.current.duration) /
      550;
  };

  const trackUp = (e) => {
    if (move) {
      setMove(false);
    }
  };

  const trackMove = (e) => {
    if (move) {
      if (move.classList.contains("left")) {
        setTimelineStyle({
          marginLeft: e.clientX - ref.current.offsetLeft,
          width:
            timelineStyle.width +
            timelineStyle.marginLeft -
            e.clientX +
            ref.current.offsetLeft,
        });
      } else if (move.classList.contains("right")) {
        setTimelineStyle({
          ...timelineStyle,
          width: e.clientX - ref.current.offsetLeft - timelineStyle.marginLeft,
        });
      }
    }
  };

  const trackDown = (e) => {
    setMove(e.target);
  };

  return (
    <div className="App" ref={ref} onMouseMove={trackMove} onMouseUp={trackUp}>
      <div className="player">
        <video width="550" ref={videoRef}>
          <source
            src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
            type="video/mp4"
          ></source>
          <p>Your browser does not support this video.</p>
        </video>

        <div
          style={{ width: 550, height: 20, backgroundColor: "blue" }}
          onMouseDown={(e) => timeline(e)}
        ></div>
        <div className="timer" style={timerStyle}></div>
        <div className="time">{videoTime}</div>
        <div className="time">{videoDuration}</div>
        <div className="constrols">
          <div className="play" onClick={() => setIsPlay(!isPlay)}>
            {isPlay ? <BsPauseFill /> : <BsPlayFill />}
          </div>
          <div className="stop" onClick={restartVideo}>
            <BsFillSkipStartFill />
          </div>
          <div className="stop" onClick={finishVideo}>
            <BsFillSkipEndFill />
          </div>
          <div onClick={videoSpeed}>x{speed}</div>
          <div onClick={() => setIsMute(!isMute)}>
            {isMute ? <BsVolumeMuteFill /> : <BsVolumeUpFill />}
          </div>
          <div onClick={() => videoRef.current.requestFullscreen()}>
          <BsFullscreen />
          </div>
        </div>
        <div className="background-timeline">
          <div className="timeline" ref={timelineref} style={timelineStyle}>
            <div className="resizer right" onMouseDown={trackDown}></div>
            <div className="resizer left" onMouseDown={trackDown}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
