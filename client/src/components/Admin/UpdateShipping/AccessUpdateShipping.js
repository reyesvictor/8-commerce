import React from 'react';
import { connect } from 'react-redux'
import { Spinner } from 'react-bootstrap';
import PropTypes from "prop-types";
import UpdateShipping from './UpdateShipping';

const AccessUpdateShipping = ({auth}) => {
  
  if (!auth.authenticated && !auth.isLoading) {
    if (auth.user !== null && auth.user.role.includes('ROLE_ADMIN')) {
      return (
        <UpdateShipping />
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

AccessUpdateShipping.propTypes = {
    auth: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    auth: state.auth,
})

export default connect(mapStateToProps)(AccessUpdateShipping)