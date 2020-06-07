import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/index'

const initialState = {}

const middleware = [thunk]

const store = createStore(rootReducer, initialState, compose(
    compose(applyMiddleware(...middleware),window.__REDUX_DEVTOOLS_EXTENSION__())
))

export default store