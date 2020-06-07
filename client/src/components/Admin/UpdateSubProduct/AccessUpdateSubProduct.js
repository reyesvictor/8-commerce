import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Spinner } from 'react-bootstrap';
import PropTypes from "prop-types";
import UpdateSubProduct from './UpdateSubProduct';

const AccessUpdateSubProduct = ({auth}) => {
  
  if (!auth.authenticated && !auth.isLoading) {
    if (auth.user !== null && auth.user.role === 'admin') {
      return (
        <UpdateSubProduct />
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

AccessUpdateSubProduct.propTypes = {
    auth: PropTypes.object.isRequired
  };

const mapStateToProps = state => ({
    auth: state.auth,
})

export default connect(mapStateToProps)(AccessUpdateSubProduct)