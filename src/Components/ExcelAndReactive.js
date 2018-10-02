import {Component} from "react";
import SheetJS from "./ExcelAndReactiveComps/SheetJS";
import ReactiveSearch from "./ExcelAndReactiveComps/ReactiveSearch";
import React from "react";
import UserAreaHeader from "./UserAreaHeader";

class ExcelAndReactive extends Component {
    render() {
        return (
            <div>
                <UserAreaHeader/>
                <div style={{width:'60%', float:'left', display:'inline-block'}}>
                    <SheetJS/>
                </div>
                <div style={{width:'40%', float:'right', display:'inline-block'}}>
                    <ReactiveSearch/>
                </div>
            </div>
        );
    }
}

export default ExcelAndReactive;
