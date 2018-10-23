import {Component} from "react";
import React from "react";
import Autocomplete from 'react-autocomplete';

const notValidatedColor = 'red';
const validatedColor = 'green';
class AutocompleteLocal extends Component {

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
        this.getItemValue = this.getItemValue.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }
    onChange(e){
        var value = e.target.value;
        this.setState({
            value: value
        });
       // if(value==''){
            this.setState({
                isValidated:false,
                inputProps:Object.assign(this.state.inputProps, {style:{border:'1px solid '+notValidatedColor}})
            });
       // }
    }
    onSelect(val){
        this.setState({
            value: val,
            isValidated:true,
            inputProps:Object.assign(this.state.inputProps, {style:{border:'1px solid '+validatedColor}})
        });
        this.props.onSelect(val);
    }
    renderItem(item, isHighlighted){
        return (
            <div key={item.id} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                {item.label}
            </div>
        );
    }
    getItemValue(item){
        return item.label;
    }
    sortItems(a, b, value) {
        const aLower = a.label.toLowerCase();
        const bLower = b.label.toLowerCase();
        const valueLower = value.toLowerCase();
        const queryPosA = aLower.indexOf(valueLower);
        const queryPosB = bLower.indexOf(valueLower);
        if (queryPosA !== queryPosB) {
            return queryPosA - queryPosB
        }
        return aLower < bLower ? -1 : 1
    }
    displayOnlyFiltered(item, value){
        return item.label.toLowerCase().indexOf(value.toLowerCase()) > -1;
    }
    render() {
        return (
            <span style={this.props.style} ref={(element)=>this.element=element}>
                <Autocomplete
                    value={this.state.value}
                    inputProps={this.state.inputProps}
                    wrapperStyle={{ position: 'relative', display: 'inline-block' }}
                    items={this.props.items}
                    getItemValue={this.getItemValue}
                    onChange={this.onChange}
                    onSelect={this.onSelect}
                    renderItem={this.renderItem}
                    sortItems={this.sortItems}
                    shouldItemRender={this.displayOnlyFiltered}
                />
            </span>
        );
    }
}
export default AutocompleteLocal;