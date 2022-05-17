import { test } from 'uvu';
import { createStore, Logic } from '../../src';

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

test('Initialize Store', async () => {
  type StateType = { count: number };
  type PayloadType = { amount: number | undefined };
  const LOGIC: Logic<StateType, PayloadType, unknown> = {
    initialState: { count: 0 },
    actions: {
      INCREMENT: {
        reducer: (state, payload) => {
          state.count += payload?.amount ?? 1;
        },
      },
      DECREMENT: {
        reducer: (state, payload) => {
          state.count -= payload?.amount ?? 1;
        },
      },
      INCREMENT_ASYNC: {
        skipUndo: true,
        saga: async () => {
          await delay(50);
          return 50;
        },
        reducer: (state, payload, sagaResponse: number) => {
          state.count += sagaResponse ?? 1;
        },
      },
      DECREMENT_ASYNC: {
        skipUndo: true,
        saga: async () => {
          await delay(50);
          return 50;
        },
        reducer: (state, payload, sagaResponse: number) => {
          state.count -= sagaResponse ?? 1;
        },
      },
    },
  };
  const STORE = createStore(LOGIC);
  STORE.dispatch({ name: 'INCREMENT' });
});

test.run();
