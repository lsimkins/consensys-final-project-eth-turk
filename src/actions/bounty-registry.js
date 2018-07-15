import Web3 from 'web3';
import contract from 'truffle-contract';
import BountyRegistryContract from '../../build/contracts/BountyRegistry.json';
import BountyContract from '../../build/contracts/Bounty.json';

export const BOUNTY_REGISTRY_CONTRACT_INSTANTATED = 'BOUNTY_REGISTRY_CONTRACT_INSTANTATED'

export function instantiateBountyContract() {
  return async (dispatch, getState) => {
    const web3 = getState().web3.instance;
    const bountyRegistry = contract(BountyRegistryContract);

    bountyRegistry.setProvider(web3.currentProvider);
    const registryContract = await bountyRegistry.deployed();
    dispatch({
      type: BOUNTY_REGISTRY_CONTRACT_INSTANTATED,
      payload: registryContract
    })
  };
}