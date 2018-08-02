import React, { Component } from 'react'
import { connect } from 'react-redux'

class Bounty extends Component {
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
      <div className="bounty-row">
        <div style={{ float: 'left', marginRight: '8px' }}>
          <button>Claim</button>
        </div>

        <div className="bounty-description">
          { this.state.description }
        </div>

        <div className="bounty-reward" >
          <strong>Reward: </strong>
          <span>{ this.state.reward && this.state.reward.toString() }</span>
        </div>
      </div>
    );
  }
}

export default Bounty