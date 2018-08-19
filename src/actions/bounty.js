export const BOUNTY_CONTRACT_CREATED = 'BOUNTY_CONTRACT_CREATED';
export const SUBMIT_BOUNTY_CLAIM = 'SUBMIT_BOUNTY_CLAIM';

export function submitBountyClaim(address, validation) {
  return async (dispatch, getState) => {
    const state = getState();
    const contract = state.bounty.contracts[address];
    const web3 = getState().web3.instance;

    await contract.submitClaim(validation, { from: web3.eth.accounts[0] });
  }
}

export function acceptBountyClaim(bountyAddress, claimAddress) {
  return async (dispatch, getState) => {
    const state = getState();
    const contract = state.bounty.contracts[bountyAddress];
    const web3 = getState().web3.instance;

    await contract.acceptClaim(claimAddress, { from: web3.eth.accounts[0] });
  }
}

export function collectReward(bountyAddress) {
  return async (dispatch, getState) => {
    const state = getState();
    const contract = state.bounty.contracts[bountyAddress];
    const web3 = getState().web3.instance;

    await contract.sendAward({ from: web3.eth.accounts[0] });
  }
}