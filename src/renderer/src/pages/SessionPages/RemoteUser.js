import React, { useEffect, useRef } from 'react';

const RemoteUser = ({ track }) => {
  const videoRef = useRef();
  const audioRef = useRef();
  useEffect(() => {
    console.log(track);
    videoRef.current.srcObject = track;
    audioRef.current.srcObject = track;
  }, [track]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        className="h-auto bg-blue-900 max-w-full "
      ></video>
      <audio ref={audioRef} autoPlay></audio>
    </div>
  );
};

export default RemoteUser;
