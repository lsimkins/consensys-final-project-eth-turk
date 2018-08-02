import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './user/userReducer'
import web3 from './reducers/web3'
import bountyRegistry from './reducers/bounty-registry'
import bounty from './reducers/bounty'

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
  web3,
  bountyRegistry,
  bounty
})

export default reducer
