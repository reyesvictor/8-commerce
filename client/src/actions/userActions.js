import { GET_USERS, USERS_LOADING } from './types'
import axios from 'axios'


// get all posts
export const getUsers = () => dispatch => {
    dispatch(setUsersLoading())
    axios.get(process.env.REACT_APP_API_LINK + '/api/users')
        .then(res =>
            dispatch({
                type: GET_USERS,
                payload: res.data
            })
        )
}

export const setUsersLoading = () => {
    return {
        // just sets it from false to true
        type: USERS_LOADING
    }
}