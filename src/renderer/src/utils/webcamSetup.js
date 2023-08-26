import {
  store,
  setLocalStream,
  setMediaStreams,
  setVideoEnable,
  setIsProducer,
} from '../store';
const webcamError = 'Error accessing webcam';
export const onWebCam = (audio, video) => {
  const { defaultVideoOutputDevice, localStream } = store.getState().session;

  navigator.mediaDevices
    .getUserMedia({
      video:defaultVideoOutputDevice? {
        deviceId: { ideal: defaultVideoOutputDevice },
        width: {
          min: 560,
          max: 1920,
        },
        height: {
          min: 400,
          max: 1080,
        },
      }:undefined,
      audio: false,
      
    })
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
      store.dispatch(setMediaStreams(stream));
      store.dispatch(setIsProducer(true));
    })
    .catch((error) => {
      console.log(webcamError, error);
    });
};

export const setUpWebCam = () => {
  const { defaultVideoOutputDevice, localStream } = store.getState().session;
  if (localStream) {
    offWebCam();
  }
  navigator.mediaDevices
    .getUserMedia({
      video: defaultVideoOutputDevice
        ? {
            deviceId: { exact: defaultVideoOutputDevice },
            width: {
              min: 560,
              max: 1920,
            },
            height: {
              min: 400,
              max: 1080,
            },
          }
        : undefined,
      audio: false,
    })
    .then((stream) => {
      store.dispatch(setVideoEnable(true));
      store.dispatch(setLocalStream(stream));
      store.dispatch(setMediaStreams(stream));
    })
    .catch((error) => {
      console.log(webcamError, error);
    });
};

export const offWebCam = () => {
  const { localStream } = store.getState().session;

  if (localStream) {
    const tracks = localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    store.dispatch(setLocalStream(null));
  }
};
export const handleOnMic = (value) => {
  console.log(value);
  navigator.mediaDevices
    .getUserMedia({
      video: false,
      audio: true,
    })
    .then((stream) => {
      store.dispatch(setLocalStream(stream));
    })
    .catch((error) => {
      console.log(webcamError, error);
    });
};

export const handleOffMic = (value) => {
  const { localStream } = store.getState().session;
  if (localStream) {
    const tracks = localStream.getAudioTracks();
    tracks[0].stop();
  }
};

// const disableWebcam = () => {
//   const { isMicEnable } = store.getState().session;
//   const tracks = localStream.getTracks();
//   tracks.forEach((track) => {
//     track.stop();
//   });

//   if (isMicEnable) {
//     setUpWebCam(false, isMicEnable);
//   } else {
//     setLocalStream(null);
//   }
// };

const toggleCamera = () => {
  const { isMicEnable } = store.getState().session;
  // localStream.getVideoTracks()[0].enabled = isMicEnable;
};
export const enableMic = () => {
  const { localStream } = store.getState().session;
  localStream.getAudioTracks()[0].enabled = true;
};
export const disableMic = () => {
  // localStream.getAudioTracks()[0].enabled = false;
};

// const setUpWebCam = (video, audio) => {
//   if (video || audio) {
//     navigator.mediaDevices
//       .getUserMedia({
//         audio,
//         video: video
//           ? {
//               width: {
//                 min: 560,
//                 max: 1920,
//               },
//               height: {
//                 min: 400,
//                 max: 1080,
//               },
//             }
//           : video,
//       })
//       .then((mediaStream) => {
//         videoRef.current.srcObject = mediaStream;
//         setLocalStream(mediaStream);
//         dispatchReducer({
//           type: SET_VIDEO_AND_AUDIO_STREAM,
//           payload: mediaStream,
//         });

//         return mediaStream;
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
// };
