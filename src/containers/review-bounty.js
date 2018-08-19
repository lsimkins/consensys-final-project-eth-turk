import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createBounty } from '../actions/bounty-registry';
import BountyCard from '../components/bounty-card';
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
      const claimAddresses = await props.bounty.allClaims.call();
  
      console.log(claimAddresses);

      this.setState({
        claimAddresses: claimAddresses.filter(addressIsSet)
      });
    }
  }

  render() {
    const { bounty } = this.props;

    if (bounty) {
      return (
        <div className="bounty-card">
          <h2>Reviewing Bounty<br/>{ bounty.address }</h2>

          <h3>Claims</h3>
          <em>Choose "Accept Claim" to award claimant the bounty.</em>
          <div style={{ marginTop: '8px' }}>
          { !this.state.claimAddresses.length && "No claims yet" }
          {
            this.state.claimAddresses.map(
              address => <Claim key={address} bounty={bounty} claimAddress={address} />
            )
          }
          </div>
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

const mapStateToProps = (state, ownProps) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewBounty)
