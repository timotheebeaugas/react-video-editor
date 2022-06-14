import React, { useRef, useState, useEffect } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsFillSkipStartFill,
  BsFillSkipEndFill,
  BsVolumeUpFill,
  BsVolumeMuteFill,
} from "react-icons/bs";
import { Timeline } from "./components/Timeline";
import { VideoUpload } from "./components/VideoUpload";
import { useTimer } from "./hooks/timer";
import { timerFormat } from "./utils/timeFormat";

function App() {
  const videoRef = useRef();
  const timer = useRef();

  const [isPlay, setIsPlay] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const [time, setTime] = useTimer(isPlay, speed);

  const [videoId, setVideoId] = useState();
  const [videoDuration, setVideoDuration] = useState();

  const [isMute, setIsMute] = useState(false);

  const getVideoMetaData = (response) => {
    let videoData = response.data;
    setVideoId(videoData.file);
    setVideoDuration(videoData.duration);
  }

  useEffect(() => {
    isPlay ? videoRef.current.play() : videoRef.current.pause();
    videoRef.current.muted = isMute;
  }, [isPlay, isMute]);

  const restartVideo = () => {
    setIsPlay(false);
    setSpeed(1);
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setTime(0);
  };

  const finishVideo = () => {
    setIsPlay(false);
    setSpeed(1);
    videoRef.current.pause();
    videoRef.current.currentTime = videoRef.current.duration;
    setTime(videoDuration);
  };

  useEffect(() => {
    videoRef.current.playbackRate = speed;
  }, [speed]);

  const videoSpeed = (e) => {
    speed === 2.0 ? setSpeed(0.5) : setSpeed(speed + 0.5);
  };

  /*     useEffect(() => {
    let interval = window.setInterval(() => {
      timeline();
    }, 1);
    return () => clearInterval(interval);
  }, []); */

  /*  const timeline = (e) => {
    if (e) {
      videoRef.current.currentTime =
        ((e.pageX - e.target.getBoundingClientRect().left) *
          videoRef.current.duration) /
          ref.current.clientWidth;
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
    ref.current.clientWidth * (videoRef.current.currentTime / videoRef.current.duration) - 10 / 2;
    timer.current.style.marginLeft = `${barLength}px`;
  }; */

  const videoPortion = () => {
    //videoRef.current.currentTime = 12;
    //videoRef.current.duration = (ref.current.clientWidth+timelineStyle.marginLeft)*videoRef.current.duration/ref.current.clientWidth; get only
  };
  useEffect(() => {
    videoPortion();
  });

  /*   window.addEventListener("beforeunload", (e) => {   
    //e.preventDefault();
    if(videoId){
    let url = "http://localhost:3011/video/"+videoId;
    axios
      .delete(url)
      .then(function (response) {
      })
      .catch(function (error) {
      })
    }
  }); */

  return (
    <div className="App" >
      <VideoUpload getVideoMetaData={getVideoMetaData} />

      <div className="player">
        <video ref={videoRef}>
          {videoId ? (
            <source
              src={"http://localhost:3011/video/" + videoId}
              type="video/mp4"
            ></source>
          ) : null}
          <p>Your browser does not support this video.</p>
        </video>
        <div
          
          className="band"
        >
          <div className="timer" ref={timer}></div>
        </div>
        <div className="time">
          {timerFormat(time)}/ {timerFormat(videoDuration)}
        </div>
        <div className="controls">
          <div className="stop" onClick={restartVideo}>
            <BsFillSkipStartFill />
          </div>
          <div className="play" onClick={() => setIsPlay(!isPlay)}>
            {isPlay ? <BsPauseFill /> : <BsPlayFill />}
          </div>
          <div className="stop" onClick={finishVideo}>
            <BsFillSkipEndFill />
          </div>
          <div onClick={videoSpeed}>x{speed}</div>
          <div onClick={() => setIsMute(!isMute)}>
            {isMute ? <BsVolumeMuteFill /> : <BsVolumeUpFill />}
          </div>
        </div>
        <Timeline />
      </div>
    </div>
  );
}

export default App;
