import { useState } from "react";
import { FileUpload } from "../components/Icons";
import { postVideo } from "../api/index.js";

export const VideoUpload = ({ getVideoMetaData }) => {
  const MAX_ALLOWED_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

  const [videoFile, setVideoFile] = useState();

  const sendVideo = async (e) => {
    e.preventDefault();
    if (
      !e.target.user[0].checked &&
      !e.target.user[1].checked &&
      e.target.user[2].checked
    ) {
      let file = videoFile;
      let formData = new FormData();
      formData.append("file", file);
      getVideoMetaData(await postVideo(formData));
    }
  };

  const sizeLimit = (e) => {
    let file = e.target;
    if (
      file.files.length === 1 &&
      file.files[0].type === "video/mp4" &&
      file.files[0].size < MAX_ALLOWED_FILE_SIZE
    ) {
      setVideoFile(file.files[0]);
      const element = document.querySelector("svg");
      element.style.fill = "#2D8CEA";
    } else {
      file.value = "";
    }
  };

  return (
    <div>
      <form onSubmit={sendVideo} method="post">
        <fieldset>
          <legend htmlFor="videoUpload">Import video:</legend>
          <div className="uploadFile">
            <FileUpload className="svg" />
            <input
              type="file"
              id="videoUpload"
              name="videoUpload"
              accept="video/mp4"
              onChange={sizeLimit}
              required
            ></input>
          </div>
        </fieldset>
        <fieldset>
          <legend>Who are you ?</legend>
          <div className="center">
            <div>
              <input type="checkbox" name="user" id="animal" />
              <label htmlFor="animal">An animal</label>
            </div>
            <div>
              <input type="checkbox" name="user" id="robot" />
              <label htmlFor="robot">A robot</label>
            </div>
            <div>
              <input type="checkbox" name="user" id="human" />
              <label htmlFor="human">A human</label>
            </div>
          </div>
        </fieldset>
        <div className="center">
          <input type="submit" value="Upload"></input>
        </div>
      </form>
    </div>
  );
};
