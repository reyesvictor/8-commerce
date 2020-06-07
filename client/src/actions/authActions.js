import axios from 'axios'
import {
    USER_LOADED,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    LOGOUT_SUCCESS,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    AUTH_ERROR,
    USER_LOADING
} from '../actions/types'
import { returnErrors } from './errorActions'

// dispatch is a function of the Redux store. You call store.dispatch to dispatch an action. This is the only way to trigger a state change.
// check token first and then load the user
export const loadUser = () => (dispatch, getState) => {
    // loading user
    dispatch({ type: USER_LOADING })

    axios.get('http://127.0.0.1:8000/checktoken', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            // res.data is an object with user object and the token
            payload: res.data
        }))
        .catch(err => {
            dispatch({
                type: AUTH_ERROR
            })
        })
}

// Register User
export const register = ({ username, email, password }) => dispatch => {
    // headers 
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }
    //request info
    const body = JSON.stringify({ username, email, password })

    axios.post('http://localhost:8000/register', body, config)
        .then(res => dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'))
            dispatch({
                type: REGISTER_FAIL
            })
        })
}

// setup function for token/headers
export const tokenConfig = getState => {
    // getting token
    const token = getState().auth.token

    // headers
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    // if token is good, add it to headers
    if (token) {
        config.headers['x-auth-token'] = token
    }
    return config
}

//logout no need for dispatch
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    }
}

//logout no need for dispatch
export const login = ({ email, password }) => dispatch => {
    // headers 
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    //request info
    const body = JSON.stringify({ email, password })

    axios.post('http://localhost:8000/login', body, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'))
            dispatch({
                type: LOGIN_FAIL
            })
        })
}