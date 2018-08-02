import { BOUNTY_CONTRACT_CREATED } from '../actions/bounty';

const defaultState = {
  contracts: {}
}

const bounty = (state = defaultState, action) => {
  switch (action.type) {
    case BOUNTY_CONTRACT_CREATED:
    return {
      ...state,
      contracts: {
        ...state.contracts,
        [action.payload.address]: action.payload,
      }
    };
  default:
    return state;
  }
};

export default bounty