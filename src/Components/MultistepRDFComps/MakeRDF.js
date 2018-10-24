import React, {Component} from 'react';
import XLSX from 'xlsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import RDFSheet from './RDFSheet';
import fileDownload from 'js-file-download';
import {formatDataForRDFization} from "../../lib/dataFormatter";

class MakeRDF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sheetNames: [],
            currentSheet: null,
            selectedHeader: null,
            loaded: false,
            columnDefs: [],
            rowData: [],
            globalValidHeaders:0
        };
        this.sheets = [];
        this.editedSheets = this.props.parent.state.rdfModel?props.parent.state.rdfModel:[];
        this.openFile = this.openFile.bind(this);
        this.openFile(this.props.parent.state.excelFile);
        this.saveSheet = this.saveSheet.bind(this);
        this.checkHeaderValidation = this.checkHeaderValidation.bind(this);
        this.increaseGlobalChecks = this.increaseGlobalChecks.bind(this);
        this.decreaseGlobalChecks = this.decreaseGlobalChecks.bind(this);
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
            this.setState({currentSheet: 0});
            this.setState({sheetNames: sheets});
            this.setState({validSheets: sheets});
            this.setState({loaded:true});
        };
        if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
    };
    checkHeaderValidation(sheetName,headerI){
        const nameValidator = this.sheets[sheetName].state.headers[headerI].isNameValid;
        const classOfValidator = (!(this.sheets[sheetName].state.headers[headerI].currentType=='Class')) || this.sheets[sheetName].classOfRef[headerI].checkValid();
        const manualValidator = (!(this.sheets[sheetName].state.headers[headerI].currentType=='Manual')) || this.sheets[sheetName].manualRef[headerI].checkValid();
        //console.log(nameValidator,classOfValidator,manualValidator);
        if(nameValidator&&classOfValidator&&manualValidator){
            return true;
        } else {
            return false;
        }
    }
    saveSheet(sheetName){
        if(this.sheets[sheetName].state.hasBeenEdited){
            var name = this.sheets[sheetName].props.sheetName;
            var headers = [];
            var validSheet = true;
            if(this.sheets[sheetName] && this.sheets[sheetName].state.headers){
                for (var i=0;i<this.sheets[sheetName].state.headers.length;i++){
                    if (this.sheets[sheetName].state.headers[i].checked) {
                        headers[i] = (this.sheets[sheetName].state.headers[i]);
                        if(!this.checkHeaderValidation(sheetName,i)){
                            validSheet = false;
                            //console.log('entered not valid',i);
                        }
                    }
                }
            }
            //this.setState({validSheets:})
            this.editedSheets[name]=headers;
            this.editedSheets[name]['isValid']=validSheet;
            //ui
            var elem = document.getElementById('react-tabs-'+sheetName*2);
            if(elem && validSheet)
                elem.style.backgroundColor = '#00800040';
            else
                elem.style.backgroundColor = '#e67f7f';
        }
    }
    download(content, fileName, contentType) {
        var modelJSON = {sheets:{}};
        var rdfJSON = {sheets:[]};
        var validDoc = true;
        for(var sheet in content){
            modelJSON.sheets[sheet] = {headers:{}};
            rdfJSON.sheets[sheet] = {headers:null};
            const data = XLSX.utils.sheet_to_json(this.props.parent.state.workbook.Sheets[sheet], {header:1});
            for (var header in content[sheet]){
                modelJSON.sheets[sheet].headers[header] = content[sheet][header];
                if(!content[sheet]['isValid']) {
                    validDoc = false;
                }
            }
            //setTimeout(function(){
            rdfJSON.sheets[sheet].headers = formatDataForRDFization(data,modelJSON.sheets[sheet].headers);
            console.log('data:',rdfJSON);
            //},3000);
        }
        if(validDoc) {
            //console.log(JSON, JSON.stringify(modelJSON));
            var file = new Blob([JSON.stringify(modelJSON)], {type: contentType});
            fileDownload(file, fileName);
        } else {
            alert('You have sheets with not valid info. Please correct them and try again')
        }
    }
    makeJSONincludingData(content){

    }
    increaseGlobalChecks(){
        console.log(this.state.globalValidHeaders);
        this.setState({globalValidHeaders:this.state.globalValidHeaders+1});
    }
    decreaseGlobalChecks(){
        console.log(this.state.globalValidHeaders);
        this.setState({globalValidHeaders:this.state.globalValidHeaders-1});
    }
    render() {
        return (
            <div>
                {this.state.loaded?
                    <div>
                        {this.state.sheetNames.length > 0 ?
                            <div>
                                <Tabs onSelect={(index,lastIndex) => { this.saveSheet(lastIndex); this.setState({currentSheet:index})}}>
                                    <TabList>
                                        {this.state.sheetNames.map((name, i) =>
                                            <Tab key={i}>{name.label}</Tab>
                                        )}
                                    </TabList>
                                    {this.state.sheetNames.map((name, i) =>
                                        <TabPanel key={i}>
                                            <RDFSheet
                                                ref={(rdfSheet) => {this.sheets[i] = rdfSheet}}
                                                sheetName={name.label}
                                                sheet={this.props.parent.state.workbook.Sheets[name.label]}
                                                savedData={this.editedSheets[name.label]}
                                                increaseGlobalChecks={this.increaseGlobalChecks}
                                                decreaseGlobalChecks={this.decreaseGlobalChecks}
                                            />
                                        </TabPanel>
                                    )}
                                </Tabs>
                                <div>
                                    <button onClick={()=>{
                                        this.saveSheet(this.state.currentSheet);
                                        this.download(this.editedSheets,'myJSON.json','application/json');
                                    }} className={this.state.globalValidHeaders>0?'':'disabled'}>download model</button>
                                    <button onClick={()=>{
                                        this.props.jumpToStep(3);
                                    }} className={this.state.globalValidHeaders>0?'':'disabled'}>generate rdf</button>
                                </div>
                            </div>
                        : <div></div>
                        }
                    </div>
                    :<div>Loading file...</div>}
            </div>
        );
    };
};

export default MakeRDF;