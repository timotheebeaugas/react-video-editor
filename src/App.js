import React, { useRef, useState, useEffect } from "react";
import {
  Next,
  Pause,
  Play,
  Previous,
  VolumeMute,
  VolumeUp,
} from "./components/Icons";
import { Timeline } from "./components/Timeline";
import { VideoUpload } from "./components/VideoUpload";
import { useTimer } from "./hooks/timer";
import { usePlay } from "./hooks/usePlay";
import { timerFormat } from "./utils/timeFormat";

function App() {
  const videoRef = useRef();

  const [speed, setSpeed] = useState(1.0);

  const [videoId, setVideoId] = useState("1655746620576.mp4");

  const [videoDuration, setVideoDuration] = useState(215551);
  const [editedVideoDuration, setEditedVideoDuration] = useState(215551);

  const [chunk, setChunk] = useState();

  const [time, setTime] = useTimer(videoRef, chunk, videoDuration, editedVideoDuration)

  const [isPlay, setIsPlay] = usePlay(videoRef, editedVideoDuration, time)
  const [isMute, setIsMute] = useState(false);

  const [progressBarLenght, setProgressBarLenght] = useState({ width: 0 });

  const getVideoMetaData = (response) => {
    let videoData = response.data;
    setVideoId(videoData.file);
    setVideoDuration(videoData.duration);
    setEditedVideoDuration(videoData.duration);
  };

  const getTimelineChunk = (chunkStart, chunkEnd) => {
    setIsPlay(false);
    videoRef.current.currentTime = (chunkStart * videoDuration) / 1000;
    setTime(0);
    setEditedVideoDuration(
      chunkEnd * videoDuration - chunkStart * videoDuration
    );
    setChunk({chunkStart, chunkEnd});
  };

  const restartVideo = () => {
    setIsPlay(false);
    setSpeed(1);
    let newVideoTime = chunk ? chunk.chunkStart * videoDuration : 0;
    videoRef.current.currentTime = newVideoTime / 1000;
    setTime(0);
  };

  const finishVideo = () => {
    setIsPlay(false);
    setSpeed(1);
    let newVideoTime = chunk ? chunk.chunkEnd * videoDuration : videoDuration;
    videoRef.current.currentTime = newVideoTime / 1000;
    setTime(newVideoTime - (chunk ? (chunk.chunkStart * videoDuration) : 0));
  };

  useEffect(() => {
    videoRef.current.playbackRate = speed;
    videoRef.current.muted = isMute;

    let progressBar = document
      .querySelector(".progress-bar")
      .getBoundingClientRect();
    let progress =
      (progressBar.width * time) / editedVideoDuration;
    setProgressBarLenght({ width: progress });
  }, [speed, isPlay, isMute, time, editedVideoDuration]);

  const videoSpeed = (e) => {
    speed === 2.0 ? setSpeed(0.5) : setSpeed(speed + 0.5);
  };

  const updateProgressBar = (e) => {
    let progressBar = document
      .querySelector(".progress-bar")
      .getBoundingClientRect();
    let progress =
      ((e.pageX - progressBar.left) * editedVideoDuration) / progressBar.width;
    setTime(progress);
    let newVideoTime = chunk ? chunk.chunkStart * videoDuration : 0;
    videoRef.current.currentTime = (progress + newVideoTime) / 1000;
  };

  /* REMOVE FILE BEFORE CLOSE TAB */
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
    <div className="App">
      <VideoUpload getVideoMetaData={getVideoMetaData} />

      <div>
        <video ref={videoRef} controls>
          {videoId ? (
            <source
              src={"http://localhost:3011/video/" + videoId}
              type="video/mp4"
            ></source>
          ) : null}
          <p>Your browser does not support this video.</p>
        </video>

        <div className="progress-bar" onMouseDown={(e) => updateProgressBar(e)}>
          <div className="progress-bar-content" style={progressBarLenght}></div>
        </div>

        <div className="time">
          {timerFormat(time)} / {timerFormat(editedVideoDuration)}
        </div>
        <div className="controls">
          <div className="stop" onClick={restartVideo}>
            <Previous />
          </div>
          <div className="play" onClick={() => setIsPlay(!isPlay)}>
            {isPlay ? <Pause /> : <Play />}
          </div>
          <div className="stop" onClick={finishVideo}>
            <Next />
          </div>
          <div onClick={videoSpeed}>x{speed}</div>
          <div onClick={() => setIsMute(!isMute)}>
            {isMute ? <VolumeMute /> : <VolumeUp />}
          </div>
        </div>
        <Timeline getTimelineChunk={getTimelineChunk} />
      </div>
    </div>
  );
}

export default App;
