import { combineReducers } from 'redux'
import authReducer from './authReducer'
import errorReducer from './errorReducer'
import postReducer from './postReducer'
import commentReducer from './commentReducer'
import userReducer from './userReducer'

export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    post: postReducer,
    comment: commentReducer,
    user: userReducer
})