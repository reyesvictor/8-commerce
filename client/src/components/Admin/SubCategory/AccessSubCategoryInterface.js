import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import { Spinner } from 'react-bootstrap'
import SubCategoryInterface from './SubCategoryInterface';

const AccessSubCategoryInterface = ({ auth }) => {
  if (!auth.authenticated && !auth.isLoading) {
    if (auth.user !== null && auth.user.role === 'admin') {
      return (
        <SubCategoryInterface />
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

AccessSubCategoryInterface.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(AccessSubCategoryInterface)