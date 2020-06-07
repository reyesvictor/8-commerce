import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import { Spinner } from 'react-bootstrap'
import SubProductInterface from './SubProductInterface';

const AccessSubProductInterface = ({ auth }) => {
  if (!auth.authenticated && !auth.isLoading) {
    if (auth.user !== null && auth.user.role === 'admin') {
      return (
        <SubProductInterface />
      )
    }
    else {
      return (<div id='error403'> <h2> Error page 403 access forbiden </h2></div>)
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

AccessSubProductInterface.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(AccessSubProductInterface)