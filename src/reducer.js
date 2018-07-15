import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './user/userReducer'
import web3 from './reducers/web3'
import bountyRegistry from './reducers/bounty-registry'

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
  web3,
  bountyRegistry
})

export default reducer
