import React, { Component } from 'react'
import { BountyStages } from '../models/BountyStage';
import { isExpired } from '../util/bounty';
import CountDown from './count-down';

class BountyListItem extends Component {
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
    // Prototype code
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
    const { description, reward, endTime, numberClaims, stage } = this.state;
    return (
      <li className="bounty-row">
        <div className="bounty-row-actions" style={{ padding: '6px' }}>
          { this.props.children }
        </div>
        <div className="bounty-row-data">
          <div className="bounty-description bounty-datum">
            { description }
          </div>

          <div className="bounty-reward bounty-datum" >
            <strong>Reward </strong>
            <span>{ reward && (reward.toString() + " Wei")}</span>
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
                  <CountDown endTime={endTime} />
              }
            </span>
          </div>

          <div className="bounty-claims bounty-datum" >
            <strong>Number of Claims </strong>
            <span>{ numberClaims && numberClaims.toString() }</span>
          </div>
        </div>
      </li>
    );
  }
}

export default BountyListItem