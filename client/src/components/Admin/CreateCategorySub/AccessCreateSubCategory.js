import React from 'react';
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import { Spinner } from 'react-bootstrap'
import CreateSubCategory from './CreateSubCategory';

const AccessCreateSubCategory = ({ auth }) => {

  if (!auth.authenticated && !auth.isLoading) {
    if (auth.user !== null && auth.user.role.includes('ROLE_ADMIN')) {
      return (
        <CreateSubCategory />
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

AccessCreateSubCategory.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(AccessCreateSubCategory)