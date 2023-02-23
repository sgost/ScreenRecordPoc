import './App.css';
import { useReactMediaRecorder } from "react-media-recorder";
import React, { useEffect } from 'react';
import axios from 'axios';


function App() {

  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ screen: true });

  useEffect(() => {
    uploadVideoFun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status === "stopped"]);

  const uploadVideoFun = () => {
    let formData = new FormData();
    if (mediaBlobUrl) {
      fetch(mediaBlobUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], mediaBlobUrl, { type: blob.type })
          console.log("fileBlob", file)
          console.log("formData", formData)
          formData.append('file', file);
          formData.append('title', 'test title');
          formData.append('desc', 'test desc');
          axios({
            url: `https://screen.fidisys.com/api/v1/fileUpload`,
            method: 'POST',
            data: formData
          }).then((_res) => alert("Video Uploaded Successfully")).error((err) => alert("Oops!, Something went wrong"))
        })
    }
  }

  return (

    <div className='pc_recorder'>
      <h1>PC Screen Recorder</h1>
      <div className='control_btns'>
        {(status === "idle" || status === "stopped") &&
          <button onClick={startRecording} className="start_btns">Start</button>}
        {status === "recording" &&
          <button onClick={stopRecording} className="start_btns stop_btns">Stop</button>}
      </div>
    </div>
  );
}

export default App;
