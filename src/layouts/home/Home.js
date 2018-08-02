import React, { Component } from 'react'
import BountyList from '../../containers/bounty-list';

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <div>{ this.props.children }</div>
            <BountyList />
          </div>
        </div>
      </main>
    )
  }
}

export default Home
