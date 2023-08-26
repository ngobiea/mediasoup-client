import React, { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ClassSessionSetup from './pages/SessionPages/ClassSessionSetup';
import ClassSession from './pages/SessionPages/ClassSession';
import TitleNav from './components/TitleNav';
import ProducerConsumer from './pages/SessionPages/ProducerConsumer';
import RealtimeContext from './context/realtimeContext';
const SessionApp = () => {
  const { createDevice, socket, isDevice } = useContext(RealtimeContext);
  useEffect(() => {
    socket.emit('createSession', ({ rtpCapabilities }) => {
      createDevice(rtpCapabilities);
    });
  }, []);
  return (
    <>
      <TitleNav />
      {isDevice && (
        <Routes>
          <Route path="/" element={<ClassSessionSetup />} />
          <Route path=":sessionId" element={<ClassSession />} />
          <Route path="pc" element={<ProducerConsumer />} />
        </Routes>
      )}
    </>
  );
};

export default SessionApp;
