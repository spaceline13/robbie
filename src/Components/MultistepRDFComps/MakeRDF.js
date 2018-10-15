import React, {Component} from 'react';
import XLSX from 'xlsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-simpler-select';
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

        this.openFile = this.openFile.bind(this);
        this.openFile(this.props.parent.state.excelFile);
        this.selectSheet = this.selectSheet.bind(this);
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
            console.log(this.state.sheetNames);
        };
        if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
    };
    selectSheet(sheetName){
        //init
    }
    render() {
        return (
            <div>
                {this.state.loaded?
                    <div>
                        {this.state.sheetNames.length > 0 ?
                            <Tabs>
                                <TabList>
                                    {this.state.sheetNames.map((name, i) =>
                                        <Tab key={i}>{name.label}</Tab>
                                    )}
                                </TabList>
                                {this.state.sheetNames.map((name, i) =>
                                    <TabPanel key={i}>
                                        <RDFSheet sheetName={name.label} sheet={this.props.parent.state.workbook.Sheets[name.label]}/>
                                    </TabPanel>
                                )}
                            </Tabs>
                        : <div></div>
                        }
                    </div>
                    :<div>Loading file...</div>}
            </div>
        );
    };
};

export default MakeRDF;