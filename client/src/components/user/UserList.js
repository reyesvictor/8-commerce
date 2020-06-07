import React, { Component } from 'react'
import { Container, ListGroup, ListGroupItem, Button, NavLink } from 'reactstrap'
import { connect } from 'react-redux'
import { getUsers } from '../../actions/userActions'
import PropTypes from 'prop-types'

class UserList extends Component {

    state = {
        isOpen: false,
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    componentDidMount() {
        this.props.getUsers()
    }

    render() {
        const { users } = this.props.user

        const { user, isAuthenticated } = this.props.auth

        return (
            <Container>
                <ListGroup className="pt-4">
                    {users.map(({ _id, username }) =>
                        <ListGroupItem key={_id}>
                            <a
                                href={'/' + _id}
                            >
                                {username}
                            </a>
                        </ListGroupItem>
                    )}

                </ListGroup>
            </Container>
        )
    }
}

UserList.propTypes = {
    user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    //this post is the one in the index.js in the reducer folder
    user: state.user,
    auth: state.auth
})

// this connect is gonna take two things
// mapstatetoprops allows us to take our post state, in the reducer and then converts into a component property to be used in this component
export default connect(mapStateToProps, { getUsers })(UserList)