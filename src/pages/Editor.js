import React, { useRef, useState, useEffect } from "react";
import {
  Next,
  Pause,
  Play,
  Previous,
  VolumeMute,
  VolumeUp,
  Download,
} from "../components/Icons";
import { Timeline } from "../components/Timeline";
import { useBreakpoints } from "../hooks/useBreakpoints";
import { useTimer } from "../hooks/useTimer";
import { usePlay } from "../hooks/usePlay";
import { timerFormat } from "../utils/timeFormat";
import { getVideo, editVideo, getEditedVideo } from "../api";

export const Editor = ({ videoMetaData }) => {
  const videoRef = useRef();

  const [isSmallDevices] = useBreakpoints();

  const [speed, setSpeed] = useState(1.0);

  const [videoId, setVideoId] = useState();

  const [videoDuration, setVideoDuration] = useState();
  const [editedVideoDuration, setEditedVideoDuration] = useState();

  useEffect(() => {
    setVideoId(videoMetaData.file);
    setVideoDuration(videoMetaData.duration);
    setEditedVideoDuration(videoMetaData.duration);
  }, [videoMetaData]);

  const [chunk, setChunk] = useState();

  const [time, setTime] = useTimer(
    videoRef,
    chunk,
    videoDuration,
    editedVideoDuration,
    isSmallDevices
  );

  const [isPlay, setIsPlay] = usePlay(videoRef, editedVideoDuration, time);
  const [isMute, setIsMute] = useState(false);

  const [progressBarLenght, setProgressBarLenght] = useState({ width: 0 });

  /*     const getVideoMetaData = (response) => {
      let videoData = response.data;
      setVideoId(videoData.file);
      setVideoDuration(videoData.duration);
      setEditedVideoDuration(videoData.duration);
    }; */

  const getTimelineChunk = (chunkStart, chunkEnd) => {
    setIsPlay(false);
    videoRef.current.currentTime = (chunkStart * videoDuration) / 1000;
    setTime(0);
    setEditedVideoDuration(
      chunkEnd * videoDuration - chunkStart * videoDuration
    );
    setChunk({ chunkStart, chunkEnd });
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
    setTime(newVideoTime - (chunk ? chunk.chunkStart * videoDuration : 0));
  };

  useEffect(() => {
    videoRef.current.playbackRate = speed;
    videoRef.current.muted = isMute;

    let progressBar = document
      .querySelector(".progress-bar")
      .getBoundingClientRect();
    let progress = (progressBar.width * time) / editedVideoDuration;
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

  const downloadVideo = async () => {
    let response = await editVideo(videoId, videoDuration, chunk);

    if (response.status === 200) {
      let editedVideosId = response.data.id;

      const element = document.createElement("a");
      element.setAttribute("href", getEditedVideo(editedVideosId));

      element.setAttribute("download", editedVideosId);
      element.style.display = "none";

      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  useEffect(() => {
    setProgressBarLenght({ width: 0 });
  }, []);

  return (
    <>
      <video ref={videoRef}>
        {videoId ? (
          <source src={getVideo(videoId)} type="video/mp4"></source>
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
      {chunk ? (
        <span onClick={downloadVideo}>
          <Download />
        </span>
      ) : null}
    </>
  );
};
