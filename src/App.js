import { SmallDevices } from "./pages/Devices";
import { VideoUpload } from "./pages/Upload";
import { useBreakpoints } from "./hooks/useBreakpoints";
import { useState } from "react";
import { Editor } from "./pages/Editor";

function App() {
  const [isSmallDevices] = useBreakpoints();

  const [videoMetaData, setVideoMetaData] = useState();

  const getVideoMetaData = (response) => {
    setVideoMetaData(response.data);
  };

  return (
    <div className="App">
      {isSmallDevices ? (
        <SmallDevices />
      ) : videoMetaData ? (
        <Editor videoMetaData={videoMetaData} />
      ) : (
        <VideoUpload getVideoMetaData={getVideoMetaData} />
      )}
    </div>
  );
}

export default App;
