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
    let params = (localStorage.getItem('method_login') && localStorage.getItem('method_login') == 'google') ? "?method_login=google" : "";
    axios.get(process.env.REACT_APP_API_LINK + '/api/checktoken' + params, tokenConfig(getState))
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


export const responseGoogle = (response) => (dispatch, getState) => {
    // loading user
    dispatch({ type: USER_LOADING })
    axios.post(process.env.REACT_APP_API_LINK + '/connect/google/check', response).then(resp => {
        console.log('ok inside post Hao ! Yeaaaah !')
        localStorage.setItem('method_login', 'google');
        
        dispatch({
            type: LOGIN_SUCCESS,
            // res.data is an object with user object and the token
            payload: resp.data
        })
    }).catch((error) => {
        console.log(error)
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
    console.log(body)

    axios.post(process.env.REACT_APP_API_LINK + '/register', body, config)
        .then(res => {
            console.log(res)
            dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })})
        .catch(err => {
            console.log(err)
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
        config.headers['Authorization'] = 'Bearer ' + token;
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

    axios.post(process.env.REACT_APP_API_LINK + '/api/login_check', body, config)
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