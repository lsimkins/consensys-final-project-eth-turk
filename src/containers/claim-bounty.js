import React, { Component } from 'react'
import { Input, Button } from 'antd';
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { submitBountyClaim } from '../actions/bounty';

class ClaimBounty extends Component {
  state = {
    reward: null,
    description: null,
    owner: null
  };

  constructor(props) {
    super(props);

    this.updateState(props);
  }

  get isOwner() {
    return this.state.owner === this.props.activeAccount;
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
    const owner = await props.bounty.owner.call();

    this.setState({ reward, description, owner });
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
      <div className="claim-bounty bounty-card">
        <h2>Claim Bounty</h2>
        { this.isOwner && <h3>This is your bounty!</h3>}
        <div className="bounty-description">
          { this.state.description }
        </div>
        <div className="bounty-reward" >
          <strong>Reward:</strong>
          <span>{ this.state.reward && this.state.reward.toString() }</span>
        </div>
        { !this.isOwner &&
          <div>
            <strong>Proof</strong>
            <Input onChange={this.setProof} type="text" />
          </div>
        }
        <div>
          <Button onClick={this.onSubmit} disabled={this.isOwner}>Submit Claim</Button>
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
    activeAccount: state.web3.instance ? state.web3.instance.eth.accounts[0] : null
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClaimBounty))