import React, { Component } from 'react'
import { Container, ListGroup, ListGroupItem, Input, FormGroup, Form } from 'reactstrap'
import { connect } from 'react-redux'
import { searchPost } from '../../actions/postActions'
import PropTypes from 'prop-types'

class SearchPost extends Component {

    state = {
        isOpen: false,
        search: ''
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    componentDidMount() {
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = e => {
        e.preventDefault()

        const { search } = this.state

        const searchValue = {
            search
        }

        this.props.searchPost(searchValue)
    }

    render() {
        const { posts } = this.props.post

        const { user, isAuthenticated } = this.props.auth

        let id = window.location.href.split('/')
        id = id[id.length - 1]

        return (
            <Container>
                <ListGroup className="pt-4">
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <Input
                                type="search"
                                name="search"
                                id="search"
                                placeholder="Search post"
                                className="mt-1"
                                onChange={this.onChange}
                            />
                        </FormGroup>
                    </Form>
                    {posts.map(({ title, content, date, creator, _id }) =>
                        <ListGroupItem key={_id}>
                            <a
                                href={'/' + creator + '/' + _id}
                            >
                                {title}
                            </a>
                        </ListGroupItem>
                    )}

                </ListGroup>
            </Container>
        )
    }
}

SearchPost.propTypes = {
    post: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    //this post is the one in the index.js in the reducer folder
    post: state.post,
    auth: state.auth
})

// this connect is gonna take two things
// mapstatetoprops allows us to take our post state, in the reducer and then converts into a component property to be used in this component
export default connect(mapStateToProps, { searchPost })(SearchPost)