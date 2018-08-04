import React, { Component } from 'react'

class ClaimBounty extends Component {
  state = {
    reward: null,
    description: null,
  };

  constructor(props) {
    super(props);

    this.updateState(props);
  }

  componentWillReceiveProps(props) {
    this.updateState(props);
  }

  async updateState(props) {
    const reward = await props.bounty.reward.call();
    const description = await props.bounty.description.call();

    this.setState({ reward, description });
  }

  render() {
    return (
      <div className="claim-bounty">
        <h2>Claim Bounty</h2>
        <div className="bounty-description">
          { this.state.description }
        </div>
        <div className="bounty-reward" >
          <strong>Reward:</strong>
          <span>{ this.state.reward && this.state.reward.toString() }</span>
        </div>
        <div>
          <strong>Proof</strong>
          <input type="text" />
        </div>
        <div>
          <button>Submit Claim</button>
        </div>
      </div>
    );
  }
}

export default ClaimBounty