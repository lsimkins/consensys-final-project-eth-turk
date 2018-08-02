import contract from 'truffle-contract';
import BountyRegistryContract from '../../build/contracts/BountyRegistry.json';
import Bounty from '../../build/contracts/Bounty.json';
import { BOUNTY_CONTRACT_CREATED } from './bounty';

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
    });

    const creationEvent = registryContract.BountyCreated();

    creationEvent.watch(async (err, result) => {
      if (err) {
        // TODO: Error handling
        return;
      }

      const newBountyAddress = result.args.contractAddress;
      const bountyContract = contract(Bounty);
      bountyContract.setProvider(web3.currentProvider);
      const newContract = await bountyContract.at(newBountyAddress);

      dispatch({
        type: BOUNTY_CONTRACT_CREATED,
        payload: newContract
      });
    });
  };
}

export function createBounty(bountyParams) {
  console.log(bountyParams);
  const { reward, description, timeLimit } = bountyParams;

  return async (dispatch, getState) => {
    const state = getState();
    const web3 = state.web3.instance;
    const contractRegistry = state.bountyRegistry.contract;

    const result = await contractRegistry.createBounty(reward, description, timeLimit, { from: web3.eth.accounts[0] });

    console.log(result);


    // const result = await contractRegistry.createBounty(reward, description, timeLimit);

    // console.log(result);

    // const newAddress = await contractRegistry.createBounty.call(reward, description, timeLimit);

    // console.log(newAddress);

    // const bounty = await contract(Bounty)
    // bounty.setProvider(web3.currentProvider)
    // const newContract = await bounty.at(newAddress)

    // console.log(newContract);

  }
}