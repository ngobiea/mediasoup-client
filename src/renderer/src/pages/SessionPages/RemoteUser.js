import React, { useEffect, useRef } from 'react';

const RemoteUser = ({ track }) => {
  const videoRef = useRef();
  const audioRef = useRef();
  useEffect(() => {
    videoRef.current.srcObject = track;
    audioRef.current.srcObject = track;
  }, [track]);

  return (
    <div>
      <video ref={videoRef} className="h-auto bg-blue-900 max-w-full "></video>
      <audio ref={audioRef}></audio>
    </div>
  );
};

export default RemoteUser;
