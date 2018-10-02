import {Component} from "react";
import React from "react";
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const SIGNUP = gql`
    mutation addUser($username: String!, $password: String!, $email: String!) {
        addUser(username: $username, password: $password, email: $email, role: "USER") {
            token
        }
    }
`;

const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            token
        }
    }
`;

class RegisterLogin extends Component {
    state = {
        login: true, // switch between Login and SignUp
        username: '',
        password: '',
        email: '',
    }

    render() {
        const { login, username, password, email } = this.state;
        return (
            <div>
                <h4 >{login ? 'Login' : 'Sign Up'}</h4>
                <div>
                    {!login && (
                        <input
                            value={email}
                            onChange={e => this.setState({ email: e.target.value })}
                            type="text"
                            placeholder="Your email"
                        />
                    )}
                    <input
                        value={username}
                        onChange={e => this.setState({ username: e.target.value })}
                        type="text"
                        placeholder="Your username"
                    />
                    <input
                        value={password}
                        onChange={e => this.setState({ password: e.target.value })}
                        type="password"
                        placeholder="Choose a safe password"
                    />
                </div>
                <div>
                    <Mutation
                        mutation={login ? LOGIN : SIGNUP}
                        variables={{ username, password, email }}
                        onCompleted={data => this._confirm(data)}
                    >
                        {mutation => (
                            <button onClick={mutation}>
                                {login ? 'login' : 'create account'}
                            </button>
                        )}
                    </Mutation>
                    <button onClick={() => this.setState({ login: !login })}>
                        {login ? 'need to create an account?' : 'already have an account?'}
                    </button>
                </div>
            </div>
        );
    }
    _confirm = async data => {
        const { token } = this.state.login ? data.login : data.addUser;
        this._saveUserData(token);
        this.props.history.push(`/`);
    };

    _saveUserData = token => {
        localStorage.setItem('auth-token', token);
    };
}

export default RegisterLogin;
