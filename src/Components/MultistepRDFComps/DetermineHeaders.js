import React, {Component} from 'react';
import XLSX from 'xlsx';
import {getHeaders} from '../../lib/dataFormatter';
import Select from 'react-simpler-select';
import Iframe from 'react-iframe';
import AutocompleteRemote from "../Utils/AutocompleteRemote";
import Checkbox from 'rc-checkbox';

class DetermineHeaders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sheetNames: [],
            typeNames:[{label:'Class of', value:'Class'},{label:'Manually define', value:'Manual'}],
            formatNames:[{label:'Select Format', value:'Select'}],
            currentSheet: null,
            selectedHeader: null,
            loaded: false,
            workbook: null,
            columnDefs: [],
            rowData: [],
            headers:[],
            ols:null,
            iframeUrl:'https://www.ebi.ac.uk/ols/search?q=',
            fetchedData:{__html:''}
        };
        this.olsSelectRefs = [];
        this.manualSelect = [];
        this.headerLines = [];
        this.openFile = this.openFile.bind(this);
        this.openFile(this.props.parent.state.excelFile);
        this.selectSheet = this.selectSheet.bind(this);
        this.selectType = this.selectType.bind(this);
        this.selectFormat = this.selectFormat.bind(this);
        this.toggleHeaderLines = this.toggleHeaderLines.bind(this);
    };

    openFile(file) {
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            const excelfile = e.target.result;
            const wb = XLSX.read(excelfile, {type:rABS ? 'binary' : 'array'});
            const sheets = [];
            wb.SheetNames.map(function (name, i) { sheets.push({label:name,value:name})});

            this.props.parent.setState({workbook:wb});
            this.setState({currentSheet: wb.SheetNames[0]});
            this.setState({sheetNames: sheets});
            this.setState({loaded:true});
        };
        if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
    };
    selectSheet(sheetName){
        const sheet = this.props.parent.state.workbook.Sheets[sheetName];
        this.setState({currentSheet:sheetName});
        const data = XLSX.utils.sheet_to_json(sheet, {header:1});
        const headers = getHeaders(data);
        this.setState({headers:headers});
    }
    selectType(typeName,i){
        this.setState({selectedHeader:i});
        if(typeName=="Manual"){
            var h = this.state.headers;
            h[i].formatNames = [{label:"Integer",value:"Integer"},{label:"Float",value:"Float"}];
            h[i].currentType = typeName;
            this.setState({headers:h});

            //UI
            var olsSelect = this.olsSelectRefs[i].element;
            if(olsSelect)
                olsSelect.style.display='none';
            var manual = this.manualSelect[i];
            if(manual)
                manual.style.display = 'inline-block';
            this.toggleIframe(false);
        }else if(typeName=="Class"){
            var h = this.state.headers;
            h[i].formatNames = [{label:"Type1",value:"Type1"},{label:"Type2",value:"Type2"}];
            h[i].currentType = typeName;
            this.setState({headers:h});

            //UI
            var olsSelect = this.olsSelectRefs[i].element;
            if(olsSelect)
                olsSelect.style.display='inline-block';
            var manual = this.manualSelect[i];
            if(manual)
                manual.style.display = 'none';
            this.toggleIframe(true);
        }
    }
    selectFormat(formatName,i){
        this.toggleIframe(false);
        var h = this.state.headers;
        h[i].currentFormat = formatName;
        this.setState({headers:h});
    }
    toggleIframe(open){
        var iframe = document.getElementById("searchIframe");
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
        }else{
            this.headerLines[i].style.display='none';
            this.toggleIframe(false);
        }
    }
    render() {
        return (
            <div>
                {this.state.loaded?
                    <div>
                        <Select placeholder="Select a sheet" options={this.state.sheetNames} onChange={this.selectSheet}/>
                        {this.state.headers.length>0?
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <ul style={{listStyle: 'none'}} >
                                            {this.state.headers.map((header, i) =>
                                                <li key={i}>
                                                    <Checkbox onChange={(e)=>{this.toggleHeaderLines(e.target.checked,i)}}/>
                                                    <b>{header.headerName}</b>&nbsp;
                                                    <span ref={(element)=>this.headerLines[i]=element} style={{display:'none'}}>
                                                        contains data about <Select placeholder="Select a type" options={this.state.typeNames} onChange={(value)=>{this.selectType(value,i)}}/>&nbsp;
                                                        of type&nbsp;
                                                        <AutocompleteRemote
                                                            ref={(element)=>this.olsSelectRefs[i]=element}
                                                            url={'https://www.ebi.ac.uk/ols/api/search?q='}
                                                            style={{display:'inline-block'}}
                                                            onSelect={(value)=>{
                                                                this.selectFormat(value.label,i);
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
                                                                var iframe = document.getElementById("searchIframe");
                                                                if(iframe.style.display='none')
                                                                    iframe.style.display = 'block';
                                                            }}
                                                        />
                                                        <div ref={(element)=>this.manualSelect[i]=element} id={'Manual'+i} style={{display:'none'}}>
                                                            <span>
                                                                with name
                                                                <input placeholder={"name"}/>&nbsp;
                                                            </span>
                                                            <span>
                                                                of type
                                                                <select options={[123,234,345]}/>
                                                            </span>
                                                        </div>
                                                    </span>
                                                </li>
                                            )}
                                        </ul>
                                    </td>
                                    <td style={{verticalAlign:'top'}}>
                                        <Iframe url={this.state.iframeUrl}
                                                width="800px"
                                                height="600px"
                                                id="searchIframe"
                                                className="myClassname"
                                                display="none"
                                                position="relative"
                                                onLoad={(e) => {
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
                :<div>Loading file...</div>}

            </div>
        );
    };
};

export default DetermineHeaders;