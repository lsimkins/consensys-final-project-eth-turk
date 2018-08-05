import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createBounty } from '../actions/bounty-registry';
import Bounty from '../components/bounty';

class ReviewBounty extends Component {
  state = {};

  render() {
    return (
      <div>
        <h2>Review Bounty</h2>
        <Bounty bounty={this.props.bounty} />
      </div>
    );
  }
}

const mapDispatchToProps = {
  createBounty
}

const mapStateToProps = (state, ownProps) => ({
  bounty: state.bounty.contracts[ownProps.routeParams.address]
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewBounty)
