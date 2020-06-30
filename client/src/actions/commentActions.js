import { ADD_COMMENT, DELETE_COMMENT, UPDATE_COMMENT, GET_COMMENTS, GET_COMMENT, COMMENTS_LOADING } from './types'
import axios from 'axios';
import { tokenConfig } from './authActions';

export const addComment = ({ date, content, creator, post }) => dispatch => {
    dispatch(setCommentsLoading())
    // headers 
    const config = tokenConfig();

    //request info
    const body = JSON.stringify({ post, date, content, creator })

    axios.post(process.env.REACT_APP_API_LINK + '/api/comments/', body, config)
        .then(res =>
            dispatch({
                type: ADD_COMMENT,
                payload: res.data
            }))
}

// get post comments
export const getPostComments = post => dispatch => {
    dispatch(setCommentsLoading())
    // headers 
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    //request info
    const body = JSON.stringify({ post })

    axios.post(process.env.REACT_APP_API_LINK + '/api/comments/post', body, config)
        .then(res =>
            dispatch({
                type: GET_COMMENTS,
                payload: res.data
            }))
}



export const setCommentsLoading = () => {
    return {
        // just sets it from false to true
        type: COMMENTS_LOADING
    }
}

// no need to have = (title) => because there's only one
export const deleteComment = id => dispatch => {
    axios.delete(process.env.REACT_APP_API_LINK + `/api/comments/${id}`)
        .then(res =>
            dispatch({
                type: DELETE_COMMENT,
                payload: id
            }))
}

// export const setPostsLoading = () => {
//     return {
//         // just sets it from false to true
//         type: COMMENT_LOADING
//     }
// }