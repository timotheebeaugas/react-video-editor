import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsFillSkipStartFill,
  BsFillSkipEndFill,
  BsVolumeUpFill,
  BsVolumeMuteFill,
  BsArrowBarLeft,
  BsArrowBarRight,
} from "react-icons/bs";

function App() {
  const videoRef = useRef();
  const ref = useRef();
  const timelineref = useRef();
  const timer = useRef();

  const [videoTime, setVideoTime] = useState();
  const [videoDuration, setVideoDuration] = useState();
  const [timelineStyle, setTimelineStyle] = useState({
    width: 550,
    marginLeft: 0,
  });
  const [move, setMove] = useState("");
  const [speed, setSpeed] = useState(1);
  const [isPlay, setIsPlay] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [videoFile, setVideoFile] = useState();

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

  const setTime2 = () => {
    //Hooks
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
    setVideoDuration(minuteValue + ":" + secondValue);
  };

  useEffect(() => {
    let interval = window.setInterval(() => {
      timeline();
      setTime2();
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const timeline = (e) => {
    if (e) {
      videoRef.current.currentTime =
        ((e.pageX - e.target.getBoundingClientRect().left) *
          videoRef.current.duration) /
        550;
    }
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
      550 * (videoRef.current.currentTime / videoRef.current.duration) - 10 / 2;
    timer.current.style.marginLeft = `${barLength}px`;
  };

  const trackUp = (e) => {
    if (move) {
      setMove(false);
    }
  };

  const trackMove = (e) => {
    if (move) {
      if (
        move.classList.contains("left") &&
        e.clientX > ref.current.offsetLeft - 1 &&
        e.clientX + 10 < timelineStyle.width + timelineStyle.marginLeft
      ) {
        setTimelineStyle({
          marginLeft: e.clientX - ref.current.offsetLeft,
          width:
            timelineStyle.width +
            timelineStyle.marginLeft -
            e.clientX +
            ref.current.offsetLeft,
        });
      } else if (
        move.classList.contains("right") &&
        e.clientX - ref.current.offsetLeft - timelineStyle.marginLeft > 20
      ) {
        setTimelineStyle({
          ...timelineStyle,
          width:
            e.clientX > 550 + ref.current.offsetLeft
              ? 550 +
                ref.current.offsetLeft -
                ref.current.offsetLeft -
                timelineStyle.marginLeft
              : e.clientX - ref.current.offsetLeft - timelineStyle.marginLeft,
        });
      }
    }
  };

  const videoPortion = () => {
    //videoRef.current.currentTime = 12;
    //videoRef.current.duration = (timelineStyle.width+timelineStyle.marginLeft)*videoRef.current.duration/550; get only
  };
  useEffect(() => {
    videoPortion();
  });

  const sendVideo = (e) => {
    e.preventDefault();
    
    console.log(videoFile);
    let url = "http://localhost:3011/video";
    let file = videoFile;
    let formData = new FormData();
    formData.append('file', file);

    axios
      .post(url, formData)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const sizeLimit = (e) => {
    const maxAllowedSize = 10 * 1024 * 1024; // 10 Mo
    let file = e.target;
    if (
      file.files.length === 1 &&
      file.files[0].type === "video/mp4" &&
      file.files[0].size < maxAllowedSize
    ) {
      setVideoFile(file.files[0]);
    } else {
      file.value = "";
    }
  };

  return (
    <div className="App" ref={ref} onMouseMove={trackMove} onMouseUp={trackUp}>

      <form onSubmit={sendVideo} method="post">
        <label htmlFor="video">Import video:</label>
        <input
          type="file"
          id="video"
          name="video"
          accept="video/mp4"
          onChange={sizeLimit}
          required
        ></input>
        <input type="submit" value="Upload"></input>
      </form>

      <div className="player">
        <video width="550" ref={videoRef}>
          <source
            src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
            type="video/mp4"
          ></source>
          <p>Your browser does not support this video.</p>
        </video>
        <div className="band" onMouseDown={(e) => timeline(e)}>
          <div className="timer" ref={timer}></div>
        </div>
        <div className="time">
          {videoTime} / {videoDuration}
        </div>
        <div className="constrols">
          <div className="stop" onClick={restartVideo}>
            <BsFillSkipStartFill />
          </div>
          <div className="play" onClick={() => setIsPlay(!isPlay)}>
            {isPlay ? <BsPauseFill /> : <BsPlayFill />}
          </div>{" "}
          <div className="stop" onClick={finishVideo}>
            <BsFillSkipEndFill />
          </div>
          <div onClick={videoSpeed}>x{speed}</div>
          <div onClick={() => setIsMute(!isMute)}>
            {isMute ? <BsVolumeMuteFill /> : <BsVolumeUpFill />}
          </div>
        </div>
        <div className="background-timeline">
          <div className="timeline" ref={timelineref} style={timelineStyle}>
            <div
              className="resizer right"
              onMouseDown={(e) => setMove(e.target)}
            ></div>
            <div
              className="resizer left"
              onMouseDown={(e) => setMove(e.target)}
            ></div>
          </div>
        </div>{" "}
        <BsArrowBarLeft
          onClick={() =>
            setTimelineStyle({
              width: timelineStyle.width + timelineStyle.marginLeft,
              marginLeft: 0,
            })
          }
        />
        <BsArrowBarRight
          onClick={() =>
            setTimelineStyle({
              ...timelineStyle,
              width: 550 - timelineStyle.marginLeft,
            })
          }
        />
      </div>
    </div>
  );
}

export default App;
