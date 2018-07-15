import { WEB3_CONNECTED } from '../actions/web3';
import { BOUNTY_REGISTRY_CONTRACT_INSTANTATED } from '../actions/bounty-registry';

const defaultState = {
  contract: null
}

const bountyRegistry = (state = defaultState, action) => {
  switch (action.type) {
  case BOUNTY_REGISTRY_CONTRACT_INSTANTATED:
    return {
      ...state,
      instance: action.payload
    };
  default:
    return state;
  }
};

export default bountyRegistry