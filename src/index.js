import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import './index.css';
import BountyList from './containers/bounty-list';
import ReviewBounty from './containers/review-bounty';

// Layouts
import App from './App'
import Home from './layouts/home/Home'

// Redux Store
import store from './store'
import BountyCard from './containers/create-bounty';
import ClaimBounty from './containers/claim-bounty';

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="task" component={Home}>
            <IndexRoute component={BountyCard} />
            <Route path="create" component={BountyCard} />
            <Route path="claim/:address" component={ClaimBounty} />
            <Route path="review" component={() => <BountyList context={"review"} /> } />
            <Route path="review/:address" component={ReviewBounty} />
            <Route path="review-claims/:address" component={ReviewBounty} />
            <Route path="view-all" component={BountyList} />
            <Route path="view-won" component={() => <BountyList context={"won"} />} />
          </Route>
          {/* <Route path="dashboard" component={UserIsAuthenticated(Dashboard)} />
          <Route path="profile" component={UserIsAuthenticated(Profile)} /> */}
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)
