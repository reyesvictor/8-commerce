import React, { Component } from 'react'
import {
    Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert
} from 'reactstrap'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { login, responseGoogle } from '../../actions/authActions'
import { clearErrors } from '../../actions/errorActions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import GoogleLogin from 'react-google-login';

class LoginModal extends Component {
    state = {
        modal: false,
        modalChange: false,
        email: '',
        newemail: '',
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

    toggleChange = () => {
        this.props.clearErrors()
        this.setState({
            modalChange: !this.state.modalChange
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

    onSubmitChange = e => {
        e.preventDefault()
        this.setState({email: this.state.newemail})
        const { newemail } = this.state
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }
        const body = {
            "email": newemail.toLowerCase()
        }
        console.log(body)
        axios.post(process.env.REACT_APP_API_LINK + "/password/reset", body, config).then(res => {
           toast.success(res.data.message, { position: "top-center" });
           this.toggleChange();
           this.toggle();
        }).catch(err => {
            toast.error(err.response.data.msg, { position: 'top-center' });
        });
    }
    render() {
        return (
            <div>
                <ToastContainer />
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
                                    value={this.state.email !== '' ? this.state.email : ''}
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
                                <div style={{ marginTop: '0.7vw' }}>
                                        <GoogleLogin
                                            clientId="338144876711-n2v79g8o17n9fpaa5b0bgs0b9jjb19s8.apps.googleusercontent.com"
                                            buttonText="Login"
                                            onSuccess={this.props.responseGoogle}
                                            // onFailure={this.responseGoogle}
                                            cookiePolicy={'single_host_origin'}
                                        />
                                </div>

                                <p className='mt-4 text-info' style={{cursor: 'pointer'}} onClick={() => {this.toggle(); this.toggleChange(); this.setState({newemail: this.state.email})}}>Forgot password?</p>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalChange} toggle={this.toggleChange}>
                    <ModalHeader toggle={this.toggleChange}>Get new password</ModalHeader>
                    <ModalBody>
                        {this.state.msg ? <Alert> {this.state.msg}</Alert> : null}
                        <Form onSubmit={this.onSubmitChange}>
                            <FormGroup>
                                <Label for="newemail">Email</Label>
                                <Input
                                    type="email"
                                    name="newemail"
                                    id="newemail"
                                    placeholder="Type email"
                                    value={this.state.newemail !== '' ? this.state.newemail : ''}
                                    onChange={this.onChange}
                                />
                                <Button color="dark" className="mt-4" block>
                                    Get new password
                                </Button>
                                <p className='mt-4 text-info' style={{cursor: 'pointer'}} onClick={() => {this.toggle(); this.toggleChange(); }}>Back to login</p>
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
    { login, clearErrors, responseGoogle }
)(LoginModal)
