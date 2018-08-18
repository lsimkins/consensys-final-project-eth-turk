import React, { Component } from 'react'
import { BountyStages } from '../models/BountyStage';
import { addressIsSet, isExpired } from '../util/bounty';

class Bounty extends Component {
  state = {
    reward: null,
    description: null,
    address: null,
    numberClaims: null,
    endTime: null,
    winner: null
  };

  constructor(props) {
    super(props);

    this.updateState(props);
  }

  componentWillReceiveProps(props) {
    this.updateState(props);
  }

  get secondsUntilEnd() {
    return parseInt(this.state.endTime - (Date.now()/1000), 10);
  }

  async updateState(props) {
    const reward = await props.bounty.reward.call();
    const description = await props.bounty.description.call();
    const numberClaims = await props.bounty.numberClaims.call();
    const endTime = await props.bounty.endTime.call();
    const winner = await props.bounty.winner.call();
    const stage = await props.bounty.stage.call();
    const address = props.bounty.address;

    this.setState({
      reward,
      description,
      address,
      numberClaims,
      endTime,
      winner,
      stage: BountyStages[stage]
    });
  }

  render() {
    const { description, reward, endTime, numberClaims, winner, stage } = this.state;
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
          <strong>Current Stage: </strong>
          <span>{ stage }</span>
        </div>

        <div className="bounty-ends-in" >
          <strong>Ends In: </strong>
          <span>
            {
              isExpired(endTime) ?
                "Bounty Ended!" :
                this.secondsUntilEnd + " seconds"
            }
          </span>
        </div>

        <div className="bounty-claims" >
          <strong>Number of Claims: </strong>
          <span>{ numberClaims && numberClaims.toString() }</span>
        </div>

        <div className="bounty-reward" >
          <strong>Winner: </strong>
          <span>
            {  winner && addressIsSet(winner) ? winner.toString() : 'N/A' }
          </span>
        </div>

        <div style={{ padding: '6px' }}>
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default Bounty