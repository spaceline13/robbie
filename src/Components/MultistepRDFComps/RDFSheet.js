import React, {Component} from 'react';
import XLSX from 'xlsx';
import {getHeaders} from '../../lib/dataFormatter';
import Select from 'react-simpler-select';
import Iframe from 'react-iframe';
import AutocompleteRemote from "../Utils/AutocompleteRemote";
import Checkbox from 'rc-checkbox';
import ManualTypes from "./RDFSheet/ManualTypes";

class RDFSheet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeNames:[{label:'Class of', value:'Class'},{label:'Manually define', value:'Manual'}],
            selectedHeader: null,
            columnDefs: [],
            rowData: [],
            ols:null,
            iframeUrl:'https://www.ebi.ac.uk/ols/search?q=',
            headers:getHeaders(XLSX.utils.sheet_to_json(this.props.sheet, {header:1}))
        };
        this.char = 'A';
        this.olsSelectRefs = [];
        this.manualSelect = [];
        this.classSelect = [];
        this.headerLines = [];
        this.iframe = React.createRef();
        this.editHeader = this.editHeader.bind(this);
        this.selectType = this.selectType.bind(this);
        this.selectClass = this.selectClass.bind(this);
        this.toggleHeaderLines = this.toggleHeaderLines.bind(this);
        this.toggleClassManual = this.toggleClassManual.bind(this);
        this.generateChar = this.generateChar.bind(this);

    };
    editHeader(header,field,value){
        var h = this.state.headers;
        h[header][field] = value;
        this.setState({headers:h});
    }
    selectType(typeName,i){
        this.setState({selectedHeader:i});
        this.editHeader(i,'currentType',typeName);
        //ui
        if(typeName=="Manual"){
            this.toggleClassManual(0,i);
            this.toggleIframe(false);
        }else if(typeName=="Class"){
            this.toggleClassManual(1,i);
            this.toggleIframe(true);
        }
    }
    selectClass(classOf,i){
        this.toggleIframe(false);
        var h = this.state.headers;
        h[i].classOf = classOf;
        this.setState({headers:h});
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
    toggleIframe(open){
        var iframe = this.iframe.refs.iframe;
        if(iframe.style) {
            if (open) {
                if (iframe.style.display == 'none')
                    iframe.style.display = 'block';
            } else {
                iframe.style.display = 'none';
            }
        }
    }
    toggleHeaderLines(checked,i){
        if(checked){
            this.headerLines[i].style.display='inline-block';
            this.state.headers[i].checked=true;
        }else{
            this.headerLines[i].style.display='none';
            this.state.headers[i].checked=false;
            this.toggleIframe(false);
        }
    }
    generateChar(){
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
                                            <Checkbox onChange={(e)=>{this.toggleHeaderLines(e.target.checked,i)}}/>
                                            <b>{this.generateChar()+" ("+header.headerName})</b>&nbsp;
                                            <span ref={(element)=>this.headerLines[i]=element} style={{display:'none'}}>
                                                contains data about <Select placeholder="Select a type" options={this.state.typeNames} onChange={(value)=>{this.selectType(value,i)}}/>&nbsp;
                                                <span ref={(element)=>this.classSelect[i]=element}>
                                                    of type&nbsp;
                                                    <AutocompleteRemote
                                                        ref={(element)=>this.olsSelectRefs[i]=element}
                                                        url={'https://www.ebi.ac.uk/ols/api/search?q='}
                                                        responseObj={'response'}
                                                        resultsObj={'docs'}
                                                        style={{display:'inline-block'}}
                                                        onSelect={(value)=>{
                                                            this.selectClass(value,i);
                                                        }}
                                                        onKeypress={(e)=>{
                                                            var elem = e.target;
                                                            this.setState({iframeUrl:'https://www.ebi.ac.uk/ols/search?q='+elem.value});
                                                            //take the focus back from iframe
                                                            for (var i = 0; i < 15; i++) {
                                                                setTimeout(function () {
                                                                    if(elem)
                                                                        elem.focus();
                                                                }, i * 100)
                                                            }
                                                        }}
                                                        onFocus={()=>{
                                                            this.setState({selectedHeader:i});
                                                            this.toggleIframe(true);
                                                        }}
                                                        getItemValue={(item)=>{
                                                            return item.label + " (" + item.ontology_prefix + ")";
                                                        }}
                                                    />
                                                </span>
                                                <span ref={(element)=>this.manualSelect[i]=element} id={'Manual'+i} style={{display:'none'}}>
                                                    <span style={{width:'200px'}}>
                                                        of type
                                                        <ManualTypes parent={this} header={i}/>
                                                    </span>
                                                </span>
                                                <span>
                                                    with name
                                                    <input value={header.headerName}/>&nbsp;
                                                </span>
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </td>
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
                        </tr>
                        </tbody>
                    </table>
                    :<div>No headers to show</div>}
            </div>
        );
    };
};

export default RDFSheet;