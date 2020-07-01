// import React, { Component, Fragment } from 'react'
import { logout } from '../../actions/authActions'
import { connect } from 'react-redux'
import { NavLink } from 'reactstrap'
import PropTypes from 'prop-types'
import { GoogleLogout } from 'react-google-login';
import React, { Component, Fragment, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";

export class Logout extends Component {
    static propTypes = {
        logout: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired
    }

    // static propTypes = {
    //     isAuthenticated: PropTypes.bool,
    //     error: PropTypes.object.isRequired,
    //     login: PropTypes.func.isRequired,
    //     clearErrors: PropTypes.func.isRequired
    // }

    render() {
        console.log(this.props)
        return (
            <Fragment key="logoutmodal">

                {/* {(this.props.auth.user.method_login && this.props.auth.user.method_login == 'google')? */}
                {(this.props.auth.user && this.props.auth.user.method_login && this.props.auth.user.method_login == 'google')?
                    <GoogleLogout
                        clientId="338144876711-n2v79g8o17n9fpaa5b0bgs0b9jjb19s8.apps.googleusercontent.com"
                        buttonText="Logout"
                        onLogoutSuccess={this.props.logout}
                    >
                    </GoogleLogout>
                    :
                <NavLink onClick={this.props.logout} href="#" className="text-dark">
                    Logout
                </NavLink>
                }
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    post: state.post,
    auth: state.auth
});


export default connect(
    mapStateToProps,
    { logout }
)(Logout);