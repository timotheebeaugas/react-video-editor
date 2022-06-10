import axios from "axios";
import { useState } from "react";

export const VideoUpload = ({getVideoMetaData}) => {
  const MAX_ALLOWED_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

  const [videoFile, setVideoFile] = useState();

  const sendVideo = (e) => {
    e.preventDefault();

    let url = "http://localhost:3011/video";
    let file = videoFile;
    let formData = new FormData();
    formData.append("file", file); 

    axios
      .post(url, formData)
      .then(function (response) {
        getVideoMetaData(response);
      }) 
      .catch(function (error) {});
  };

  const sizeLimit = (e) => {
    let file = e.target;
    if (
      file.files.length === 1 &&
      file.files[0].type === "video/mp4" &&
      file.files[0].size < MAX_ALLOWED_FILE_SIZE
    ) {
      setVideoFile(file.files[0]);
    } else {
      file.value = "";
    }
  };

  return (
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
  );
};