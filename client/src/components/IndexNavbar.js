import React, { Component, Fragment, useState } from 'react'

import RegisterModal from './auth/RegisterModal'
import LoginModal from './auth/LoginModal'
import Logout from './auth/Logout'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { searchPost } from '../actions/postActions'
import { BrowserRouter as Router } from 'react-router-dom'
import './IndexNavbar.css'
import profileLogo from '../img/profile.png'
import searchLogo from '../img/search.png'
import adminLogo from '../img/gear.png'
import { Navbar, Nav, NavItem, Form, Button, FormControl, NavDropdown, Glyphicon } from "react-bootstrap";
class IndexNavbar extends Component {
    state = {
        isOpen: false,
        search: '',
    }
    
    static propTypes = {
        auth: PropTypes.object.isRequired
    }
   
    render() {
        const { user, isAuthenticated, isLoading } = this.props.auth

        let id = window.location.href.split('/')
        id = id[id.length - 1]

        const authLinks = (
            <Fragment>
                <Router>
                    <NavItem>
                    <Nav.Link href="#" id="profileLogo">
                        <img src={profileLogo} />
                    </Nav.Link>
                    </NavItem>
                    <NavItem>
                        <Logout />
                    </NavItem>
                </Router>
            </Fragment>
        )

        const guestLinks = (
            <Fragment>
                <NavItem>
                    <LoginModal />
                </NavItem>
                <NavItem>
                    <RegisterModal />
                </NavItem>
            </Fragment>
        )

        const productsInCart  = 124
        return (
   <div id="navbarholder">       
                <Navbar color="light" light expand="lg" id="navbar">
                    <Navbar.Brand href="/" id="brandName">8-commerce</Navbar.Brand>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <NavItem>
                            <Nav.Link href="#">Homme</Nav.Link>
                        </NavItem>
                        <NavItem>
                            <Nav.Link href="#">Femme</Nav.Link>
                        </NavItem>
                        <NavItem>
                            <Nav.Link href="#">Accessoires</Nav.Link>
                        </NavItem>
                    </Navbar.Collapse>
                </Navbar>
                <Navbar id="underline">
                    <Nav.Link variant="" id="searchLogo" href="/search"><img src={searchLogo}/></Nav.Link>
                    <Nav>
                        {!isLoading ? isAuthenticated ? authLinks : guestLinks : null}
                    </Nav>
                    { user !== null && user.role === 'admin' ?  
                    <Nav.Link href="/admin" id="adminLogo">
                        <img src={adminLogo}/>
                    </Nav.Link> 
                    : null }
                    <Nav.Link href="#" className="p-0" id="productsCart">
                    <div className="float-left">{productsInCart}</div><img  className="float-left align-bottom" src="https://img.icons8.com/windows/32/000000/shopping-bag.png"/>
                    
                    </Nav.Link>
                    
                </Navbar>
                </div>
        )
    }
}

const mapStateToProps = state => ({
    post: state.post,
    auth: state.auth
})

export default connect(
    mapStateToProps,
    { searchPost }
)(IndexNavbar)
