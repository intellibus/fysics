import { Draft, Patch } from 'immer';

export declare type DispatchAction<Payload> = {
  name: string;
  payload?: Payload;
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
  scope?: string | Array<string>;
  reducer: Reducer<State, Payload, SagaResponse>;
  saga?: Saga<State, Payload, SagaResponse>;
};

export declare type Logic<State, Payload, SagaResponse> = {
  initialState: State;
  actions: {
    [ACTION_NAME: string]: Action<State, Payload, SagaResponse>;
  };
};

export declare type TimelineEvent<Payload> = {
  action: DispatchAction<Payload>;
  patches: Array<Patch>;
  inversePatches: Array<Patch>;
};

export declare type FullState<State, Payload> = {
  past: Array<TimelineEvent<Payload>>;
  present: State;
  future: Array<TimelineEvent<Payload>>;
};
