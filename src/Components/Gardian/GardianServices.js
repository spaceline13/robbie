import {Component} from "react";
import React from "react";
import UserAreaHeader from "../UserAreaHeader";
import { Link } from 'react-router-dom';

class GardianServices extends Component {
    render() {
        return (
            <div>
                <UserAreaHeader features={['rdf','gardianRepo']}/>
                <center>
                    <Link to="/rdf" style={{display:"inline-block", cursor: "pointer", margin:"15px", textDecoration:"none"}}>
                        <button style={{
                            backgroundImage: "url('https://www.w3.org/RDF/icons/rdf_w3c_icon.128')",
                            width: "200px",
                            height: "200px",
                            backgroundColor: "white",
                            backgroundRepeat: "round",
                            border: "1px solid grey",
                            cursor: "pointer",
                            borderRadius: "10px"}}></button><br />
                        Make RDF
                    </Link>
                    <Link to="/gardianRepo" style={{display:"inline-block", cursor: "pointer", margin:"15px", textDecoration:"none"}}>
                        <button style={{
                            backgroundImage: "url('https://static.thenounproject.com/png/15201-200.png')",
                            width: "200px",
                            height: "200px",
                            backgroundColor: "white",
                            backgroundRepeat: "round",
                            border: "1px solid grey",
                            cursor: "pointer",
                            borderRadius: "10px"}}></button><br />
                        Repositories
                    </Link>
                </center>
            </div>
        );
    }
}

export default GardianServices;
