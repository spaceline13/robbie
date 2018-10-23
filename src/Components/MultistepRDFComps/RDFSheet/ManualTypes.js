import {Component} from "react";
import React from "react";
import AutocompleteLocal from "../../Autocomplete/AutocompleteLocal";
import AutocompleteRemote from "../../Autocomplete/AutocompleteRemote";

const notValidatedColor = 'red';
const validatedColor = 'green';
function validColor(valid){
    if (valid)
        return validatedColor;
    else
        return notValidatedColor;
}
const dateFormats = [
    {label:'yy/mm/dd', value:'yy/mm/dd'},
    {label:'yyyy/mm/dd', value:'yyyy/mm/dd'},
    {label:'mm/dd/yy', value:'mm/dd/yy'},
    {label:'mm/dd/yyyy', value:'mm/dd/yyyy'},
    {label:'mmm-dd-yy', value:'mmm-dd-yy'},
    {label:'mmm-dd-yyy', value:'mmm-dd-yyy'},
    {label:'yyyy-mm-dd', value:'yyyy-mm-dd'}
];
class ManualTypes extends Component {

    constructor(props, context) {
        super(props, context);
        // Set initial State
        this.state = {
            type:(props.savedData && props.savedData.type)?props.savedData.type:"",
            validType:(props.savedData && props.savedData.validType)?true:false,
            typeStyle:(props.savedData && props.savedData.validType)?{width:'120px',borderColor:validColor(props.savedData.validType)}:{width:'120px',borderColor:notValidatedColor},
            format:(props.savedData && props.savedData.format)?props.savedData.format:"",
            validFormat:(props.savedData && props.savedData.validFormat)?true:false,
            measure:(props.savedData && props.savedData.measure)?props.savedData.measure:"",
            validMeasure:(props.savedData && props.savedData.validMeasure)?true:false,
            vocabulary:(props.savedData && props.savedData.vocabulary)?props.savedData.vocabulary:"",
            validVoc:(props.savedData && props.savedData.validVoc)?true:false,
            vocStyle:(props.savedData && props.savedData.validVoc)?{borderColor:validColor(props.savedData.validVoc)}:{borderColor:notValidatedColor}
        };
        this.element = React.createRef();
        this.setParent = this.setParent.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onMeasureChange = this.onMeasureChange.bind(this);
        this.onFormatChange = this.onFormatChange.bind(this);
        this.onVocabularyChange = this.onVocabularyChange.bind(this);
        this.checkValid = this.checkValid.bind(this);
    }
    checkValid(){
        //console.log(this.state.validType,this.state.validFormat,this.state.validMeasure,this.state.validVoc);

        if(this.state.validType&&this.state.validFormat&&this.state.validMeasure&&this.state.validVoc)
            return true;
        else
            return false;
    }
    setParent(field,value){
        var h = this.props.parent.state.headers;
        if(field=="type"){
            h[this.props.header].type=value;
            h[this.props.header].validType=value&&(value!="")?true:false;
            if((value=='decimal')||(value=='integer')) {
                h[this.props.header].validFormat=true;
                h[this.props.header].validMeasure=false;
                h[this.props.header].validVoc=true;
            } else if(value=='date') {
                h[this.props.header].validFormat=false;
                h[this.props.header].validMeasure=true;
                h[this.props.header].validVoc=true;
            } else if(value=='text') {
                h[this.props.header].validFormat=true;
                h[this.props.header].validMeasure=true;
                h[this.props.header].validVoc=false;
            }
            h[this.props.header].format='';
            h[this.props.header].measure='';
            h[this.props.header].vocabulary='';
        } else if(field=="format") {
            h[this.props.header].format=value;
            h[this.props.header].validFormat=value&&(value!="")?true:false;
        } else if(field=="measure"){
            h[this.props.header].measure=value;
            h[this.props.header].validMeasure=value&&(value!="")?true:false;
        } else if(field=="vocabulary"){
            h[this.props.header].vocabulary=value;
            h[this.props.header].validVoc=value&&(value!="")?true:false;
        }
        this.props.parent.setState({headers:h,hasBeenEdited:true});
    }
    onTypeChange(e){
        var value = e.target.value;
        this.setState({type:value});
        this.setParent('type',value);
        if(!value)
            this.setState({typeStyle:{width:'120px',borderColor: notValidatedColor},validType:false});
        else {
            if((value=='decimal')||(value=='integer')) {
                this.setState({validMeasure: false});
            } else if(value=='date') {
                this.setState({validFormat: false});
            } else if(value=='text') {
                this.setState({validVoc: false, vocStyle: {borderColor: notValidatedColor}});
            }
            this.setState({typeStyle: {width:'120px',borderColor: validatedColor},validType:true});
            this.resetRest(value);
        }
    }
    onMeasureChange(v,reset){
        var value = reset?'':v;
        var valid = reset?true:((value&&(value!=''))?true:false);
        this.setState({measure:value,validMeasure:valid});
        if(!reset)
            this.setParent('measure',value);
    }
    onFormatChange(v,reset){
        var value = reset?'':v;
        var valid = reset?true:((value&&(value!=''))?true:false);
        this.setState({format:value,validFormat:valid});
        if(!reset)
            this.setParent('format',value);
    }
    onVocabularyChange(e,reset){
        var value = reset?'':e.target.value;
        var valid = reset?true:((value&&(value!=''))?true:false);
        this.setState({vocabulary:value});
        this.setState({vocStyle:{borderColor: valid?validatedColor:notValidatedColor},validVoc:valid});
        if(!reset)
            this.setParent('vocabulary',value);
    }
    resetRest(field){
        if((field!='decimal')&&(field!='integer')){
            this.onMeasureChange(null,true);
        }
        if(field!='date'){
            this.onFormatChange(null,true);
        }
        if(field!='text'){
            this.onVocabularyChange(null,true);
        }
    }
    render() {
        return (
            <span style={this.props.style} ref={(element)=>this.element=element}>
                <select value={this.state.type} defaultValue={this.state.type} onChange={this.onTypeChange} style={this.state.typeStyle}>
                    <option value="" disabled>Select type</option>
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
                            defaultValue={this.state.measure.label}
                            isValid={this.state.validMeasure}
                            getItemValue={(item)=>{
                                return item.label + " (" + item.ontology_prefix + ")";
                            }}
                        />
                    </span>
                }
                {(this.state.type=='date') &&
                    <span> with format
                        <AutocompleteLocal
                            items={dateFormats}
                            defaultValue={this.state.format}
                            onSelect={this.onFormatChange}
                            isValid={this.state.validFormat}
                    />
                    </span>
                }
                {(this.state.type=='text') &&
                    <span> with values in
                        <textarea
                            defaultValue={this.state.vocabulary}
                            onChange={this.onVocabularyChange}
                            placeholder="type in the vocabulary"
                            style={this.state.vocStyle}
                        />
                    </span>
                }
            </span>
        );
    }
}
export default ManualTypes;