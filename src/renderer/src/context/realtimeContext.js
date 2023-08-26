import React, { createContext, useEffect, useState, useRef } from 'react';

import io from 'socket.io-client';
import { Device } from 'mediasoup-client';

import { logoutHandler } from '../utils/util';
import { useSelector, useDispatch } from 'react-redux';
import { params } from '../utils/mediasoup/params';
import { setRemoteSteam } from '../store';

const userDetails = JSON.parse(localStorage.getItem('user'));
let producerTransport;
let consumerTransport;
let audioProducer;
let videoProducer;
let consumer;
let socket;
if (userDetails) {
  socket = io('http://localhost:8080', {
    auth: {
      token: userDetails.token,
    },
  });
}
const device = new Device();
const RealtimeContext = createContext();

const RealtimeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isDevice, setIsDevice] = useState(false);
  const { videoParams } = useSelector((state) => {
    return state.session;
  });
  const connectWithSocketServer = () => {
    socket.on('connect', () => {
      console.log('successfully connected with socket.io server');
      console.log(socket.id);
    });
    socket.on('online-users', (value) => {
      console.log(value);
    });
    socket.on('connect_error', (err) => {
      console.log(err instanceof Error);
      console.log(err.message);
      console.log(err.data);
    });
  };

  useEffect(() => {
    if (!userDetails) {
      logoutHandler();
    }
    connectWithSocketServer();
  }, []);

  const createDevice = async (rtpCapabilities) => {
    try {
      await device.load({ routerRtpCapabilities: rtpCapabilities });
      console.log('Device RTP Capabilities', device.rtpCapabilities);
      setIsDevice(true);
    } catch (error) {
      console.log(error);
      if (error.name === 'UnsupportedError') {
        console.warn('browser not supported');
      }
    }
  };

  const createSendTransport = () => {
    socket.emit(
      'createWebRtcTransport',
      { sender: true },
      ({ serverParams }) => {
        if (serverParams.error) {
          console.log(serverParams.error);
          return;
        }

        console.log(serverParams);

        producerTransport = device.createSendTransport(serverParams);
        console.log('new producer transport');
        console.log(producerTransport);

        producerTransport.on(
          'connect',
          async ({ dtlsParameters }, callback, errback) => {
            try {
              await socket.emit('transport-connect', {
                dtlsParameters,
              });
              callback();
            } catch (error) {
              errback(error);
            }
          }
        );
        producerTransport.on(
          'produce',
          async (parameters, callback, errback) => {
            console.log(parameters);

            try {
              await socket.emit(
                'transport-produce',
                {
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                  appData: parameters.appData,
                },
                ({ id }) => {
                  // Tell the transport that parameters were transmitted and provide it with the
                  // server side producer's id.
                  callback({ id });
                }
              );
            } catch (error) {
              errback(error);
            }
          }
        );
      }
    );
  };

  const connectSendTransport = async () => {
    try {
      // audioProducer = await producerTransport.produce(state.audioParams);
      videoProducer = await producerTransport.produce(videoParams);
      console.log('video producer created');
      console.log(videoProducer);
      // audioProducer.on('trackended', () => {
      //   console.log('audio track ended');

      //   // close audio track
      // });

      // audioProducer.on('transportclose', () => {
      //   console.log('audio transport ended');

      //   // close audio track
      // });

      videoProducer.on('trackended', () => {
        console.log('video track ended');

        // close video track
      });

      videoProducer.on('transportclose', () => {
        console.log('video transport ended');
        // close video track
      });
    } catch (error) {
      console.log('Error occur when producing transport');
      console.log(error);
    }
  };

  const createRecvTransport = async () => {
    await socket.emit(
      'createWebRtcTransport',
      { sender: false },
      ({ serverParams }) => {
        if (serverParams.error) {
          console.log(serverParams.error);
          return;
        }

        console.log(params);
        consumerTransport = device.createRecvTransport(serverParams);
        console.log('new consumer transport created');
        consumerTransport.on(
          'connect',
          async ({ dtlsParameters }, callback, errback) => {
            try {
              await socket.emit('transport-recv-connect', {
                dtlsParameters,
              });
              callback();
            } catch (error) {
              errback(error);
            }
          }
        );
      }
    );
  };

  const connectRecvTransport = async () => {
    await socket.emit(
      'consume',
      {
        rtpCapabilities: device.rtpCapabilities,
      },
      async ({ serverParams }) => {
        if (serverParams.error) {
          console.log(serverParams.error);
          return;
        }
        console.log(`Consumer Params ${serverParams}`);

        consumer = await consumerTransport.consume({
          id: serverParams.id,
          producerId: serverParams.producerId,
          kind: serverParams.kind,
          rtpParameters: serverParams.rtpParameters,
        });
        const { track } = consumer;
        dispatch(setRemoteSteam(new MediaStream([track])));
        socket.emit('consumer-resume');
      }
    );
  };

  const values = {
    socket,
    createDevice,
    createSendTransport,
    isDevice,
    connectSendTransport,
    createRecvTransport,
    connectRecvTransport,
  };

  return (
    <RealtimeContext.Provider value={values}>
      {children}
    </RealtimeContext.Provider>
  );
};

export { RealtimeProvider };
export default RealtimeContext;
