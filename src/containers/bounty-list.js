import React, { Component } from 'react'
import { connect } from 'react-redux'
import Bounty from '../components/bounty'
import { values } from 'lodash';
import { Button } from 'antd';
import { Link } from 'react-router';
import { collectReward } from '../actions/bounty';
import { BountyStages, CLOSED_AWAITING_WITHDRAWAL, ACCEPTING_CLAIMS } from '../models/BountyStage';

class BountyList extends Component {
  state = {
    bounties: []
  }

  componentWillReceiveProps(props) {
    this.updateState(props);
  }

  componentWillMount() {
    this.updateState(this.props);
  }

  get title() {
    if (this.props.context === 'review') {
      return "My Bounties";
    } else {
      return "All Bounties";
    }
  }

  async updateState(props) {
    const bountyContracts = props.bounties;
    const { owner } = props;
    let bounties = [];
    // Note: this is a quick and dirty method of doing this for a project.
    // These blocks with async calls and duplicate code
    // should never happen in a production application.
    if (this.props.context === 'review') {
      for (let i = 0; i < bountyContracts.length; i++) {
        const bountyOwner = await bountyContracts[i].owner.call();
        if (bountyOwner === owner) {
          bounties.push({
            contract: bountyContracts[i],
            bountyOwner
          });
        }
      }
    } else if (this.props.context === 'won') {
      for (let i = 0; i < bountyContracts.length; i++) {
        const bountyWinner = await bountyContracts[i].winner.call();
        if (bountyWinner === owner) {
          bounties.push({
            contract: bountyContracts[i],
            stage: await bountyContracts[i].stage.call(),
            winner: bountyWinner
          });
        }
      }
    } else {
      for (let i = 0; i < bountyContracts.length; i++) {
        bounties.push({
          contract: bountyContracts[i],
          stage: await bountyContracts[i].stage.call(),
          winner: await bountyContracts[i].winner.call()
        });
      }
    }

    this.setState({ bounties });
  }

  renderBountyContent = (bounty) => {
    if (this.props.context === 'review') {
      return (
        <Button style={{ width: '200px' }}>
          <Link to={`/task/review-claims/${bounty.contract.address}`}>Review Claims</Link>
        </Button>
      );
    } else if (this.props.context === 'won') {
      return (
        <Button
          onClick={() => this.props.collectReward(bounty.contract.address)}
          style={{ width: '200px' }}
          disabled={ BountyStages[bounty.stage] !== CLOSED_AWAITING_WITHDRAWAL }
        >
          Collect Reward
        </Button>
      );
    } else {
      return (
        <Button
          style={{ width: '200px' }}
          disabled={ BountyStages[bounty.stage] !== ACCEPTING_CLAIMS }
        >
          <Link to={`/task/claim/${bounty.contract.address}`}>Claim</Link>
        </Button>
      );
    }
  }

  renderBounty = (bounty) => {
    return (
      <Bounty key={bounty.contract.address} bounty={bounty.contract}>
        { this.renderBountyContent(bounty) }
      </Bounty>
    );
  }

  render() {
    const { bounties } = this.state;
    return (
      <div>
        <h2>{ this.title }</h2>
        { !bounties.length && <h3>No bounties to show</h3>}
        { !!bounties.length && bounties.map(this.renderBounty) }
      </div>
    );
  }
}

const mapDispatchToProps = {
  collectReward
}

const mapStateToProps = (state) => ({
  bounties: values(state.bounty.contracts),
  owner: state.web3.instance ? state.web3.instance.eth.accounts[0] : null
})

export default connect(mapStateToProps, mapDispatchToProps)(BountyList)
