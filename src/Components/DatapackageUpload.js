import {Component} from "react";
import React from "react";
import UserAreaHeader from "./UserAreaHeader";
import { Form, Text } from 'informed';
import CKEditor from 'react-ckeditor-wrapper';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import UploadDataset from "./DatapackageUploadComps/UploadDataset";
import MultiSelectRemote from "./DatapackageUploadComps/MultiSelectRemote";
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
        /*const req = request.post('http://localhost:2000/uploadDataset');
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
        req.end();*/
        this.props.onSubmit();
    }
    resetForm (){
        this.formRef.current.reset();
        this.setState({
            name: '',
            title: '',
            author:'',
            conEmail:'',
            description: '',
            subject:'',
            producer:'',
            date:moment(),
            kind:'',
            sources: '',
            related: '',
            license: [],
            terms:'',
            keywords: [],
            resources: []
        })
    };

    render() {
        const authToken = localStorage.getItem('auth-token');
        const licesnes = [{name:'cc0',title:'mplampla',path:'www',label:'cc0'},{name:'ogl',title:'mplampla',path:'wwww',label:'ogl'}];
        return (
            <div>
                {authToken ? (
                <form onSubmit={this.formSubmit} ref={this.formRef}>
                    <label>Name<input name="name" type="text" value={this.state.name} onChange={this.handleInputChange} /></label><br />
                    <label>Title<input name="title" type="text" value={this.state.title} onChange={this.handleInputChange} /></label><br />
                    <label>Author<input name="author" type="text" value={this.state.author} onChange={this.handleInputChange} /></label><br />
                    <label>Contributor Email<input name="conEmail" type="text" value={this.state.conEmail} onChange={this.handleInputChange} /></label><br />
                    <label>Description<CKEditor value={this.state.description} onChange={(value)=>this.setState({ description:value })} /></label><br />
                    <label>Subject<input name="subject" type="text" value={this.state.subject} onChange={this.handleInputChange} /></label><br />
                    <label>Producer<input name="producer" type="text" value={this.state.producer} onChange={this.handleInputChange} /></label><br />
                    <label>Date<DatePicker selected={this.state.date} onChange={(date)=>this.setState({ date:date })}/></label><br />
                    <label>Kind of data<input name="kind" type="text" value={this.state.kind} onChange={this.handleInputChange} /></label><br />
                    <label>Data sources<input name="sources" type="text" value={this.state.sources} onChange={this.handleInputChange} /></label><br />
                    <label>Related material<input name="related" type="text" value={this.state.related} onChange={this.handleInputChange} /></label><br />
                    <label>License<Select options={licesnes} value={this.state.license} onChange={(license)=>this.setState({ license:license })} /></label><br />
                    <label>Terms of use<input name="terms" type="text" value={this.state.terms} onChange={this.handleInputChange} /></label><br />
                    <label>References by <MultiSelectRemote value={this.state.keywords} setValue={(keyword)=>this.setState({ keywords:keyword })} /></label><br />
                    <label>keywords<MultiSelectRemote value={this.state.keywords} setValue={(keyword)=>this.setState({ keywords:keyword })} /></label><br />

                    {this.props.noResource?<div></div>:<label>resources<UploadDataset form={this.formRef} changeFile={this.handleFileChange}/></label>}<br />
                    <DatapackageMutation resetForm={this.resetForm} onSubmit={this.props.onSubmit} vars={this.state}/>
                </form>
                ):<div></div>}
            </div>
        );
    }
}

export default DatapackageUpload;