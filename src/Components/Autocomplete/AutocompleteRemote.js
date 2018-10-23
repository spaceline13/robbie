import {Component} from "react";
import React from "react";
import Autocomplete from 'react-autocomplete';
import Tooltip from 'rc-tooltip';

const notValidatedColor = 'red';
const validatedColor = 'green';
class AutocompleteRemote extends Component {

    constructor(props, context) {
        super(props, context);
        // Set initial State
        this.state = {
            value: props.defaultValue?props.defaultValue:"",
            autocompleteData: [],
            isValidated:props.isValid,
            inputProps: {onFocus:this.props.onFocus,style:{border:'1px solid '+(props.isValid?validatedColor:notValidatedColor)}},
        };
        this.element = React.createRef();
        this.input = React.createRef();
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.retrieveDataAsynchronously = this.retrieveDataAsynchronously.bind(this);
    }
    retrieveDataAsynchronously(searchText){
        let _this = this;
        fetch(this.props.url+searchText+"&"+(this.props.addParameter?this.props.addParameter:'')).then(response => response.json()).then(data => {
            var res = data[this.props.responseObj];
            _this.setState({
                autocompleteData: res[this.props.resultsObj]
            });
        });
    }
    onChange(e){
        var value = e.target.value;
        this.setState({
            value: value
        });
        this.retrieveDataAsynchronously(value);
        if(this.props.onKeypress)
            this.props.onKeypress(e);
        //if(value==''){
            this.setState({
                isValidated:false,
                inputProps:Object.assign(this.state.inputProps, {style:{border:'1px solid '+notValidatedColor}})
            });
        //}
    }
    onSelect(val,item){
        this.setState({
            value: val,
            isValidated:true,
            inputProps:Object.assign(this.state.inputProps, {style:{border:'1px solid '+validatedColor}})
        });
        this.props.onSelect(item);

    }
    renderItem(item, isHighlighted){
        return (
            <Tooltip key={item.id} placement="left" trigger={['hover']} overlay={<div style={{width:'300px'}}><div>{item.iri?item.iri:''}</div><div>{item.description?item.description:''}</div></div>}>
                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                    <b>{item.label}</b> {item.ontology_prefix?<i style={{color:'grey'}}>({item.ontology_prefix})</i>:<span></span>}
                </div>
            </Tooltip>
        );
    }
    renderInput(props) {
        return <input {...props} />
    }

    render() {
        return (
            <div style={this.props.style} ref={(element)=>this.element=element}>
                <Autocomplete
                    ref={el => this.input = el}
                    getItemValue={this.props.getItemValue}
                    items={this.state.autocompleteData}
                    renderItem={this.renderItem}
                    renderInput={this.renderInput}
                    value={this.state.value}
                    onChange={this.onChange}
                    onSelect={this.onSelect}
                    inputProps={this.state.inputProps}
                />
            </div>
        );
    }
}
export default AutocompleteRemote;