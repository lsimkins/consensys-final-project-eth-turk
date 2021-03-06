import contract from 'truffle-contract';
import BountyRegistryContract from '../../build/contracts/BountyRegistry.json';
import Bounty from '../../build/contracts/Bounty.json';
import { BOUNTY_CONTRACT_CREATED } from './bounty';
import { notification } from 'antd';

export const BOUNTY_REGISTRY_CONTRACT_INSTANTATED = 'BOUNTY_REGISTRY_CONTRACT_INSTANTATED'

export function instantiateBountyContract() {
  let web3, dispatch, getState;

  return async (_dispatch, _getState) => {
    dispatch = _dispatch
    getState = _getState
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

      if (!getState().bounty.contracts[result.args.contractAddress]) {
        notification.success({
          message: 'New Bounty Created!',
          description: result.args.contractAddress
        });
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

    if (!contractRegistry) {
      window.alert("No registry found! Are you logged into MetaMask and is the registry deployed?");
    }

    contractRegistry.createBounty(
      reward,
      description,
      timeLimit,
      { from: web3.eth.accounts[0], value: reward }
    );
  }
}