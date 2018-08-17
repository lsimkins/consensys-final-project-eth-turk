import React, { Component } from 'react'
import { connect } from 'react-redux'
import Bounty from '../components/bounty'
import { values } from 'lodash';
import { Button } from 'antd';
import { Link } from 'react-router';
import { collectReward } from '../actions/bounty';

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
    // Note: this is a quick and dirty method of doing this for a project.
    // These blocks with async calls and duplicate code
    // should never happen in a production application.
    if (this.props.context === 'review') {
      const { bounties, owner } = props;
      const showBounties = [];
      for (var i = 0; i < bounties.length; i++) {
        const bountyOwner = await bounties[i].owner.call();
        if (bountyOwner === owner) {
          showBounties.push(bounties[i]);
        }
      }

      this.setState({ bounties: showBounties });
    } else if (this.props.context === 'won') {
      const { bounties, owner } = props;
      const showBounties = [];
      for (var i = 0; i < bounties.length; i++) {
        const bountyWinner = await bounties[i].winner.call();
        if (bountyWinner === owner) {
          showBounties.push(bounties[i]);
        }
      }

      this.setState({ bounties: showBounties });
    } else {
      this.setState({ bounties: props.bounties });
    }
  }

  renderBountyContent = (bounty) => {
    if (this.props.context === 'review') {
      return (
        <Button style={{ width: '200px' }}>
          <Link to={`/task/review-claims/${bounty.address}`}>Review Claims</Link>
        </Button>
      );
    } else if (this.props.context === 'won') {
      return (
        <Button
          onClick={() => this.props.collectReward(bounty.address)}
          style={{ width: '200px' }}
        >
          Collect Reward
        </Button>
      );
    } else {
      return (
        <Button style={{ width: '200px' }}>
          <Link to={`/task/claim/${bounty.address}`}>Claim</Link>
        </Button>
      );
    }

    return null;
  }

  renderBounty = (bounty) => {
    return (
      <Bounty key={bounty.address} bounty={bounty}>
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
