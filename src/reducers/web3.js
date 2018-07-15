import { WEB3_CONNECTED } from '../actions/web3';

const defaultState = {
  instance: null
}

const web3 = (state = defaultState, action) => {
  switch (action.type) {
  case WEB3_CONNECTED:
    return {
      ...state,
      instance: action.payload
    };
  default:
    return state;
  }
};

export default web3