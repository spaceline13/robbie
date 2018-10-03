import {Component} from "react";
import React from "react";
import UserAreaHeader from "./UserAreaHeader";
import { Form, Text } from 'informed';
import request from "superagent";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
    handleInputChange(event,data) {
        const value = data?data:event.target.value;//target.type === 'checkbox' ? target.checked : target.value;
        const name = event.target.name;
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
        const authToken = localStorage.getItem('auth-token');
        return (
            <div>

                <CKEditor
                    editor={ ClassicEditor }
                    data=""
                    onInit={ editor => {
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        handleInputChange(event,data);
                    } }
                />
                <UserAreaHeader/>
                {authToken ? (
                <form onSubmit={formSubmit}>
                    <label>name<input name="name" type="text" value={state.name} onChange={handleInputChange} /></label><br />
                    <label>title<input name="title" type="text" value={state.title} onChange={handleInputChange} /></label><br />
                    <label>profile<input name="profile" type="text" value={state.profile} onChange={handleInputChange} /></label><br />
                   <br />
                    <label>version<input name="version" type="text" value={state.version} onChange={handleInputChange} /></label><br />
                    <label>license<input name="license" type="text" value={state.license} onChange={handleInputChange} /></label><br />
                    <label>resources<input type="file" onChange={fileChange} /></label><br />
                    <input type="submit"/>
                </form>
                ):<div></div>}
            </div>
        );
    }
}

export default DatasetUpload;