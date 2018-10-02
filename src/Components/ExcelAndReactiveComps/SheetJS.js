import React, {Component} from 'react';
import XLSX from 'xlsx';
import {formatDataForXLSX,formatDataForReactAggrid} from '../../lib/dataFormatter';
import DragDropFile from './DragDropFile';
import DataInput from './DataInput';
import request from "superagent";
import { AgGridReact } from 'ag-grid-react';

class SheetJS extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sheetNames: [],
			currentSheet: null,
			workbook: null,
            columnDefs: [],
            rowData: []
		};
		this.openFile = this.openFile.bind(this);
		this.downloadFile = this.downloadFile.bind(this);
        this.selectSheet = this.selectSheet.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.saveCurrentSheet = this.saveCurrentSheet.bind(this);
	};

	openFile(file) {
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		reader.onload = (e) => {
			const excelfile = e.target.result;
			const wb = XLSX.read(excelfile, {type:rABS ? 'binary' : 'array'});

			this.setState({workbook:wb});
			this.setState({currentSheet: wb.SheetNames[0]});
			this.setState({sheetNames: wb.SheetNames});

			const sheet = wb.Sheets[this.state.currentSheet];
			const data = XLSX.utils.sheet_to_json(sheet, {header:1});

			this.setState(formatDataForReactAggrid(data));
		};
		if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
	};
    selectSheet(e){
        this.saveCurrentSheet();
        const sheet = this.state.workbook.Sheets[e.target.value];
        const data = XLSX.utils.sheet_to_json(sheet, {header:1});
        this.setState(formatDataForReactAggrid(data));
        this.setState({currentSheet:e.target.value});
    }
    saveCurrentSheet(){
        this.state.workbook.Sheets[this.state.currentSheet] =  XLSX.utils.aoa_to_sheet(formatDataForXLSX({columnDefs:this.state.columnDefs, rowData:this.state.rowData}));
    }
	downloadFile() {
        this.saveCurrentSheet();
		const wb = this.state.workbook;
		XLSX.writeFile(wb, "sheetjs.xlsx");
	};
	uploadFile(){
        this.saveCurrentSheet();
        var options = { bookType:'xlsx', bookSST:false, type:'array' };
        var wbout = XLSX.write(this.state.workbook,options);
        const req = request.post('http://localhost:2000/upload');
        req.attach('test.xlsx',new Blob([wbout]));
        req.end();
	}

	render() {
		return (
        <div>
			<DragDropFile handleFile={this.openFile}>
				<span style={{}}>&nbsp;or click on the button to browse local files:</span>
				<DataInput handleFile={this.openFile}/>
			</DragDropFile>
			<div>
				{this.state.sheetNames.map((name, i) => <button style={{fontSize:'14px'}} value={name} key={i} onClick={this.selectSheet}> {name} </button>)}
			</div>

			{this.state.workbook?
				<div>
					<div>
						<div
							className="ag-theme-balham"
							style={{
								height: '60vh',
								width: '100%'}}
						>
							<AgGridReact
								columnDefs={this.state.columnDefs}
								rowData={this.state.rowData}>
							</AgGridReact>
						</div>
					</div>
					<div>
						<div>
							<button disabled={!this.state.rowData.length} onClick={this.downloadFile}>Download</button>
							<button disabled={!this.state.rowData.length} onClick={this.uploadFile}>Upload</button>
						</div>
					</div>
				</div>
			:<div></div>}
		</div>
		);
	};
};

export default SheetJS;