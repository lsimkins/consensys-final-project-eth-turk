import React, { Component } from 'react'
import { connect } from 'react-redux'
import Bounty from '../components/bounty'
import { values } from 'lodash';

class BountyList extends Component {
  render() {
    return (
      <div>
        <h2>Bounty List</h2>
        { this.props.bounties.map(b => <Bounty key={b.address} bounty={b} />) }
      </div>
    );
  }
}

const mapDispatchToProps = {
  
}

const mapStateToProps = (state) => ({
  bounties: values(state.bounty.contracts)
})

export default connect(mapStateToProps, mapDispatchToProps)(BountyList)
