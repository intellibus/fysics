import { Logic } from '../../src';

export const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

type StateType = { count: number; count2: number };
type PayloadType = { amount: number | undefined };

export const LOGIC: Logic<StateType, PayloadType, number> = {
  initialState: { count: 0, count2: 0 },
  actions: {
    INCREMENT: {
      reducer: (state, payload) => {
        state.count += payload?.amount ?? 1;
      },
    },
    INCREMENT2: {
      skipUndo: true,
      reducer: (state, payload) => {
        state.count2 += payload?.amount ?? 1;
      },
    },
    INCREMENT_ASYNC: {
      saga: async (state, payload) => {
        await delay(50);
        return payload?.amount ?? 1;
      },
      reducer: (state, payload, sagaResponse) => {
        state.count += sagaResponse ?? 1;
      },
    },
    INCREMENT2_ASYNC: {
      skipUndo: true,
      saga: async (state, payload) => {
        await delay(50);
        return payload?.amount ?? 1;
      },
      reducer: (state, payload, sagaResponse) => {
        state.count2 += sagaResponse ?? 1;
      },
    },
  },
};
