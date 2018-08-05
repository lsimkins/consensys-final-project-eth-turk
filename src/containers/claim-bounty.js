import React, { Component } from 'react'
import { Input, Button } from 'antd';
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { submitBountyClaim } from '../actions/bounty';

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
    if (!props.bounty) {
      return;
    }

    const reward = await props.bounty.reward.call();
    const description = await props.bounty.description.call();

    this.setState({ reward, description });
  }

  setProof = (changeEvent) => {
    this.setState({
      proof: changeEvent.target.value
    });
  }

  onSubmit = () => {
    this.props.submitBountyClaim(
      this.props.bounty.address,
      this.state.proof
    );
  }

  render() {
    if (!this.props.bounty) {
      return <h2>Bounty Does not Exist</h2>;
    }

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
          <Input onChange={this.setProof} type="text" />
        </div>
        <div>
          <Button onClick={this.onSubmit}>Submit Claim</Button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  submitBountyClaim
}

const mapStateToProps = (state, ownProps) => {
  return {
    bounty: state.bounty.contracts[ownProps.routeParams.address]
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClaimBounty))