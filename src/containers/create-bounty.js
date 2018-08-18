import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createBounty } from '../actions/bounty-registry';

class CreateBountyForm extends Component {
  state = {
    owner: null,
    bountyParams: {
      reward: null,
      description: null,
      timeLimit: null
    },
  };

  componentWillReceiveProps(props) {
    if (props.contract) {
      this.updateState(props.contract)
    }
  }

  updateState = async (contract) => {
    const owner = await contract.owner.call();

    this.setState({ owner });
  }

  onSubmit = (e, values) => {
    e.preventDefault();
    const bountyParams = this.state.bountyParams;

    this.props.createBounty({
      ...this.state.bountyParams,
      reward: parseInt(bountyParams.reward, 10),
      timeLimit: parseInt(bountyParams.timeLimit, 10),
    });
  }

  setBountyParam = (name) => (changeEvent) => {
    this.setState({
      bountyParams: {
        ...this.state.bountyParams,
        [name]: changeEvent.target.value,
      },
    });
  }

  render() {
    return (
      <div>
        <h2>Create New Bounty</h2>
        { this.props.owner }
        <form onSubmit={this.onSubmit}>
          <div className="form-input-row">
            <label>Reward (Wei)</label>
            <input type="text" name="reward" onChange={this.setBountyParam('reward')} />
          </div>
          <div className="form-input-row">
            <label>Description</label>
            <input type="text" name="description" onChange={this.setBountyParam('description')}/>
          </div>
          <div className="form-input-row">
            <label>Time Limit (Seconds)</label>
            <input type="text" name="timeLimit" onChange={this.setBountyParam('timeLimit')}/>
          </div>
          <div className="form-input-row">
            <input type="submit" />
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  createBounty
}

const mapStateToProps = (state) => ({
  contract: state.bountyRegistry.contract
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateBountyForm)
