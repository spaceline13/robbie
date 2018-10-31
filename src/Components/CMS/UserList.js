import React, { Component } from 'react'
import User from './User'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import AddUser from "./addUser";
import UserAreaHeader from "../UserAreaHeader";

const USERS_QUERY = gql`
    {
        getAllUsers{
            id
            username
            email
            role
            approved
        }
    }
`;

class UserList extends Component {
    render() {
        return (
            <div>
                <UserAreaHeader features={['auth','excel','rdf','myData','upload','admin']}/>
                <Query query={USERS_QUERY}>
                    {({ loading, error, data }) => {
                        console.log(error,data)
                        if (loading) return <div>Fetching</div>
                        if (error) return <div>Error</div>

                        const usersToRender = data.getAllUsers
                        return (
                            <table className={'styledTable'}>
                                <thead>
                                    <tr className="myrows">
                                        <th></th>
                                        <th> <b>Username</b> </th>
                                        <th> <b>Email</b> </th>
                                        <th> <b>Role</b> </th>
                                        <th> <b>Approved</b> </th>
                                        <th> <b className="pull-right">Action</b> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {usersToRender.map((user, index) =>
                                            <User key={user.id} user={user} index={index} />
                                        )}
                                    <tr>
                                        <AddUser/>
                                    </tr>
                                </tbody>
                            </table>
                        )
                    }}
                </Query>
                *Admins receive notification emails when users sign for account approval<br/>
                **Moderators receive notification emails when users send a dataset for dataverse publish
            </div>
        );
    };
};
export default UserList;