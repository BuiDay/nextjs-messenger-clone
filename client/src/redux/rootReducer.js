import {combineReducers} from 'redux'
import authReducer from './auth/authSlice'
// import appReducer from '../features/app/appSilce'
// import postReducer from '../features/post/postSilce'

const rootReducer = combineReducers({
    auth:authReducer,
})

export default rootReducer
