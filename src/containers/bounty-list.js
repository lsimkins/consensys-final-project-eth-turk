import React, { Component } from 'react'
import { connect } from 'react-redux'
import Bounty from '../components/bounty'
import { values } from 'lodash';

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
    if (this.props.filterByOwner) {
      return "My Bounties";
    } else {
      return "All Bounties";
    }
  }

  async updateState(props) {
    if (this.props.filterByOwner) {
      const { bounties, owner } = props;
      const showBounties = [];
      // Note: this is a quick and dirty method of doing this for a project.
      // This should never happen in a production application.
      for (var i = 0; i < bounties.length; i++) {
        const bountyOwner = await bounties[i].owner.call();
        if (bountyOwner == owner) {
          showBounties.push(bounties[i]);
        }
      }

      this.setState({ bounties: showBounties });
    } else {
      this.setState({ bounties: props.bounties });
    }
  }

  render() {
    const { bounties } = this.state;
    return (
      <div>
        <h2>{ this.title }</h2>
        { !bounties.length && <h3>No bounties to show</h3>}
        { !!bounties.length && bounties.map(b => <Bounty key={b.address} bounty={b} />) }
      </div>
    );
  }
}

const mapDispatchToProps = {
  
}

const mapStateToProps = (state) => ({
  bounties: values(state.bounty.contracts),
  owner: state.web3.instance ? state.web3.instance.eth.accounts[0] : null
})

export default connect(mapStateToProps, mapDispatchToProps)(BountyList)
