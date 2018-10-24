import {Component} from "react";
import React from "react";
import { Link } from 'react-router-dom';

class UserAreaHeader extends Component {
    render() {
        const authToken = this.props.features.includes('auth')?localStorage.getItem('auth-token'):true;
        return (
            <div>
                {authToken ? (
                    <div>
                        {this.props.features.includes('upload')?<Link style={{marginRight:'5px'}} to="/upload">
                            Upload Datapackage
                        </Link>:<span></span>}
                        {this.props.features.includes('excel')? <Link style={{marginRight:'5px'}} to="/excel">
                            Excel Editor
                        </Link>:<span></span>}
                        {this.props.features.includes('myData')? <Link style={{marginRight:'5px'}} to="/myData">
                            My Datapackages
                        </Link>:<span></span>}
                        {this.props.features.includes('rdf')? <Link style={{marginRight:'5px'}} to="/rdf">
                            RDF
                        </Link>:<span></span>}
                        {this.props.features.includes('auth')?
                        <button onClick={() => {
                                localStorage.removeItem('auth-token');
                                console.log(this.props.hash);
                                window.location.reload();
                            }}
                        >
                            logout
                        </button>:<span></span>}
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
