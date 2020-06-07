import React, { Component } from 'react'
import { Container, ListGroup, ListGroupItem, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Fragment } from 'reactstrap'
import { connect } from 'react-redux'
import { getSinglePost, deletePost, updatePost } from '../../actions/postActions'
import { addComment, getPostComments, deleteComment } from '../../actions/commentActions'
import PropTypes from 'prop-types'

class PostDetail extends Component {

    state = {
        isOpen: false,
        modal: false,
        content: '',
        date: '',
        creator: '',
        post: '',
        postcontent: '',
        posttitle: ''
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    componentDidMount() {
        let id = window.location.href.split('/')
        id = id[id.length - 1]
        this.props.getSinglePost(id)
        this.props.getPostComments(id)
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onUpdate = (e) => {
        e.preventDefault()

        const { user, isAuthenticated } = this.props.auth

        let id = window.location.href.split('/')
        id = id[id.length - 1]

        const updatedPost = {
            _id: id,
            date: Date.now(),
            content: this.state.postcontent,
            title: this.state.posttitle
        }

        // Update a post via updatePost action
        this.props.updatePost(updatedPost)

        window.location.reload(false)
    }

    onSubmit = (e) => {
        e.preventDefault()

        const { user, isAuthenticated } = this.props.auth


        let id = window.location.href.split('/')
        id = id[id.length - 1]

        const newComment = {
            post: id,
            date: Date.now(),
            content: this.state.content,
            creator: user._id
        }

        // Add post via addPost action
        this.props.addComment(newComment)

        window.location.reload(false)
    }

    toggle = () => {
        // this.props.clearErrors()
        this.setState({
            modal: !this.state.modal
        })
    }

    onDeletePostClick = _id => {
        this.props.deletePost(_id)
        window.location.reload(false)
    }

    onDeleteClick = _id => {
        this.props.deleteComment(_id)
        window.location.reload(false)
    }

    render() {
        const { posts } = this.props.post
        const { comments } = this.props.comment

        const { user, isAuthenticated } = this.props.auth

        let id = window.location.href.split('/')
        id = id[id.length - 2]

        return (
            <Container>
                {posts ?
                    <ListGroup className="pt-4">
                        <ListGroupItem key={posts._id}>
                            {isAuthenticated ?
                                id === user._id ?
                                    <div>
                                        <Button
                                            className="remove-btn"
                                            color="danger"
                                            size="sm"
                                            onClick={this.onDeletePostClick.bind(this, posts._id)}
                                        >
                                            &times;
                                        </Button>

                                        <Button
                                            color="dark"
                                            className="mb-2 ml-2 mt-2"
                                            onClick={this.toggle}
                                        >
                                            Update post
                                        </Button>
                                    </div>
                                    : null
                                : null}
                            <h1>
                                {posts.title}
                            </h1>
                            <p>
                                {posts.content}
                            </p>
                            <small>
                                {posts.date}
                            </small>
                        </ListGroupItem>
                        {isAuthenticated ?
                            <Form onSubmit={this.onSubmit} className="card ml-2 pr-4 mr-2 pl-4">
                                <FormGroup className="mt-2 pt-2">
                                    <Label for="content">
                                        Add a comment
                                </Label>
                                    <Input
                                        className="m-2"
                                        type="textarea"
                                        name="content"
                                        id="content"
                                        placeholder="Add post content"
                                        onChange={this.onChange}
                                    />
                                </FormGroup>
                                <Button
                                    color="dark"
                                    className="mt-2 mb-2"
                                >
                                    Add
                            </Button>
                            </Form>
                            : null
                        }

                        <ListGroup className="pt-4">
                            <h5>Comments</h5>
                            {comments ? comments.map(({ content, date, creator, post, _id }) =>
                                <ListGroupItem key={_id}>
                                    {isAuthenticated ?
                                        posts.creator === user._id ?
                                            <div>
                                                <Button
                                                    className="remove-btn"
                                                    color="danger"
                                                    size="sm"
                                                    onClick={this.onDeleteClick.bind(this, _id)}
                                                >
                                                    &times;
                                                </Button>
                                            </div>
                                            : null
                                        : null}

                                    {isAuthenticated ?
                                        posts.creator === user._id ?
                                            <Modal
                                                isOpen={this.state.modal}
                                                toggle={this.toggle}
                                            >
                                                <ModalHeader toggle={this.toggle}>
                                                    Update post
                                                </ModalHeader>
                                                <ModalBody>
                                                    <Form onSubmit={this.onUpdate}>
                                                        <FormGroup>
                                                            <Label for="title">
                                                                Title of the post
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                name="posttitle"
                                                                id="posttitle"
                                                                placeholder={posts.title}
                                                                onChange={this.onChange}
                                                            />
                                                            <Label for="content">
                                                                Content of the post
                                                            </Label>
                                                            <Input
                                                                type="textarea"
                                                                name="postcontent"
                                                                id="postcontent"
                                                                placeholder={posts.content}
                                                                onChange={this.onChange}
                                                            />
                                                        </FormGroup>
                                                        <Button
                                                            color="dark"
                                                            className="mt-2"
                                                            block
                                                        >
                                                            Add
                                                        </Button>
                                                    </Form>
                                                </ModalBody>
                                            </Modal>
                                            : null
                                        : null}

                                    <p>
                                        {content}
                                    </p>
                                    <small>{date}</small>
                                </ListGroupItem>
                            ) : null}

                        </ListGroup>
                    </ListGroup>

                    : <h1>This post was deleted by the author</h1>}
            </Container>
        )
    }
}

PostDetail.propTypes = {
    post: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    //this post is the one in the index.js in the reducer folder
    post: state.post,
    comment: state.comment,
    auth: state.auth
})

// this connect is gonna take two things
// mapstatetoprops allows us to take our post state, in the reducer and then converts into a component property to be used in this component
export default connect(mapStateToProps, { getSinglePost, deletePost, deleteComment, addComment, getPostComments, updatePost })(PostDetail)