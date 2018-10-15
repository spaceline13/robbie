import React, {Component} from 'react';
import DragDropFile from '../ExcelAndReactiveComps/DragDropFile';
import DataInput from '../ExcelAndReactiveComps/DataInput';

class UploadXL extends Component {
    constructor(props) {
        super(props);
        this.openFile = this.openFile.bind(this);
    };

    openFile(file) {
        this.props.parent.setState({excelFile:file});
        this.props.jumpToStep(1);
    };

    render() {
        return (
            <div>
                <DragDropFile handleFile={this.openFile}>
                    <span style={{}}>&nbsp;or click on the button to browse local files:</span>
                    <DataInput handleFile={this.openFile}/>
                </DragDropFile>
            </div>
        );
    };
};

export default UploadXL;