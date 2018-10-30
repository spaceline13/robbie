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
import MultiInput from "./DatapackageUploadComps/MultiInput";

class DatapackageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            title: '',
            creator:'',
            contributor:'',
            description: '',
            publisher:'',
            date:moment(),
            type:'',
            sources: '',
            relation: '',
            license: [],
            rights:'',
            subject: [],
            resources: []
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.formRef = React.createRef();
        this.setFiles = this.setFiles.bind(this);
        this.getFiles = this.getFiles.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.files = [];
    };
    handleInputChange(event) {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });
    }
    handleValueChange(name,value){
        console.log(name,value);
        this.setState({
            [name]: value
        });
        console.log(this.state);
    }
    handleFileChange(data) {
        var res = [];
        for(var i=0;i<data.length;i++){
            res[i] = {name:data[i].name,path:data[i].path};
        }
        this.setState({resources:res});
        console.log(this.state);
    }
    setFiles(files){
        console.log('set',files);
        this.files = files;
        console.log('set2',this.files);
    }
    getFiles(){
        return {files:this.files};
    }
    resetForm (){
        this.formRef.current.reset();
        this.setState({
            name: '',
            title: '',
            creator:'',
            contributor:'',
            description: '',
            publisher:'',
            date:moment(),
            type:'',
            sources: '',
            relation: '',
            license: [],
            rights:'',
            subject: [],
            resources: []
        })
    };

    render() {
        const authToken = localStorage.getItem('auth-token');
        const licesnes = [{name:'CC0',title:'CC0',path:'https://creativecommons.org/share-your-work/public-domain/cc0/',label:'CC0'},{name:'NONE',title:'NONE',path:'',label:'NONE'}];
        return (
            <div>
                <UserAreaHeader features={['auth','upload','myData']}/>
                {authToken ? (
                <form ref={this.formRef}>
                    <label>Name<input name="name" type="text" value={this.state.name} onChange={this.handleInputChange} /></label><br />
                    <label>Title<input name="title" type="text" value={this.state.title} onChange={this.handleInputChange} /></label><br />
                    <label>Creators<MultiInput value={this.state.creator} placeholder={'add creator and press enter'} setParentValue={(value)=>{this.handleValueChange('creator',value)}}/></label><br />
                    <label>Contributors<MultiInput value={this.state.contributor} placeholder={'add contributor and press enter'} setParentValue={(value)=>{this.handleValueChange('contributor',value)}}/></label><br />
                    <label>Description<CKEditor value={this.state.description} onChange={(value)=>this.setState({ description:value })} /></label><br />
                    <label>Subjects<MultiSelectRemote value={this.state.subject} setValue={(subject)=>this.setState({ subject:subject })} /></label><br />
                    <label>Publishers<MultiInput value={this.state.publisher} placeholder={'add publisher and press enter'} setParentValue={(value)=>{this.handleValueChange('publisher',value)}}/></label><br />
                    <label>Date<DatePicker selected={this.state.date} onChange={(date)=>this.setState({ date:date })}/></label><br />
                    <label>Data type<input name="type" type="text" value={this.state.type} onChange={this.handleInputChange} /></label><br />
                    <label>Data sources<MultiInput value={this.state.sources} placeholder={'add source and press enter'} setParentValue={(value)=>{this.handleValueChange('sources',value)}}/></label><br />
                    <label>Related material<MultiInput value={this.state.relation} placeholder={'add relation and press enter'} setParentValue={(value)=>{this.handleValueChange('relation',value)}}/></label><br />
                    <label>License<Select options={licesnes} value={this.state.license} onChange={(license)=>this.setState({ license:license })} /></label><br />
                    <label>Terms of use<input name="rights" type="text" value={this.state.rights} onChange={this.handleInputChange} /></label><br />
                    {this.props.noResource?<div></div>:<label>resources<UploadDataset form={this.formRef} setFiles={this.setFiles} changeFile={this.handleFileChange}/></label>}<br />
                    <DatapackageMutation resetForm={this.resetForm} onSubmit={this.props.onSubmit} getFiles={this.getFiles} vars={this.state}/>
                </form>
                ):<div></div>}
            </div>
        );
    }
}

export default DatapackageUpload;