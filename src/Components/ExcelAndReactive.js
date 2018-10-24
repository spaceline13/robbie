import {Component} from "react";
import SheetJS from "./ExcelAndReactiveComps/SheetJS";
import ReactiveSearch from "./ExcelAndReactiveComps/ReactiveSearch";
import React from "react";
import UserAreaHeader from "./UserAreaHeader";

class ExcelAndReactive extends Component {
    render() {
        const authToken = localStorage.getItem('auth-token');
        return (
            <div>
                <UserAreaHeader features={['auth','excel','rdf','upload','myData']}/>
                {authToken ? (
                <div>
                    <div style={{width:'60%', float:'left', display:'inline-block'}}>
                        <SheetJS/>
                    </div>
                    <div style={{width:'40%', float:'right', display:'inline-block'}}>
                        <ReactiveSearch/>
                    </div>
                </div>
                ):<div></div>}
            </div>
        );
    }
}

export default ExcelAndReactive;
