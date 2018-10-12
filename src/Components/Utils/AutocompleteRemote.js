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
        this.getItemValue = this.getItemValue.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.retrieveDataAsynchronously = this.retrieveDataAsynchronously.bind(this);
    }
    componentDidMount() {
        this.input.focus();
    }
    retrieveDataAsynchronously(searchText){
        let _this = this;
        fetch("https://www.ebi.ac.uk/ols/api/select?q="+searchText).then(response => response.json()).then(data => {
            var res = data.response.docs;
            _this.setState({
                autocompleteData: res
            });
        });
    }
    onChange(e){
        this.setState({
            value: e.target.value
        });
        this.retrieveDataAsynchronously(e.target.value);
        this.props.onKeypress(e);
    }
    onSelect(val){
        this.setState({
            value: val
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
    render() {
        return (
            <div style={this.props.style} ref={(element)=>this.element=element}>
                <Autocomplete
                    ref={el => this.input = el}
                    getItemValue={this.getItemValue}
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