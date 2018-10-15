import React, {Component} from 'react';
import XLSX from 'xlsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import RDFSheet from './RDFSheet';

class MakeRDF extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sheetNames: [],
            currentSheet: null,
            selectedHeader: null,
            loaded: false,
            workbook: null,
            columnDefs: [],
            rowData: [],
        };
        this.sheets = [];
        this.editedSheets = [];
        this.openFile = this.openFile.bind(this);
        this.openFile(this.props.parent.state.excelFile);
        this.saveSheet = this.saveSheet.bind(this);
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
            this.setState({loaded:true});
            console.log(this.state.sheetNames);
        };
        if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
    };
    saveSheet(sheetName){
        if(this.sheets[sheetName].state.hasBeenEdited){
            var name = this.sheets[sheetName].props.sheetName;
            var headers = [];
            if(this.sheets[sheetName] && this.sheets[sheetName].state.headers){
                this.sheets[sheetName].state.headers.forEach(function(header){
                    if(header.checked){
                        headers.push(header);
                    }
                });
            }
            this.editedSheets[name]=headers;
            //ui
            var elem = document.getElementById('react-tabs-'+sheetName*2);
            if(elem)
                elem.style.backgroundColor = '#00800040';
        }
        console.log(this.editedSheets);
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
                                            <RDFSheet ref={(rdfSheet) => {this.sheets[i] = rdfSheet}} sheetName={name.label} sheet={this.props.parent.state.workbook.Sheets[name.label]}/>
                                        </TabPanel>
                                    )}
                                </Tabs>
                                <div>
                                    <button onClick={()=>{
                                        this.saveSheet(this.state.currentSheet);
                                    }}>show</button>
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