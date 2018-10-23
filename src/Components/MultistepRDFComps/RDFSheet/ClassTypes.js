import {Component} from "react";
import React from "react";
import AutocompleteRemote from "../../Autocomplete/AutocompleteRemote";

class ClassTypes extends Component {
    constructor(props, context) {
        super(props, context);
        // Set initial State
        this.state = {
        };
        this.autocompleteObj = React.createRef();
        this.checkValid = this.checkValid.bind(this);
    }
    checkValid(){
        return this.autocompleteObj.state.isValidated;
    }
    render() {
        return (
            <AutocompleteRemote
                ref={(element)=>this.autocompleteObj=element}
                url={'https://www.ebi.ac.uk/ols/api/search?q='}
                responseObj={'response'}
                resultsObj={'docs'}
                style={{display:'inline-block'}}
                defaultValue={(this.props.classOf && this.props.classOf.label)?this.props.classOf.label:""}
                onSelect={this.props.onSelect}
                isValid={this.props.classOf?true:false}
                onKeypress={(e)=>{
                    var elem = e.target;
                    //this.setState({iframeUrl:'https://www.ebi.ac.uk/ols/search?q='+elem.value});
                    //take the focus back from iframe
                    for (var i = 0; i < 15; i++) {
                        setTimeout(function () {
                            if(elem)
                                elem.focus();
                        }, i * 100)
                    }
                }}
                onFocus={this.props.onFocus}
                getItemValue={(item)=>{
                    return item.label + " (" + item.ontology_prefix + ")";
                }}
            />
        );
    }
}
export default ClassTypes;