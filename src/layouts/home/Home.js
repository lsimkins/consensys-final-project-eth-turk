import React, { Component } from 'react'
import BountyList from '../../containers/bounty-list';
import { Link } from 'react-router';

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <div className="site-links">
              <Link className="main-link" to="/task/create"><strong>Create</strong></Link>
              <Link className="main-link" to="/task/review"><strong>Review My Bounties</strong></Link>
            </div>
            <div>{ this.props.children }</div>
            <BountyList />
          </div>
        </div>
      </main>
    )
  }
}

export default Home
