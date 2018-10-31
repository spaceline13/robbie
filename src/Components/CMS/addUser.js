import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const ADD_USER = gql`
        mutation addUser($username: String!,$password: String!, $email: String!, $role: String!) {
            addUser(username: $username,password: $password, email: $email, role: $role) {
                user{
                    id
                }
            }
        }
`;

class AddUser extends Component {
    state = {
        username : '',
        email : '',
        password : '',
        role : ''
    };
    render() {
        const { state } = this;
        return (
            <Mutation mutation={ADD_USER}
                  /*update={(cache, { data: { addTodo } }) => {
                      const { todos } = cache.readQuery({ query: GET_TODOS });
                      cache.writeQuery({
                          query: GET_TODOS,
                          data: { todos: todos.concat([addTodo]) }
                      });
                  }}*/
            >
                {(addUser, { data }) => (
                    <tr className="myrows">
                        <form className="myform"
                            onSubmit={e => {
                                e.preventDefault();
                                addUser({ variables: { username: state.username, email: state.email, password: state.password, role: state.role} });
                            }}
                        >
                            <td> <input placeholder="username" value={ state.username } onChange={ e => this.setState({ username : e.target.value }) }/></td>
                            <td> <input placeholder="email" value={ state.email } onChange={ e => this.setState({ email : e.target.value }) }/></td>
                            <td><input placeholder="password" value={ state.password } onChange={ e => this.setState({ password : e.target.value }) }/></td>
                            <td><input placeholder="role" value={ state.role } onChange={ e => this.setState({ role : e.target.value }) }/></td>
                            <td><button className="pull-right"  color="primary" type="submit"> &nbsp;&nbsp;&nbsp;Add&nbsp;&nbsp;&nbsp; </button></td>
                        </form>
                    </tr>
                )}
            </Mutation>
        )
    }
}
export default AddUser;