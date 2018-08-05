import React, { Component } from 'react'
import { Button } from 'antd';
import { Link } from 'react-router';

class Bounty extends Component {
  state = {
    reward: null,
    description: null,
    address: null,
    numberClaims: null,
    endTime: null
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
    const numberClaims = await props.bounty.numberClaims.call();
    const endTime = await props.bounty.endTime.call();
    const address = props.bounty.address;

    this.setState({ reward, description, address, numberClaims, endTime });
  }

  render() {
    const { address, description, reward, endTime, numberClaims } = this.state;
    return (
      <div className="bounty-row">

        <div className="bounty-description">
          { description }
        </div>

        <div className="bounty-reward" >
          <strong>Reward: </strong>
          <span>{ reward && reward.toString() }</span>
        </div>

        <div className="bounty-ends-in" >
          <strong>Ends In: </strong>
          <span>{ parseInt(endTime - (Date.now()/1000)) } seconds</span>
        </div>

        <div className="bounty-claims" >
          <strong>Number of Claims: </strong>
          <span>{ numberClaims && numberClaims.toString() }</span>
        </div>

        <div style={{ padding: '6px' }}>
          <Button style={{ width: '200px' }}>
            <Link to={`/task/claim/${address}`}>Claim</Link>
          </Button>
        </div>
      </div>
    );
  }
}

export default Bounty