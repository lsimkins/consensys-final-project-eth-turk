import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createBounty } from '../actions/bounty-registry';
import Bounty from '../components/bounty';
import Claim from '../components/claim';
import { addressIsSet } from '../util/bounty';

class ReviewBounty extends Component {
  state = {
    claimAddresses: []
  };

  constructor(props) {
    super(props);

    this.updateState(props);
  }

  componentWillReceiveProps(props) {
    this.updateState(props);
  }

  async updateState(props) {
    if (props.bounty) {
      const claimAddresses = await props.bounty.claims.call();
  
      this.setState({
        claimAddresses: claimAddresses.filter(addressIsSet)
      });
    }
  }

  render() {
    const { bounty } = this.props;

    if (bounty) {
      return (
        <div>
          <h2>Review Bounty</h2>
          <Bounty bounty={bounty}>
            <h3>Claims</h3>
            <em>Choose "Accept Claim" to award claimant the bounty.</em>
            {
              this.state.claimAddresses.map(
                address => <Claim key={address} bounty={bounty} claimAddress={address} />
              )
            }
          </Bounty>
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapDispatchToProps = {
  createBounty
}

const mapStateToProps = (state, ownProps) => ({
  bounty: state.bounty.contracts[ownProps.routeParams.address]
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewBounty)
