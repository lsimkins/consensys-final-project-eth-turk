import { WEB3_CONNECTED, WEB3_SET_ACTIVE_ACCOUNT } from '../actions/web3';

const defaultState = {
  instance: null,
  activeAccount: null
}

const web3 = (state = defaultState, action) => {
  switch (action.type) {
  case WEB3_CONNECTED:
    const web3Instance = action.payload;
    return {
      ...state,
      instance: web3Instance,
      activeAccount: web3Instance && web3Instance.eth ? web3Instance.eth.accounts[0] : null
    };
  case WEB3_SET_ACTIVE_ACCOUNT:
    return {
      ...state,
      activeAccount: action.payload
    };
  default:
    return state;
  }
};

export default web3