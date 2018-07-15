import React, { Component } from 'react'
import { connect } from 'react-redux'

class BountyCard extends Component {
  state = {
    owner: null
  }

  componentWillReceiveProps(props) {
    if (props.contract) {
      this.updateState(props.contract)
    }
  }

  updateState = async (contract) => {
    const owner = await contract.owner.call();

    this.setState({ owner });
  }

  render() {
    return (
      <div>
        { this.state.owner }
      </div>
    );
  }
}

const mapDispatchToProps = {}

const mapStateToProps = (state) => ({
  contract: state.bountyRegistry.contract
})

export default connect(mapStateToProps, mapDispatchToProps)(BountyCard)
