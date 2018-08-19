import Web3 from 'web3';

export const WEB3_CONNECTED = 'WEB3_CONNECTED';
export const WEB3_DISCONNECTED = 'WEB3_DISCONNECTED';
export const WEB3_SET_ACTIVE_ACCOUNT = 'WEB3_SET_ACTIVE_ACCOUNT';

export function web3connect() {
  return (dispatch, getState) => {
    const web3Global = window.web3;
    let web3;

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3Global !== 'undefined') {
      web3 = new Web3(web3Global.currentProvider);
      // Use Mist/MetaMask's provider.
      dispatch({
        type: WEB3_CONNECTED,
        payload: web3
      });
    } else {
      web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
      dispatch({
        type: WEB3_CONNECTED,
        payload: web3
      });
    }

    // Far from ideal, but gets the job done for this prototype.
    setInterval(function() {
      const state = getState();
      if (state.web3.activeAccount !== web3.eth.accounts[0]) {
        dispatch({
          type: WEB3_SET_ACTIVE_ACCOUNT,
          payload: web3.eth.accounts[0]
        });
      }
    }, 2000);
  };
}