import React, { Component } from 'react'
import { BountyStages } from '../models/BountyStage';
import { addressIsSet, isExpired } from '../util/bounty';

class BountyCard extends Component {
  state = {
    reward: null,
    description: null,
    address: null,
    numberClaims: null,
    endTime: null,
    winner: null
  };

  watchers = [];

  componentWillMount() {
    this.updateState(this.props);
    this.watchers = [
      this.props.bounty.StageChanged().watch(() => this.updateState(this.props)),
      this.props.bounty.BountyWon().watch(() => this.updateState(this.props)),
      this.props.bounty.NewBountyClaim().watch(() => this.updateState(this.props))
    ];
  }

  componentWillUnmount() {
    this.watchers.forEach(watcher => watcher.stopWatching());
    this.watchers = [];
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
    const { description, reward, endTime, numberClaims, winner, stage, address } = this.state;
    return (
      <div className="bounty-card">
        <div className="bounty-address">
          <strong>{ address }</strong>
        </div>

        <div className="bounty-reward bounty-datum" >
          <strong>Reward </strong>
          <span>{ reward && (reward.toString() + " Wei") }</span>
        </div>

        <div className="bounty-ends-in bounty-datum" >
          <strong>Current Stage </strong>
          <span>{ stage }</span>
        </div>

        <div className="bounty-ends-in bounty-datum" >
          <strong>Ends In </strong>
          <span>
            {
              isExpired(endTime) ?
                "Bounty Ended!" :
                this.secondsUntilEnd + " seconds"
            }
          </span>
        </div>

        <div className="bounty-claims bounty-datum" >
          <strong>Number of Claims </strong>
          <span>{ numberClaims && numberClaims.toString() }</span>
        </div>

        <div className="bounty-reward bounty-datum" >
          <strong>Winner </strong>
          <span>
            {  winner && addressIsSet(winner) ? winner.toString() : 'N/A' }
          </span>
        </div>

        <div className="bounty-description">
          <strong>Description </strong><br/>
          { description }
        </div>

        <div style={{ padding: '6px' }}>
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default BountyCard