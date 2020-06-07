import { GET_POSTS, UPDATE_POST, GET_POST, ADD_POST, DELETE_POST, POSTS_LOADING } from '../actions/types'

const initialState = {
    posts: [],
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_POST:
        case GET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false
            }
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== action.payload)
            }
        case ADD_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            }
        case POSTS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state
    }
}