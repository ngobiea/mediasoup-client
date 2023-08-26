import { createSlice } from '@reduxjs/toolkit';
import { Device } from 'mediasoup-client';

const mediasoupSlice = createSlice({
  name: 'mediasoup',
  initialState: {
    device: new Device(),
    producerTransport: [],
  },
  reducers: {
    setProducerTransport(state, action) {
      state.producerTransport.push(action.payload);
    },
  },
});

export const { setProducerTransport } = mediasoupSlice.actions;
export const mediasoupReducer = mediasoupSlice.reducer;
