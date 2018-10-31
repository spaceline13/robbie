import React, {Component} from 'react';
import RemoveUser from './RemoveUser';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const EDIT_USER = gql`
    mutation editUser($id:Int!, $username: String, $email: String, $role: String, $approved: String) {
        editUser(id: $id, username: $username, email: $email, role: $role, approved: $approved) 
    }
`;

class User extends Component{
    constructor(props) {
        super(props);
        this.state = {isEditing: false, username:props.user.username, email:props.user.email, role:props.user.role, approved:props.user.approved};

        // This binding is necessary to make `this` work in the callback
        this.editUser = this.editUser.bind(this);
    }
    editUser(){
        this.setState(state => ({
            isEditing: !state.isEditing
        }));
        console.log(this.state.isEditing);
    }
    render(){
        var us = this.props.user;
        return(
            <tr className="myrows">
                <td style={{display:'none'}}> {this.props.user.id} </td>
                <td><span className="gray">{this.props.index + 1}.</span></td>
                <td> {this.state.isEditing? <input placeholder="username" value={ this.state.username } onChange={ e => this.setState({ username : e.target.value })}/> : this.state.username }</td>
                <td> {this.state.isEditing? <input placeholder="email" value={ this.state.email } onChange={ e => this.setState({ email : e.target.value })}/> : this.state.email }</td>
                <td>
                    {this.state.isEditing?
                        <select defaultValue={this.state.role} value={ this.state.role } onChange={ e => this.setState({ role : e.target.value })}>
                            <option value="ADMIN">ADMIN</option>
                            <option value="USER">USER</option>
                            <option value="MODERATOR">MODERATOR</option>
                        </select>
                    :
                        this.state.role
                    }
                </td>
                <td style={{textAlign: 'center'}}>
                    {this.state.isEditing?
                        <select defaultValue={this.state.approved} value={ this.state.approved } onChange={ e => this.setState({ approved : e.target.value })}>
                            <option value="1">YES</option>
                            <option value="0">NO</option>
                        </select>
                    :
                        this.state.approved=='1'?'YES':'NO'
                    }
                </td>
                <td className="align-right" xs="3">
                    <button color="info" onClick={this.editUser}>{this.state.isEditing? "Cancel": "Edit"}</button>
                    {this.state.isEditing ?
                        <Mutation mutation={EDIT_USER}>
                            {(editUser, {data}) => (
                                <form className="myform"
                                      onSubmit={e => {
                                          e.preventDefault();
                                          editUser({
                                              variables: {
                                                  id: this.props.user.id,
                                                  username: this.state.username,
                                                  email: this.state.email,
                                                  role: this.state.role,
                                                  approved: this.state.approved
                                              }
                                          });
                                          this.setState(state => ({
                                              isEditing: false
                                          }));
                                      }}
                                >
                                    <button type="submit" color="success">save</button>
                                </form>
                            )}
                        </Mutation>
                        :
                        <span></span>
                    }
                    <RemoveUser user={us} />
                </td>
            </tr>
        );
    }
}
export default User;