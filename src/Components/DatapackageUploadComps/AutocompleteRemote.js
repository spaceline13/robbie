import {Component} from "react";
import React from "react";
import AsyncSelect from "react-select/lib/Async";


class AutocompleteRemote extends Component {
    fetchKeywords = (inputValue, callback) => {
        fetch("http://192.168.1.102:9200/agrovoc/_search?q="+inputValue).then(response => response.json()).then(data => {
            var res = data.hits;
            var objArr = [];
            res.hits.forEach(function(hit){
                objArr.push({label:hit._source.label, value:hit._source.URI});
            });
            callback(objArr);
        });
    };
    render() {
        return(
            <AsyncSelect loadOptions={this.fetchKeywords} value={this.props.value} onChange={(keyword)=>{this.props.setValue(keyword)}} isMulti />
        );
    }
}
export default AutocompleteRemote;