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
                            Upload Datapackage
                        </Link> &nbsp;
                        <Link to="/excel">
                            Excel Editor
                        </Link> &nbsp;
                        <Link to="/myData">
                            My Datapackages
                        </Link> &nbsp;
                        <Link to="/rdf">
                            RDF
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
