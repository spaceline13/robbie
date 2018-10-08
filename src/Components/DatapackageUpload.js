import {Component} from "react";
import React from "react";
import UserAreaHeader from "./UserAreaHeader";
import { Form, Text } from 'informed';
import request from "superagent";
import CKEditor from 'react-ckeditor-wrapper';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import UploadDataset from "./DatapackageUploadComps/UploadDataset";
import AutocompleteRemote from "./DatapackageUploadComps/AutocompleteRemote";
import DatapackageMutation from "./DatapackageUploadComps/DatapackageMutation"
class DatapackageUpload extends Component {
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
        this.formRef = React.createRef();
        this.resetForm = this.resetForm.bind(this);
    };
    handleInputChange(event) {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });
    }
    handleFileChange(data) {
        data = data.data.uploadDataset;
        var res = [];
        res.push({name:data.name,path:data.path});
        this.setState({resources:res});
        console.log(this.state);
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
    resetForm (){
        this.formRef.current.reset();
        this.setState({
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
        })
    };

    render() {
        const authToken = localStorage.getItem('auth-token');
        const licesnes = [{name:'cc0',title:'mplampla',path:'www',label:'cc0'},{name:'ogl',title:'mplampla',path:'wwww',label:'ogl'}];
        return (
            <div>
                <UserAreaHeader/>
                {authToken ? (
                <form onSubmit={this.formSubmit} ref={this.formRef}>
                    <label>name<input name="name" type="text" value={this.state.name} onChange={this.handleInputChange} /></label><br />
                    <label>title<input name="title" type="text" value={this.state.title} onChange={this.handleInputChange} /></label><br />
                    <label>profile<input name="profile" type="text" value={this.state.profile} onChange={this.handleInputChange} /></label><br />
                    <label>version<input name="version" type="text" value={this.state.version} onChange={this.handleInputChange} /></label><br />
                    <label>description<CKEditor value={this.state.description} onChange={(value)=>this.setState({ description:value })} /></label><br />
                    <label>date<DatePicker selected={this.state.date} onChange={(date)=>this.setState({ date:date })}/></label><br />
                    <label>license<Select options={licesnes} value={this.state.license} onChange={(license)=>this.setState({ license:license })} /></label><br />
                    <label>keywords<AutocompleteRemote value={this.state.keywords} setValue={(keyword)=>this.setState({ keywords:keyword })} /></label><br />

                    <label>resources<UploadDataset form={this.formRef} changeFile={this.handleFileChange}/></label><br />
                    <DatapackageMutation resetForm={this.resetForm} vars={this.state}/>
                </form>
                ):<div></div>}
            </div>
        );
    }
}

export default DatapackageUpload;