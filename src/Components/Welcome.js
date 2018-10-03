import {Component} from "react";
import React from "react";
import UserAreaHeader from "./UserAreaHeader";

class Welcome extends Component {
    render() {
        const authToken = localStorage.getItem('auth-token');
        return (
            <div>
                <UserAreaHeader/>
                {authToken ? (
                    <h3>Welcome</h3>
                ) : (
                    <div></div>
                )}
            </div>
        );
    }
}

export default Welcome;
