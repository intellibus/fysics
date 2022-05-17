import { Draft } from 'immer';

export declare type DispatchAction<PayloadType> = {
  name: string;
  payload?: PayloadType;
};

export declare type Reducer<State, Payload, SagaResponse> = (
  state: Draft<State>,
  payload: Payload,
  sagaResponse?: SagaResponse,
) => void;

export declare type Saga<State, Payload, SagaResponse> = (
  state: State,
  payload: Payload,
) => Promise<SagaResponse>;

export declare type Action<State, Payload, SagaResponse> = {
  skipUndo?: boolean;
  reducer: Reducer<State, Payload, SagaResponse>;
  saga?: Saga<State, Payload, SagaResponse>;
};

export declare type Logic<State, Payload, SagaResponse> = {
  initialState: State;
  actions: {
    [ACTION_NAME: string]: Action<State, Payload, SagaResponse>;
  };
};
