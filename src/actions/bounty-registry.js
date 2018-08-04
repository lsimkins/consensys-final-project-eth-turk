import contract from 'truffle-contract';
import BountyRegistryContract from '../../build/contracts/BountyRegistry.json';
import Bounty from '../../build/contracts/Bounty.json';
import { BOUNTY_CONTRACT_CREATED } from './bounty';

export const BOUNTY_REGISTRY_CONTRACT_INSTANTATED = 'BOUNTY_REGISTRY_CONTRACT_INSTANTATED'

export function instantiateBountyContract() {
  let web3, dispatch;

  return async (_dispatch, getState) => {
    dispatch = _dispatch
    web3 = getState().web3.instance;
    const bountyRegistry = contract(BountyRegistryContract);
    bountyRegistry.setProvider(web3.currentProvider);
    const registryContract = await bountyRegistry.deployed();

    dispatch({
      type: BOUNTY_REGISTRY_CONTRACT_INSTANTATED,
      payload: registryContract
    });

    const allBounties = await registryContract.getBounties();
    allBounties.forEach(address => addBountyContract(address));

    startBountyCreationListener(registryContract, web3, dispatch);
  };

  async function startBountyCreationListener(registryContract) {
    const creationEvent = registryContract.BountyCreated();

    creationEvent.watch(async (err, result) => {
      if (err) {
        // TODO: Error handling
        return;
      }

      addBountyContract(result.args.contractAddress)
    });
  }

  async function addBountyContract(address) {
    const bountyContract = contract(Bounty);
    bountyContract.setProvider(web3.currentProvider);
    const newContract = await bountyContract.at(address);

    dispatch({
      type: BOUNTY_CONTRACT_CREATED,
      payload: newContract
    });
  }
}

export function createBounty(bountyParams) {
  const { reward, description, timeLimit } = bountyParams;

  return (dispatch, getState) => {
    const state = getState();
    const web3 = state.web3.instance;
    const contractRegistry = state.bountyRegistry.contract;

    contractRegistry.createBounty(reward, description, timeLimit, { from: web3.eth.accounts[0] });
  }
}