import React, { Component } from 'react'
import {
    Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert
} from 'reactstrap'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { login } from '../../actions/authActions'
import { clearErrors } from '../../actions/errorActions'

class LoginModal extends Component {
    state = {
        modal: false,
        email: '',
        password: '',
        msg: null
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    }

    // once the component updates, it's gonna check for errors so it can display them
    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props

        if (error !== prevProps.error) {
            if (error.id === 'LOGIN_FAIL') {
                // in redux, you can see on the tree that it's MSG > MSG: "VALUE" that;s why it's double msg
                this.setState({ msg: error.msg.msg })
            }
            else {
                this.setState({ msg: null })
            }
        }

        // if the modal is open , AKA this.state.modal is true, AND if the user is authenticated which means he has a token, then close the modal because the user successfully registered
        if (this.state.modal) {
            if (isAuthenticated) {
                this.toggle()
            }
        }
    }

    toggle = () => {
        this.props.clearErrors()
        this.setState({
            modal: !this.state.modal
        })
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = e => {
        e.preventDefault()

        const { email, password } = this.state

        const user = {
            email,
            password
        }

        this.props.login(user)
    }

    render() {
        return (
            <div>
                <NavLink onClick={this.toggle} href="#">
                    Login
                </NavLink>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Log in !</ModalHeader>
                    <ModalBody>
                        {this.state.msg ? <Alert> {this.state.msg}</Alert> : null}
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Type email"
                                    onChange={this.onChange}
                                />
                                <Label for="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Type password"
                                    onChange={this.onChange}
                                />
                                <Button color="dark" className="mt-4" block>
                                    Login
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
})

export default connect(
    mapStateToProps,
    { login, clearErrors }
)(LoginModal)