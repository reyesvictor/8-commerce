import React from 'react';
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import './Admin.css';
import { Spinner } from 'react-bootstrap';
import AdminInterface from './AdminInterface';

const AccessAdmin = ({ auth }) => {

  if (!auth.authenticated && !auth.isLoading) {
    if (auth.user !== null && auth.user.role.includes('ROLE_ADMIN')) {
      return (
        <AdminInterface />
      )
    }
    else {
      return (<div id='error403'> <h2> Error page 403 access forbidden </h2></div>)
    }
  }
  else {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <Spinner style={{ top: '33%', margin: '0', position: 'absolute' }} className="" animation="grow" />
        </div>
      </div>
    )
  }

}

AccessAdmin.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(AccessAdmin)