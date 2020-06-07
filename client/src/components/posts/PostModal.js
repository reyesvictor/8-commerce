import React, { Component } from 'react'
import {
    Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input
} from 'reactstrap'
import { connect } from 'react-redux'
import { addPost } from '../../actions/postActions'
import PropTypes from 'prop-types'

class PostModal extends Component {
    state = {
        modal: false,
        title: '',
        content: '',
        date: '',
        creator: ''
    }

    toggle = () => {
        // this.props.clearErrors()
        this.setState({
            modal: !this.state.modal
        })
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault()

        const { user, isAuthenticated } = this.props.auth

        const newPost = {
            title: this.state.title,
            content: this.state.content,
            creator: user._id,
            date: Date.now()
        }

        // Add post via addPost action
        this.props.addPost(newPost)

        this.toggle()
        window.location.reload(false)
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    render() {
        const { user, isAuthenticated } = this.props.auth

        let id = window.location.href.split('/')
        id = id[id.length - 1]

        return (
            <div>

                { isAuthenticated ?
                    id === user._id ?
                        <Button
                            color="dark"
                            className="mb-2"
                            onClick={this.toggle}
                        >
                            Add post
                        </Button> : null
                    : null}

                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                >
                    <ModalHeader toggle={this.toggle}>
                        Add post to blog
                    </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="title">
                                    Title of the post
                                </Label>
                                <Input
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Add post title"
                                    onChange={this.onChange}
                                />
                                <Label for="content">
                                    Content of the post
                                </Label>
                                <Input
                                    type="textarea"
                                    name="content"
                                    id="content"
                                    placeholder="Add post content"
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
            </div>
        )
    }
}

const mapStateToProps = state => ({
    post: state.post,
    auth: state.auth
})

export default connect(mapStateToProps, { addPost })(PostModal)