import React from 'react';
import { Provider } from 'react-redux'
import store from '../../store'
import { Container } from 'reactstrap'
import PostList from './PostList'
import PostModal from './PostModal'

class UserPosts extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Container>
                    <PostModal />
                    <PostList />
                </Container>
            </Provider>
        )
    }
}

export default UserPosts;