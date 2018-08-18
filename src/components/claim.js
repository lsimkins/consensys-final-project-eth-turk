import React, { Component } from 'react'
import { Button } from 'antd';
import { connect } from 'react-redux';
import { acceptBountyClaim } from '../actions/bounty';
import {
  BountyStages
} from '../models/BountyStage';

class BountyClaim extends Component {
  state = {
    address: null,
    proof: null,
    isActive: null,
    stage: null,
    endTime: null
  };

  constructor(props) {
    super(props);

    this.updateState(props);
  }

  get canAcceptClaim() {
    return parseInt(this.state.endTime - (Date.now()/1000), 10) < 0;
  }

  componentWillReceiveProps(props) {
    this.updateState(props);
  }

  onAcceptClicked() {
    this.props.acceptBountyClaim(
      this.props.bounty.address,
      this.props.claimAddress
    );
  }

  async updateState(props) {
    const [ address, proof, isActive ] = await props.bounty.findClaim(props.claimAddress);
    const stage = await props.bounty.stage.call();
    const endTime = await props.bounty.endTime.call();

    this.setState({
      address,
      proof,
      isActive,
      stage: BountyStages[stage],
      endTime
    });
  }

  render() {
    return (
      <div>
        <div><strong>Completion Proof</strong></div>
        <span>{ this.state.proof }</span>
        <div>
          <Button
            onClick={() => this.onAcceptClicked()}
            disabled={ !this.canAcceptClaim }
          >
            Accept Claim { !this.canAcceptClaim ? "(Not ended yet)" : null}
          </Button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  acceptBountyClaim
}

const mapStateToProps = (state, ownProps) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(BountyClaim)