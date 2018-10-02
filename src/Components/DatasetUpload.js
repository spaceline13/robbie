import {Component} from "react";
import React from "react";
import UserAreaHeader from "./UserAreaHeader";
import { Form, Text } from 'informed';
import request from "superagent";

class DatasetUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            title: '',
            profile: '',
            description: '',
            version: '',
            author: '',
            license: [],
            keywords: [],
            resources: []
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.fileChange = this.fileChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
    };
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    fileChange(e) {
        var res = [];
        res.push(e.target.files[0]);
        this.setState({resources:res});
        console.log(this.state.resources);
    }
    formSubmit(e){
        console.log(e)
        const req = request.post('http://localhost:2000/uploadDataset');
        for(var key in this.state){
            if(key=="resources"){
                if(this.state.resources.length>0) {
                    req.attach(this.state.resources[0].name, this.state.resources[0]);
                }
            } else {
                req.field(key,this.state[key]);
            }
            console.log(key);
        }
        req.field('username','timos');
        req.end();
    }
    render() {
        const state = this.state;
        const handleInputChange = this.handleInputChange;
        const fileChange = this.fileChange;
        const formSubmit = this.formSubmit;
        return (
            <div>
                <UserAreaHeader/>
                <form onSubmit={formSubmit}>
                    {Object.keys(state).map(function(key, index) {
                        return (
                            <div key={key} >
                                <label>{key}
                                    {key=="resources"?
                                        <input type="file" onChange={fileChange} />
                                    :
                                        <input name={key} type="text" value={state[key]} onChange={handleInputChange} />
                                    }
                                </label>
                                <br />
                            </div>
                        );
                    })}
                    <input type="submit"/>
                </form>
            </div>
        );
    }
}

export default DatasetUpload;