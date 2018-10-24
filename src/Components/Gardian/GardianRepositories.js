import {Component} from "react";
import React from "react";
import UserAreaHeader from "../UserAreaHeader";
import { Link } from 'react-router-dom';

class GardianRepositories extends Component {
    render() {
        const authToken = localStorage.getItem('auth-token');
        return (
            <div>
                <UserAreaHeader features={['auth','myData','upload']}/>
                {authToken ? (
                    <center>
                        <Link to="/upload" style={{display:"inline-block", cursor: "pointer", margin:"15px", textDecoration:"none"}}>
                            <button style={{
                                backgroundImage: "url('https://www.freeiconspng.com/uploads/upload-icon-11.jpg')",
                                width: "200px",
                                height: "200px",
                                backgroundColor: "white",
                                backgroundRepeat: "round",
                                border: "1px solid grey",
                                cursor: "pointer",
                                borderRadius: "10px"}}></button><br />
                            Upload Datapackage
                        </Link>
                        <Link to="/myData" style={{display:"inline-block", cursor: "pointer", margin:"15px", textDecoration:"none"}}>
                            <button style={{
                                backgroundImage: "url('https://assets.okfn.org/p/data/img/icon-512.png')",
                                width: "200px",
                                height: "200px",
                                backgroundColor: "white",
                                backgroundRepeat: "round",
                                border: "1px solid grey",
                                cursor: "pointer",
                                borderRadius: "10px"}}></button><br />
                            My Datapackages
                        </Link>
                    </center>
                ) : (
                    <div></div>
                )}
            </div>
        );
    }
}

export default GardianRepositories;
