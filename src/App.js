import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import {web3connect} from './actions/web3.js';
import {instantiateBountyContract} from './actions/bounty-registry.js';
import { Layout, Menu } from 'antd';
const { Header, Footer, Content, Sider } = Layout;
const { SubMenu } = Menu;
import { Link } from 'react-router';

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  componentWillMount() {
    window.addEventListener('load', () => {
      this.props.web3connect();
      this.props.instantiateBountyContract();
    });
  }

  get activeTab() {
    switch (this.props.location.pathname) {
      case "/bounty/list": return "view-bounties";
      case "/bounty/create":
      default:
        return "create-bounty";
    }
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <Layout>
          <Header>
            <h2>ETH Turk</h2>
          </Header>

          <Layout>
            <Sider style={{ background: '#fff' }}>
              <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={[ this.activeTab ]}
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item key="create-bounty">
                  <Link to="/bounty/create">Create New Bounty</Link>
                </Menu.Item>
                <Menu.Item key="view-bounties">
                  <Link to="/bounty/list">View Bounties</Link>
                </Menu.Item>
              </Menu>
              <div
                style={{
                  marginTop: '12px',
                  padding: '12px',
                  maxWidth: '100%',
                  borderTop: '1px solid #eee'
                }}>
                <strong>Current account</strong><br/>
                <span style={{ color: '#1890ff', wordWrap: 'break-word' }}>{this.props.activeAccount}</span>
              </div>
            </Sider>
            <Content>
              <main style={{ padding: "8px 16px" }}>
                {this.props.children}
              </main>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

const mapDispatchToProps = {
  web3connect,
  instantiateBountyContract,
};

const mapStateToProps = (state) => ({
  web3: state.web3.instance,
  activeAccount: state.web3.activeAccount
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
