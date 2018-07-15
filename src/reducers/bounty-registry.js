import { WEB3_CONNECTED } from '../actions/web3';
import { BOUNTY_REGISTRY_CONTRACT_INSTANTATED } from '../actions/bounty-registry';

const defaultState = {
  contract: null
}

const bountyRegistry = (state = defaultState, action) => {
  console.log(action, state);
  switch (action.type) {
  case BOUNTY_REGISTRY_CONTRACT_INSTANTATED:
    return {
      ...state,
      contract: action.payload
    };
  default:
    return state;
  }
};

export default bountyRegistry