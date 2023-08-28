import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import SessionControl from './SessionControl';
import SessionView from './SessionView';
const ClassSession = () => {
  const { localStream } = useSelector((state) => {
    return state.session;
  });
  useEffect(() => {}, []);

  return (
    <>
      {localStream && (
        <div className="relative pt-10 h-screen overflow-hidden">
          <SessionControl />
          <SessionView />
        </div>
      )}
    </>
  );
};

export default ClassSession;
