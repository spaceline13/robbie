import {Component} from "react";
import React from "react";
import Autocomplete from 'react-autocomplete';


class AutocompleteRemote extends Component {

    constructor(props, context) {
        super(props, context);
        // Set initial State
        this.state = {
            value: "",
            autocompleteData: []
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
        this.setState({
            value: e.target.value
        });
        this.retrieveDataAsynchronously(e.target.value);
        if(this.props.onKeypress)
            this.props.onKeypress(e);
    }
    onSelect(val,item){
        console.log(val,item,'d');
        this.setState({
            value: val
        });
        this.props.onSelect(item);
    }
    renderItem(item, isHighlighted){
        return (
            <div key={item.id} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                <b>{item.label}</b> {item.ontology_prefix?<i style={{color:'grey'}}>({item.ontology_prefix})</i>:<span></span>}
            </div>
        );
    }

    render() {
        return (
            <div style={this.props.style} ref={(element)=>this.element=element}>
                <Autocomplete
                    ref={el => this.input = el}
                    getItemValue={this.props.getItemValue}
                    items={this.state.autocompleteData}
                    renderItem={this.renderItem}
                    value={this.state.value}
                    onChange={this.onChange}
                    onSelect={this.onSelect}
                    inputProps={{onFocus:this.props.onFocus}}
                />
            </div>
        );
    }
}
export default AutocompleteRemote;