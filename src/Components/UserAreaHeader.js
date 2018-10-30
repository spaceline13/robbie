import {Component} from "react";
import React from "react";
import { Link } from 'react-router-dom';
import {Query} from "react-apollo";
import gql from "graphql-tag";
const GET_ME = gql`
    {
        getMe{
            id
            username
            email
            role
        }
    }
`;
class UserAreaHeader extends Component {
    render() {
        const authToken = this.props.features.includes('auth')?localStorage.getItem('auth-token'):true;
        return (
            <div>
                {authToken ? ( //true if auth is not included in the features
                    <div>
                        {this.props.features.includes('upload') &&
                            <Link style={{marginRight:'5px'}} to="/upload">
                                Upload Datapackage
                            </Link>
                        }
                        {this.props.features.includes('excel') &&
                            <Link style={{marginRight:'5px'}} to="/excel">
                                Excel Editor
                            </Link>
                        }
                        {this.props.features.includes('myData') &&
                            <Link style={{marginRight:'5px'}} to="/myData">
                                My Datapackages
                            </Link>
                        }
                        {this.props.features.includes('rdf') &&
                            <Link style={{marginRight:'5px'}} to="/rdf">
                                RDF
                            </Link>
                        }
                        {this.props.features.includes('admin') &&
                            <Query query={GET_ME}>
                                {({ loading, error, data }) => {
                                    console.log(error,data);
                                    var me = data.getMe;
                                    if((Object.keys(data).length !== 0) && (me.role=='ADMIN')) {
                                        return (
                                            <Link style={{marginRight:'5px'}} to="/adminusers">
                                                Admin
                                            </Link>
                                        );
                                    } else {
                                        return(
                                            <span></span>
                                        );
                                    }
                                }}
                            </Query>
                        }
                        {this.props.features.includes('auth') &&
                            <button onClick={() => {
                                    localStorage.removeItem('auth-token');
                                    console.log(this.props.hash);
                                    window.location.reload();
                                }}
                            >
                                logout
                            </button>
                        }
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
