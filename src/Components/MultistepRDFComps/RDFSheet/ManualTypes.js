import {Component} from "react";
import React from "react";
import AutocompleteLocal from "../../Utils/AutocompleteLocal";
import AutocompleteRemote from "../../Utils/AutocompleteRemote";

class ManualTypes extends Component {

    constructor(props, context) {
        super(props, context);
        // Set initial State
        this.state = {
            type:"",
            format:"",
            measure:"",
            vocabulary:""
        };
        this.element = React.createRef();
        this.setParent = this.setParent.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onMeasureChange = this.onMeasureChange.bind(this);
        this.onFormatChange = this.onFormatChange.bind(this);
        this.onVocabularyChange = this.onVocabularyChange.bind(this);
    }
    setParent(field,value){
        var h = this.props.parent.state.headers;
        h[this.props.header].type=(field=="type"?value:this.state.type);
        h[this.props.header].format=(field=="format"?value:this.state.format);
        h[this.props.header].measure=(field=="measure"?value:this.state.measure);
        h[this.props.header].vocabulary=(field=="vocabulary"?value:this.state.vocabulary);
        this.props.parent.setState({headers:h});
    }
    onTypeChange(e){
        var value = e.target.value;
        this.setState({type:value});
        this.setParent('type',value);
    }
    onMeasureChange(value){
        this.setState({measure:value});
        this.setParent('measure',value);
    }
    onFormatChange(value){
        this.setState({format:value});
        this.setParent('format',value);
    }
    onVocabularyChange(e){
        var value = e.target.value;
        this.setState({vocabulary:value});
        this.setParent('vocabulary',value);
    }

    render() {
        return (
            <span style={this.props.style} ref={(element)=>this.element=element}>
                <select value={this.state.type} onChange={this.onTypeChange}>
                    <option value="" disabled selected>Select type</option>
                    <option value="decimal">decimal</option>
                    <option value="integer">integer</option>
                    <option value="date">date</option>
                    <option value="boolean">boolean</option>
                    <option value="text">text</option>
                    <option value="url">url</option>
                </select>
                {((this.state.type=='decimal')||(this.state.type=='integer')) &&
                    <span> measured in
                        <AutocompleteRemote
                            url={'https://www.ebi.ac.uk/ols/api/search?q='}
                            addParameter={'ontology=uo'}
                            responseObj={'response'}
                            resultsObj={'docs'}
                            style={{display:'inline-block'}}
                            onSelect={this.onMeasureChange}
                            getItemValue={(item)=>{
                                return item.label + " (" + item.ontology_prefix + ")";
                            }}
                        />
                    </span>
                }
                {(this.state.type=='date') &&
                    <span> with format
                        <AutocompleteLocal
                            items={[
                                {label:'yy/mm/dd'},
                                {label:'yyyy/mm/dd'},
                                {label:'mm/dd/yy'},
                                {label:'mm/dd/yyyy'},
                                {label:'mmm-dd-yy'},
                                {label:'mmm-dd-yyy'},
                                {label:'yyyy-mm-dd'}
                            ]}
                            onSelect={this.onFormatChange}
                    />
                    </span>
                }
                {(this.state.type=='text') &&
                    <span> with values in <textarea onChange={this.onVocabularyChange} placeholder="type in the vocabulary"/></span>
                }
            </span>
        );
    }
}
export default ManualTypes;