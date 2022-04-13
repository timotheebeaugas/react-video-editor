import { Button } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";

function App() {

  const videoRef = useRef();
  const fwd = useRef();
  const rwd = useRef();
  const [videoTime, setVideoTime] = useState();
  const [timerStyle, setTimerStyle] = useState({
    width: 20,
    backgroundColor: 'red',
    height: 20,
  }
  );

  let intervalFwd;
  let intervalRwd;

  const playVideo = () => {
    videoRef.current.play()
  };
  
  const stopVideo = () => {
    videoRef.current.pause()
  };

  const restartVideo = () => {
    videoRef.current.pause()
    videoRef.current.currentTime = 0;
  };

  const windBackwardVideo = () => {
    clearInterval(intervalFwd);
    fwd.current.classList.remove('active');
    if(rwd.current.classList.contains('active')) {
      rwd.current.classList.remove('active');
      clearInterval(intervalRwd);
      videoRef.current.play();
    } else {
      rwd.current.classList.add('active');
      videoRef.current.pause();
      intervalRwd = setInterval(windBackward, 200);
    }
  };

  const windForwardVideo = () => {
    clearInterval(intervalRwd);
    rwd.current.classList.remove('active');
    if(fwd.current.classList.contains('active')) {
      fwd.current.classList.remove('active');
      clearInterval(intervalFwd);
      videoRef.current.play();
    } else {
      fwd.current.classList.add('active');
      videoRef.current.pause();
      intervalFwd = setInterval(windForward, 200);
    }
  };

  const windBackward = () => {
    if(videoRef.current.currentTime <= 3) {
      fwd.current.classList.remove('active');
      clearInterval(intervalRwd);
      restartVideo();
    } else {
      videoRef.current.currentTime -= 3;
    }
  }

  const windForward = () => {
    if(videoRef.current.currentTime >= videoRef.current.duration - 3) {
      rwd.current.classList.remove('active');
      clearInterval(intervalFwd);
      restartVideo();
    } else {
      videoRef.current.currentTime += 3;
    }
  }

  const setTime = () => {
    let minutes = Math.floor(videoRef.current.currentTime / 60);
    let seconds = Math.floor(videoRef.current.currentTime - minutes * 60);
    let minuteValue;
    let secondValue;
  
    if (minutes < 10) {
      minuteValue = '0' + minutes;
    } else {
      minuteValue = minutes;
    }
  
    if (seconds < 10) {
      secondValue = '0' + seconds;
    } else {
      secondValue = seconds;
    }
  
    setVideoTime(minuteValue + ':' + secondValue) ;
  
    const barLength = 550 * (videoRef.current.currentTime/videoRef.current.duration);
    setTimerStyle({...timerStyle, width: barLength})
  }

  useEffect(() => {
    setTime();
  })

  return ( 
    <div className="App">
      <div className="player">
        <video controls width="550" ref={videoRef}>
          <source
            src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
            type="video/mp4"
          ></source>
          <p>Your browser does not support this video.</p>
        </video>

        <div className="constrols">
          <div className="timer" style={timerStyle}></div>
        <div className="time">{videoTime}</div>
          <Button variant="contained" className="play" onClick={playVideo}>
            Play
          </Button>
          <Button variant="contained" className="stop" onClick={restartVideo}>
            Restart
          </Button>
          <Button variant="contained" className="stop" onClick={stopVideo}>
            Stop
          </Button>
          <Button variant="contained" className="windBackward" ref={rwd} onClick={windBackwardVideo}>
            Backward
          </Button>
          <Button variant="contained" className="windForward" ref={fwd} onClick={windForwardVideo}>
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
