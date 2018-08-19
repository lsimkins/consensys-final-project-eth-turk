import React, { Component } from 'react';
import { connect } from 'react-redux';
import { values } from 'lodash';
import { Button, List } from 'antd';
import { collectReward } from '../actions/bounty';
import { BountyStages, CLOSED_AWAITING_WITHDRAWAL, ACCEPTING_CLAIMS, CLOSED_FINALIZED } from '../models/BountyStage';
import BountyListItem from '../components/bounty-list-item';
import { isExpired } from '../util/bounty';

export const BOUNTY_LIST_FILTER = {
  ALL: 'all',
  OWNED: 'owned',
  WON: 'won',
};

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
    switch (this.props.filter) {
      case BOUNTY_LIST_FILTER.OWNED: return "My Bounties";
      case BOUNTY_LIST_FILTER.WON: return "Bounties I Won";

      case BOUNTY_LIST_FILTER.ALL:
      default:
        return "All Bounties";
    }
  }

  async bountyMeta(bountyContract) {
    return {
      contract: bountyContract,
      stage: await bountyContract.stage.call(),
      endTime: await bountyContract.endTime.call(),
      owner: await bountyContract.owner.call(),
      winner: await bountyContract.winner.call(),
    };
  }

  async updateState(props) {
    const bountyContracts = props.bounties;
    const { owner, filter } = props;
    let bounties = [];
    // Note: this is a quick and dirty method of doing this for a project (aka prototype code).
    // These blocks with async calls and duplicate code
    // should never happen in a production application.
    if (filter === BOUNTY_LIST_FILTER.OWNED) {
      for (let i = 0; i < bountyContracts.length; i++) {
        const bountyOwner = await bountyContracts[i].owner.call();
        if (bountyOwner === owner) {
          bounties.push(await this.bountyMeta(bountyContracts[i]));
        }
      }
    } else if (filter === BOUNTY_LIST_FILTER.WON) {
      for (let i = 0; i < bountyContracts.length; i++) {
        const bountyWinner = await bountyContracts[i].winner.call();
        if (bountyWinner === owner) {
          bounties.push(await this.bountyMeta(bountyContracts[i]));
        }
      }
    } else {
      for (let i = 0; i < bountyContracts.length; i++) {
        bounties.push( await this.bountyMeta(bountyContracts[i]));
      }
    }

    this.setState({ bounties });
  }

  onViewBountyClick = (bounty) => () => {
    this.props.onViewBounty && this.props.onViewBounty(bounty.contract);
  }

  onReviewBountyClick = (bounty) => () => {
    this.props.onReviewBounty && this.props.onReviewBounty(bounty.contract);
  }

  onClaimBountyClick = (bounty) => () => {
    this.props.onClaimBounty && this.props.onClaimBounty(bounty.contract);
  }

  renderBountyContent = (bounty) => {
    const { owner } = this.props;
    let buttons = [
      <Button
        key="view-button"
        type="primary"
        style={{ width: '140px', display: 'block' }}
        onClick={ this.onViewBountyClick(bounty) }
      >
        View Details
      </Button>,
    ];

    if (owner === bounty.owner) {
      buttons.push(
        <Button
          key="review-claims"
          style={{ width: '140px' }}
          onClick={this.onReviewBountyClick(bounty)}
          disabled={
            BountyStages[bounty.stage] === CLOSED_AWAITING_WITHDRAWAL ||
            BountyStages[bounty.stage] === CLOSED_FINALIZED
          }
        >
          Review Claims
        </Button>
      );
    } else {
      buttons.push(
        <Button
          key="claim-button"
          style={{ width: '140px', display: 'block' }}
          disabled={ BountyStages[bounty.stage] !== ACCEPTING_CLAIMS || isExpired(bounty.endTime) }
          onClick={this.onClaimBountyClick(bounty)}
        >
          Claim
        </Button>
      );
    }

    if (owner === bounty.winner) {
      buttons.push(
        <Button
          onClick={() => this.props.collectReward(bounty.contract.address)}
          style={{ width: '140px' }}
          key="collect-reward"
          disabled={ BountyStages[bounty.stage] !== CLOSED_AWAITING_WITHDRAWAL }
        >
          Collect Reward
        </Button>
      );
    }

    return buttons;
  }

  renderBounty = (bounty) => {
    return (
      <BountyListItem key={bounty.contract.address} bounty={bounty.contract}>
        { this.renderBountyContent(bounty) }
      </BountyListItem>
    );
  }

  render() {
    const { bounties } = this.state;
    return (
      <div>
        { !bounties.length && <h3>No bounties to show</h3>}
        { !!bounties.length &&
          <List
            itemLayout="horizontal"
            dataSource={bounties}
            renderItem={ this.renderBounty }
          />
        }
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
