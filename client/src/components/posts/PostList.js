import React, { Component } from 'react'
import { Container, ListGroup, ListGroupItem, Button, NavLink } from 'reactstrap'
import { connect } from 'react-redux'
import { getUserPosts, deletePost } from '../../actions/postActions'
import PropTypes from 'prop-types'

class PostList extends Component {

    state = {
        isOpen: false,
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    componentDidMount() {
        let id = window.location.href.split('/')
        id = id[id.length - 1]
        this.props.getUserPosts(id)
    }

    onDeleteClick = _id => {
        this.props.deletePost(_id)
        window.location.reload(false)
    }

    render() {
        const { posts } = this.props.post

        const { user, isAuthenticated } = this.props.auth

        let id = window.location.href.split('/')
        id = id[id.length - 1]

        return (
            <Container>
                <ListGroup className="pt-4">
                    {posts.map(({ title, content, date, creator, _id }) =>
                        <ListGroupItem key={_id}>
                            {isAuthenticated ?
                                id === user._id ?
                                    <Button
                                        className="remove-btn"
                                        color="danger"
                                        size="sm"
                                        onClick={this.onDeleteClick.bind(this, _id)}
                                    >
                                        &times;
                                    </Button> : null
                                : null}

                            <a
                                href={'/' + creator + '/' + _id}
                            >
                                {title}
                            </a>
                        </ListGroupItem>
                    )}

                </ListGroup>
            </Container>
        )
    }
}

PostList.propTypes = {
    getUserPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    //this post is the one in the index.js in the reducer folder
    post: state.post,
    auth: state.auth
})

// this connect is gonna take two things
// mapstatetoprops allows us to take our post state, in the reducer and then converts into a component property to be used in this component
export default connect(mapStateToProps, { getUserPosts, deletePost })(PostList)