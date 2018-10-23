import React, {Component} from 'react';
import DragDropFile from '../ExcelAndReactiveComps/DragDropFile';
import DataInput from '../ExcelAndReactiveComps/DataInput';

class LoadJSON extends Component {
    constructor(props) {
        super(props);
        this.state ={
            funct:'',
            loading:false
        };
        this.openFile = this.openFile.bind(this);
        this.onLoadJSONChange = this.onLoadJSONChange.bind(this);
        this.loadSavedData = this.loadSavedData.bind(this);
        this.loader = this.loader.bind(this);
    };
    loader(value){
        this.setState({loading:value});
    }
    openFile(file) {
        var loader = this.loader;
        loader(true);

        var reader = new FileReader();
        var handler = this.loadSavedData;
        var jump = this.props.jumpToStep;
        reader.onload = function(e) {
            var arr = [];
            var contents = e.target.result;
            try {
                var json = JSON.parse(contents);
            } catch (e) {
                alert('the file you specified is not a valid model in json format');
                loader(false);
                return false;
            }

            for(var sheet in json.sheets){
                arr[sheet] = [];
                for(var header in json.sheets[sheet].headers){
                    arr[sheet][header] = json.sheets[sheet].headers[header];
                }
            }
            handler(arr);
            loader(false);
            jump(2);
        };
        reader.readAsText(file);
    };

    loadSavedData(data){
        this.props.parent.setState({rdfModel:data});
    }
    onLoadJSONChange(e){
        var val = e.currentTarget.value;
        this.setState({
            funct: val
        });
        if(val==='new'){
            this.props.jumpToStep(2);
        }
    }
    render() {
        return (
            <div>
                <div style={this.state.loading?{display:'none'}:{display:'block'}}>
                    <div>
                        <input type="radio" name="funct"
                               value={'new'}
                               checked={this.state.funct === 'new'}
                               onChange={this.onLoadJSONChange}
                        />
                        I want to create a new model
                    </div>

                    <div>
                        <input type="radio" name="funct"
                               value={'json'}
                               checked={this.state.funct === 'json'}
                               onChange={this.onLoadJSONChange}
                        />
                        I already have a model (json file) and want to use it
                    </div>
                    {this.state.funct === 'json' ?
                        <div>
                            <DragDropFile handleFile={this.openFile}>
                                <span style={{}}>&nbsp;or click on the button to browse local files:</span>
                                <DataInput handleFile={this.openFile}/>
                            </DragDropFile>
                        </div>
                    :
                        <div></div>
                    }
                </div>
                <div style={this.state.loading?{display:'block'}:{display:'none'}}>
                    Loading...
                </div>
            </div>
        );
    };
};

export default LoadJSON;