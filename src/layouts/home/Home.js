import React, { Component } from 'react'
import { Link } from 'react-router';
import { Button } from 'antd';

const links = [{
  path: "/task/view-all",
  title: "All Bounties"
},{
  path: "/task/review",
  title: "My Posted Bounties"
},{
  path: "/task/view-won",
  title: "My Won Bounties"
}];

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <div className="site-links">
              {
                links.map(link => (
                  <Link
                    key={ link.path }
                    className={`main-link ${ location.pathname === link.path ? 'active' : 'inactive'}`}
                    to={link.path}
                  >
                    <strong>{ link.title }</strong>
                  </Link>
                ))
              }
            </div>
          <div style={{ padding: '6px' }}>
            <Button>
              <Link to="/task/create">Create New Bounty</Link>
            </Button>
          </div>
          <div>{ this.props.children }</div>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
