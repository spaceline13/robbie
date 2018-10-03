import {Component} from "react";
import React from "react";
import { Link } from 'react-router-dom';

class UserAreaHeader extends Component {
    render() {
        const authToken = localStorage.getItem('auth-token');
        return (
            <div>
                {authToken ? (
                    <div>
                        <Link to="/upload">
                            Dataset Upload
                        </Link> &nbsp;
                        <Link to="/excel">
                            Excel and Reactive Search
                        </Link> &nbsp;
                        <button onClick={() => {
                                localStorage.removeItem('auth-token');
                                console.log(this.props.hash);
                                window.location.reload();
                            }}
                        >
                            logout
                        </button>
                    </div>
                ) : (
                    <Link to="/authenticate">
                        login
                    </Link>
                )}
            </div>
        );
    }
}

export default UserAreaHeader;
