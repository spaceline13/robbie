import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const REMOVE_USER = gql`
    mutation removeUser($id: Int!) {
        removeUser(id: $id) {
            id
        }
    }
`

class RemoveUser extends Component {
    render() {
        var id = this.props.user.id;
        return (
                <Mutation
                    mutation={REMOVE_USER}
                    variables={{id}}
                >
                    {removeUser => <button color="danger" onClick={removeUser}>remove</button>}
                </Mutation>
        )
    }
}

export default RemoveUser;