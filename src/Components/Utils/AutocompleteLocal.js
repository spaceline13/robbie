import {Component} from "react";
import React from "react";
import Autocomplete from 'react-autocomplete';


class AutocompleteLocal extends Component {

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
    sortItems(a, b, value) {
        const aLower = a.label.toLowerCase()
        const bLower = b.label.toLowerCase()
        const valueLower = value.toLowerCase()
        const queryPosA = aLower.indexOf(valueLower)
        const queryPosB = bLower.indexOf(valueLower)
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
                    inputProps={{}}
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