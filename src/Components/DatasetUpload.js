import {Component} from "react";
import React from "react";
import UserAreaHeader from "./UserAreaHeader";
import { Form, Text } from 'informed';
import request from "superagent";
import CKEditor from 'react-ckeditor-wrapper';
import AsyncSelect  from 'react-select/lib/Async';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
const gql = require('graphql-tag');
const { Mutation } = require('react-apollo');

const UPLOAD = gql`
      mutation($file: Upload!) {
            uploadDatapackage(file:$file)
      }
`;

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
            date:moment(),
            license: [],
            keywords: [],
            resources: []
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
    };
    handleInputChange(event) {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });
    }
    handleFileChange(e) {
        var res = [];
        res.push(e.target.files[0]);
        this.setState({resources:res});
    }
    formSubmit(e){
        const req = request.post('http://localhost:2000/uploadDataset');
        for(var key in this.state){
            if(key=="resources"){
                if(this.state.resources.length>0) {
                    req.attach(this.state.resources[0].name, this.state.resources[0]);
                }
            } else {
                if(typeof this.state[key] === 'object'){
                    if(this.state[key] instanceof moment){
                        req.field(key,this.state[key]);
                    }else{
                        req.field(key,JSON.stringify(this.state[key]));
                    }
                } else {
                    req.field(key,this.state[key]);
                }
            }
        }
        req.field('username','timos');
        req.end();
    }
    fetchKeywords = (inputValue, callback) => {
        fetch("http://192.168.1.102:9200/agrovoc/_search?q="+inputValue).then(response => response.json()).then(data => {
            var res = data.hits;
            var objArr = [];
            res.hits.forEach(function(hit){
                objArr.push({label:hit._source.label, value:hit._source.URI});
            });
            callback(objArr);
        });
    };
    render() {
        const authToken = localStorage.getItem('auth-token');
        const licesnes = [{name:'cc0',title:'mplampla',path:'www',label:'cc0'},{name:'ogl',title:'mplampla',path:'wwww',label:'ogl'}];
        return (
            <div>
                <UserAreaHeader/>

                <Mutation
                    mutation={UPLOAD}
                    onCompleted={data => console.log('mutation:',data)}
                >
                    {mutate => (
                        <input
                            type="file"
                            required
                            onChange={({
                               target: {
                                   files: [file]
                               }
                            }) => mutate({ variables: { file } })}
                        />
                    )}
                </Mutation>

                {authToken ? (
                <form onSubmit={this.formSubmit}>
                    <label>name<input name="name" type="text" value={this.state.name} onChange={this.handleInputChange} /></label><br />
                    <label>title<input name="title" type="text" value={this.state.title} onChange={this.handleInputChange} /></label><br />
                    <label>profile<input name="profile" type="text" value={this.state.profile} onChange={this.handleInputChange} /></label><br />
                    <label>version<input name="version" type="text" value={this.state.version} onChange={this.handleInputChange} /></label><br />
                    <label>description<CKEditor value={this.state.description} onChange={(value)=>this.setState({ description:value })} /></label><br />
                    <label>date<DatePicker selected={this.state.date} onChange={(date)=>this.setState({ date:date })}/></label><br />
                    <label>license<Select options={licesnes} value={this.state.license} onChange={(license)=>this.setState({ license:license })} /></label><br />
                    <label>keywords<AsyncSelect loadOptions={this.fetchKeywords} value={this.state.keywords} onChange={(keyword)=>this.setState({ keywords:keyword })} isMulti /></label><br />
                    <label>resources<input type="file" onChange={this.handleFileChange} /></label><br />
                    <input type="submit"/>
                </form>
                ):<div></div>}
            </div>
        );
    }
}

export default DatasetUpload;