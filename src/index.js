import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import './index.css';
import ViewBounties from './components/view-bounties';

// Layouts
import App from './App'
import Home from './layouts/home/Home'

// Redux Store
import store from './store'
import BountyCard from './containers/create-bounty';

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="bounty" component={Home}>
            <IndexRoute component={BountyCard} />
            <Route path="create" component={BountyCard} />
            <Route path="list" component={ViewBounties} />
            <Route path="*" exact={true} component={BountyCard} />
          </Route>
          <Redirect from='*' to='/bounty/create' />
          {/* <Route path="dashboard" component={UserIsAuthenticated(Dashboard)} />
          <Route path="profile" component={UserIsAuthenticated(Profile)} /> */}
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)
