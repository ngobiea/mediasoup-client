import React, { useContext, useEffect, useRef } from 'react';
import RealtimeContext from '../../context/realtimeContext';
import { useNavigate } from 'react-router-dom';
import { onWebCam } from '../../utils/webcamSetup';
import { useSelector, useDispatch } from 'react-redux';


const ProducerConsumer = () => {

  const videoRef = useRef();
  const remoteRef = useRef();
  const navigate = useNavigate();
  const {
    createSendTransport,
    createRecvTransport,
  } = useContext(RealtimeContext);
  const { localStream, remoteStream } = useSelector((state) => {
    return state.session;
  });
  useEffect(() => {
    // createRecvTransport();
  }, []);
  const handleBack = () => {
    navigate('/');
  };
  useEffect(() => {
    if (localStream) {
      videoRef.current.srcObject = localStream;
    }
    if (remoteStream) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);
  const handleProduce = async () => {
    createSendTransport();
  };
  const handleConsume = () => {
    createRecvTransport()
  };

  return (
    <div className="flex w-screen flex-col h-screen justify-center items-center">
      <div className=" mb-10">
        <button
          onClick={handleBack}
          className=" bg-red-400 px-5 py-1 text-white rounded"
        >
          Back
        </button>
      </div>
      <div className="flex">
        <div className=" flex flex-col mr-3 ">
          <video
            ref={videoRef}
            className="border-green-500 border"
            autoPlay
          ></video>
          <div className="flex">
            <button
              onClick={onWebCam}
              className="p-2 bg-sidebarHover mx-20 mt-2 text-white rounded"
            >
              On webcam
            </button>
            <button
              onClick={handleProduce}
              className="p-2 bg-sidebarHover mx-20 mt-2 text-white rounded"
            >
              Produce
            </button>
            <button
              onClick={handleConsume}
              className="p-2 bg-sidebarHover mx-20 mt-2 text-white rounded"
            >
              Consume
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <video
            ref={remoteRef}
            className="border-green-500 border"
            autoPlay
          ></video>
          <div className="flex">
            <button
              onClick={onWebCam}
              className="p-2 bg-sidebarHover mx-20 mt-2 text-white rounded"
            >
              On webcam
            </button>
            <button
              onClick={handleProduce}
              className="p-2 bg-sidebarHover mx-20 mt-2 text-white rounded"
            >
              Produce
            </button>
            <button
              onClick={handleConsume}
              className="p-2 bg-sidebarHover mx-20 mt-2 text-white rounded"
            >
              Consume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerConsumer;
