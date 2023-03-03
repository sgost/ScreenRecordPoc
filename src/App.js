import { useEffect, useState, Fragment } from 'react';
import './App.css';
import axios from 'axios';

function App() {

  const [getVidData, setGetVidData] = useState([]);
  const [currVidId, setCurrVidId] = useState("");
  const [openVid, setVidOpen] = useState({
    videoKey: "",
    open: false
  });
  const [imageLink, setImageLink] = useState('');
  const [getProjectData, setGetProjectData] = useState({});
  const [getAudioData, setGetAudioData] = useState([]);
  const [selImage, setSelImage] = useState(0);
  const [getFinalData, setGetFinalData] = useState({});
  const [closePreview, setClosePreview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getVidFun();
  }, [])

  const getVidFun = () => {
    axios({
      url: `https://screen-stag.fidisys.com/api/v1/files/project`,
      method: 'GET'
    }).then((res) => {
      setGetVidData(res?.data?.data);
    }).catch((err) => {
      console.log("err", err)
    })
  }

  useEffect(() => {
    getProjectDetailsFun();
  }, [openVid.open])

  const getProjectDetailsFun = () => {
    axios({
      url: `https://screen-stag.fidisys.com/api/v1/files/project/${openVid?.videoKey}`,
      method: 'GET'
    }).then((res) => {
      setGetProjectData(res?.data?.data);
      if (res?.data?.data?.audio?.length > 0) {
        res?.data?.data?.audio?.map((item) => {
          getAudioData.push({
            "text": item?.text,
            "duration": parseInt(item?.width)
          })
        })
      } else {
        res?.data?.data?.images?.map((item) => {
          getAudioData.push({
            "text": "",
            "duration": parseInt(item?.width)
          })
        })
      }
    }).catch((err) => {
      console.log("err", err)
    })
  }

  const updateAudioFun = (value, index) => {
    const testArr = [...getAudioData];
    testArr[index]['text'] = value;
    setGetAudioData(testArr)
  }


  const makeFinalVideo = () => {
    setLoading(true);
    axios({
      url: `https://screen-stag.fidisys.com/api/v1/files/${openVid?.videoKey}/audio`,
      method: 'POST',
      data: {
        audio: getAudioData
      }
    }).then((res) => {
      if (res?.data) {
        setTimeout((() => {
          axios({
            url: `https://screen-stag.fidisys.com/api/v1/files/${openVid?.videoKey}/makeVideo`,
            method: 'POST',
          }).then((res) => {
            alert("Video Created");
            setGetFinalData(res?.data?.data);
            if (res?.data?.data) {
              setLoading(false);
              setClosePreview(true);
            }
          })
        }), 5000);
      }
    })
  }

  console.log("getFinalData", getFinalData)


  const showPreviewPopFun = (arg) => {
    setGetFinalData(arg);
    setClosePreview(true);
  }
  return (
    <Fragment>
      {!openVid.open ?
        <div className='recording_list'>
          <h2 className='record_title'>Library</h2>
          <p className='description'>Manage all your videos here. You can record, edit and publish videos to the Library.</p>
          <div className='video_container'>
            {getVidData && getVidData?.map((item) => {
              return (
                <div className='video_tab' key={item?.title}>
                  <img src={item?.thumbnail_image} onClick={() => setVidOpen({
                    videoKey: item?.id,
                    open: true,
                    title: item?.title
                  })} />
                  <div className='vid_desc'>
                    <div className='video_desc_btns'>
                      <h3>{item?.title?.toUpperCase()}</h3>
                      <p><span style={{ color: '#ff193b', fontWeight: 'bold' }}>Days: </span> 2 days ago</p>
                    </div>
                    {item?.final_video &&
                      <p className='preview_btn' onClick={() => showPreviewPopFun(item?.final_video)}>Preview</p>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        :
        <div className='video_editor'>
          <div className='button_container'>
            <h1 className='video_editor_title'>{openVid?.title?.toUpperCase()}</h1>
            <div className='buttons'>
              <button className='exit' onClick={() => setVidOpen(!openVid)}>Exit Preview</button>
              <button className='publish' onClick={() => makeFinalVideo()}>Publish</button>
            </div>
          </div>
          <div className='video_editor_screen'>
            <div className='preview_sel_block'>
              {getProjectData?.images?.length && getProjectData?.images?.map((item, index) => {
                return (
                  <div className={selImage === index ? 'preview_sel_img_cont preview_sel_img_cont_seected' : 'preview_sel_img_cont'} key={item.id}>
                    <label>{index + 1}</label>
                    <img src={item?.image} className='prev_sel_img' onClick={() => { setImageLink(item?.image); setSelImage(index) }} />
                  </div>
                )
              })}
            </div>
            {getAudioData?.length && getAudioData?.map((item, index) => {
              return (
                selImage === index && <div className='video_prev_cont' key={item?.id}>
                  <div className='add_text_container'>
                    <h2 className='add_text_title'>Add Introductory Audio - Text to Speech</h2>
                    <input type="text" value={item?.text} onChange={((e) => updateAudioFun(e.target.value, index))} className='text_group' placeholder='Enter the text here that would be converted to speech (Use comma, line breaks for pausing)' />
                  </div>
                  <p className='intro_desc'>Introductory slide to set context to the users</p>
                  <img src={getProjectData?.images[index]?.image} className='video_preview' />
                </div>
              )
            })}
          </div>
        </div>
      }
      {loading &&
        <div className='loading'>
          loading....
        </div>
      }
      {closePreview &&
        <div className='preview_pop'>
          <p className='close_btn' onClick={() => setClosePreview(false)}>X</p>
          <div className='video_container'>
            <video width="320" height="240" controls className='video_main'>
              <source src={getFinalData} type="video/mp4" />
            </video>
          </div>
        </div>
      }
    </Fragment>
  );
}

export default App;