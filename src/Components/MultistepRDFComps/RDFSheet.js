import React, {Component} from 'react';
import XLSX from 'xlsx';
import {getHeaders} from '../../lib/dataFormatter';
import Select from 'react-simpler-select';
//import Iframe from 'react-iframe';
import Checkbox from 'rc-checkbox';
import ManualTypes from "./RDFSheet/ManualTypes";
import ClassTypes from "./RDFSheet/ClassTypes";

class RDFSheet extends Component {
    constructor(props) {
        super(props);
        var h = getHeaders(XLSX.utils.sheet_to_json(this.props.sheet, {header:1}));
        ///load saved data start
        if(props.savedData) {
            if (props.savedData.length <= h.length) {
                for (var key in props.savedData) {
                    h[key] = props.savedData[key];
                }
            } else {
                console.log(props.savedData,h);
                alert('The model (json file) you chose contains more columns than the excel sheet in the document you inserted and therefore it cannot be used in this sheet. You can try to use another model or continue editing the fields from scratch.')
            }
        }
        this.state = {
            typeNames:[{label:'Class of', value:'Class'},{label:'Manually define', value:'Manual'}],
            selectedHeader: null,
            hasBeenEdited:false,
            headers:h
        };

        //iframeUrl:'https://www.ebi.ac.uk/ols/search?q=',

        this.char = 'A';
        //this.olsSelectRefs = [];
        this.manualSelect = [];
        this.classSelect = [];
        this.headerLines = [];
        this.classOfRef = [];
        this.manualRef = [];
        //this.iframe = React.createRef();
        this.editHeader = this.editHeader.bind(this);
        this.selectType = this.selectType.bind(this);
        this.toggleHeaderLines = this.toggleHeaderLines.bind(this);
        this.toggleClassManual = this.toggleClassManual.bind(this);
        this.generateChar = this.generateChar.bind(this);

    };
    editHeader(header,field,value) {
        var h = this.state.headers;
        h[header][field] = value;
        if (field == 'headerName') {
            if ((!value) || (value == '')) {
                h[header]['isNameValid'] = false;
            } else {
                h[header]['isNameValid'] = true;
            }
        }
        this.setState({headers:h});
        this.setState({hasBeenEdited:true});
    }
    selectType(typeName,i){
        this.setState({selectedHeader:i});
        //ui
        if(typeName=="Manual"){
            this.toggleClassManual(0,i);
            if(this.state.headers[i].currentType=="Class") {
                this.editHeader(i, 'classOf', null);
            }
            //this.toggleIframe(false);
        }else if(typeName=="Class"){
            this.toggleClassManual(1,i);
            if(this.state.headers[i].currentType=="Manual") {
                this.editHeader(i, 'format', null);
                this.editHeader(i, 'measure', null);
                this.editHeader(i, 'type', null);
                this.editHeader(i, 'vocabulary', null);
            }
            //this.toggleIframe(true);
        }
        this.editHeader(i,'currentType',typeName);
        this.setState({hasBeenEdited:true});
    }
    toggleClassManual(selectClass,i){
        var classS = this.classSelect[i];
        var manual = this.manualSelect[i];
        if((selectClass===1) && classS && manual){
            classS.style.display = 'inline-block';
            manual.style.display = 'none';
        } else {
            manual.style.display = 'inline-block';
            classS.style.display = 'none';
        }
    }
    /*toggleIframe(open){
        var iframe = this.iframe.refs.iframe;
        if(iframe.style) {
            if (open) {
                if (iframe.style.display == 'none')
                    iframe.style.display = 'block';
            } else {
                iframe.style.display = 'none';
            }
        }
    }*/
    toggleHeaderLines(checked,i){
        this.setState({hasBeenEdited:true});
        if(checked){
            this.headerLines[i].style.display='inline-block';
            this.state.headers[i].checked=true;
            this.props.increaseGlobalChecks();
        }else{
            this.headerLines[i].style.display='none';
            this.state.headers[i].checked=false;
            this.props.decreaseGlobalChecks();
            //this.toggleIframe(false);
        }
    }
    generateChar(i){
        //get letter to generate
        var c = this.char;
        //increment letter
        var lastC = c.substr(c.length - 1);
        if(lastC=='Z'){
            this.char=this.char.substr(0,c.length-1)+'AA';
        } else {
            this.char=this.char.substr(0,c.length-1)+String.fromCharCode(lastC.charCodeAt(0)+1);
        }
        return c;
    }
    render() {
        this.char = 'A';
        return (
            <div>
                {this.state.headers.length>0?
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <ul style={{listStyle: 'none'}} >
                                    {this.state.headers.map((header, i) =>
                                        <li key={i}>
                                            <Checkbox defaultChecked={header.checked} onChange={(e)=>{this.toggleHeaderLines(e.target.checked,i)}}/>
                                            <b>{this.generateChar(header)+" ("+header.headerName})</b>&nbsp;
                                            <span ref={(element)=>this.headerLines[i]=element} style={{display:header.checked?'inline-block':'none'}}>
                                                contains data about
                                                <Select
                                                    placeholder="Select a type"
                                                    defaultValue={header.currentType}
                                                    options={this.state.typeNames}
                                                    onChange={(value)=>{this.selectType(value,i)}}
                                                    style={{width:'140px'}}
                                                />
                                                &nbsp;
                                                <span
                                                    ref={(element)=>this.classSelect[i]=element}
                                                    style={{display:header.currentType=='Class'?'inline-block':'none'}}
                                                >
                                                    of type&nbsp;
                                                    <ClassTypes
                                                        classOf={header.classOf?header.classOf:null}
                                                        onSelect={(value)=>{this.editHeader(i,'classOf',value)}}
                                                        onFocus={()=>{this.setState({selectedHeader:i})}}
                                                        ref={(element)=>this.classOfRef[i]=element}
                                                    />
                                                </span>
                                                <span
                                                    ref={(element)=>this.manualSelect[i]=element}
                                                    id={'Manual'+i}
                                                    style={{display:header.currentType=='Manual'?'inline-block':'none'}}
                                                >
                                                    <span style={{width:'200px'}}>
                                                        of type
                                                        <ManualTypes ref={(element)=>{this.manualRef[i]=element}} parent={this} header={i} savedData={this.props.savedData?this.props.savedData[i]:null}/>
                                                    </span>
                                                </span>
                                                <span>
                                                    with name
                                                    <input type="text" onChange={(e)=>{this.editHeader(i,'headerName',e.target.value)}} defaultValue={header.headerName} style={header.isNameValid?{display:'inline-block',width:'180px',border:'1px solid green'}:{display:'inline-block',width:'180px',border:'1px solid red'}}/>&nbsp;
                                                </span>
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </td>

                        </tr>
                        </tbody>
                    </table>
                    :<div>No headers to show</div>}
            </div>
        );
    };
};

export default RDFSheet;

/*
<td style={{verticalAlign:'top'}}>
<div style={{ width: '800px', height: '300px', position: 'absolute', background: 'white', zIndex: '-1', top: '-130px', marginLeft:'-200px' }}></div>
<div style={{ width: '200px', height: '654px', position: 'absolute', background: 'white', zIndex: '-1', top: '170px', marginLeft:'-200px'  }}></div>
<div style={{ width: '40px', height: '654px', position: 'absolute', background: 'white', zIndex: '-1', top: '170px', marginLeft:'582px'    }}></div>
<Iframe
ref={(element)=>this.iframe=element}
url={this.state.iframeUrl}
width="800px"
height="900px"
styles={{overflow: "hidden",zIndex:"-2",marginTop:'-230px',marginLeft:'-200px'}}
display="none"
position="absolute"
onLoad={(e) => {
    this.iframe.refs.iframe.scrolling="no";
    //take the focus from iframe and give it to the input box
    var elem = null
    if(this.state.selectedHeader!==null)
        elem = this.olsSelectRefs[this.state.selectedHeader].input;
    if (elem)
        elem.focus();
}}
/>
</td>
*/