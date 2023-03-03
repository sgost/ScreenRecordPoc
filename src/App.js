import './App.css';
import { useReactMediaRecorder } from "react-media-recorder";
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function App() {

  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ screen: true });

  useEffect(() => {
    uploadVideoFun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status === "stopped"]);

  // const box = useRef(null);
  // useOutsideAlerter(box);


  const [projectName, setProjectName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [proceed, setProceed] = useState(false);


  const uploadVideoFun = async () => {
    let formData = new FormData();
    if (mediaBlobUrl) {
      fetch(mediaBlobUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], mediaBlobUrl, { type: blob.type });
          formData.append('file', file);
          formData.append('project_name', projectName)
          formData.append('title', title);
          formData.append('desc', description);
          axios({
            url: `https://screen-stag.fidisys.com/api/v1/files/project`,
            method: 'POST',
            data: formData
          }).then((_res) => {
            axios({
              url: `https://screen-stag.fidisys.com/api/v1/files/${_res?.data?.data?.project_id}/images`,
              method: 'POST',
              data: {
                "thumbnail": [
                  {
                    "duration": "00:00:03",
                    "x": "xx",
                    "y": "yy",
                  },
                  {
                    "duration": "00:00:06",
                    "x": "xx",
                    "y": "yy",
                  },
                  {
                    "duration": "00:00:08",
                    "x": "xx",
                    "y": "yy",
                  },
                  {
                    "duration": "00:00:10",
                    "x": "xx",
                    "y": "yy",
                  },
                ]
              }
            }).then((_res) => alert("Video Saved"))
          }).error((_err) => alert("Oops!, Something went wrong"))
        })
    }
  }

  const proceedFun = () => {
    setProceed(true);
  }
  return (
    <div className='project_content_wrapper'>
      {!proceed ?
        <div className='project_detail_container'>
          <h1 className='card_title'>POC Recorder</h1>
          <div className='card_input_container'>
            <input type="text" placeholder='Project Name' onChange={(e) => setProjectName(e.target.value)} />
            <input type="text" placeholder='Project Title' onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder='Project Description' onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button className='proceed_btn' onClick={() => proceedFun()}>Proceed</button>
        </div>
        :
        <div className='pc_recorder'>
          <div className='pc_recorder_wrapper'>
            <h1>POC Recorder</h1>
            <div className='control_btns'>
              {(status === "idle" || status === "stopped") &&
                <button onClick={startRecording} className="start_btns">Start</button>}
              {status === "recording" &&
                <button onClick={stopRecording} className="start_btns stop_btns">Stop</button>}
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default App;



// import React, { useEffect, useRef } from 'react'

// function App(props) {
//   const box = useRef(null);
//   useOutsideAlerter(box);
//   return (<div style={{
//     margin: 300,
//     width: 200, height: 200, backgroundColor: 'green'
//   }}
//     ref={box}>{props.children}</div>
//   )
// }

// export default App;

// function useOutsideAlerter(ref) {
//   useEffect(() => {

//     // Function for click event
//     function handleOutsideClick(event) {
//       if (ref.current && ref.current.contains(event.target)) {
//         alert("you just clicked here!");
//       }
//     }

//     // Adding click event listener
//     document.addEventListener("click", handleOutsideClick);
//     return () => document.removeEventListener("click", handleOutsideClick);
//   }, [ref]);
// }
