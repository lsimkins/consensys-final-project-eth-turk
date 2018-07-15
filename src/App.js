import React, { Component } from 'react'
import { Link } from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'
import { connect } from 'react-redux'
import {web3connect} from './actions/web3.js';
import {instantiateBountyContract} from './actions/bounty-registry.js';

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer.js'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer.js'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  componentWillMount() {
    window.addEventListener('load', () => {
      this.props.web3connect();
      this.props.instantiateBountyContract().then(() => {
        console.log('intantiated');
        // this.props.fetchTodos();
      });
    });
  }

  render() {
    let testOutput = null;
    if (this.props.bountyRegistry) {
      console.log(this.props.bountyRegistry);
    }

    const OnlyAuthLinks = VisibleOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">Dashboard</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Profile</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <span>
        <LoginButtonContainer />
      </span>
    )

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/" className="pure-menu-heading pure-menu-link">Geo Turk</Link>
          <ul className="pure-menu-list navbar-right">
            <OnlyGuestLinks />
            <OnlyAuthLinks />
          </ul>
        </nav>

        {this.props.children}
      </div>
    );
  }
}

const mapDispatchToProps = {
  web3connect,
  instantiateBountyContract,
}

const mapStateToProps = (state) => ({
  web3: state.web3,
  bountyRegistry: state.bountyRegistry.instance
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
