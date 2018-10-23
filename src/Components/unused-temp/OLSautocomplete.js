import React, {Component} from 'react';
import OLS from 'ols-autocomplete';

class OLSautocomplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ols:this.props.ols
        };
    };
    componentDidMount() {
        if(this.state.ols==null){
            var newOls = new OLS;
            setTimeout(function(){
                newOls.start({action:function(relativePath, suggestion_ontology, type, iri, data){console.log(data)}});
            },100);
            this.setState({ols:newOls});
            this.props.setOLS(newOls);
        }
    }
    render() {
        return (
            <div>
                <input style={{fontWeight: "normal", width: this.props.width}}
                       size="35"
                       type="text"
                       name="q"
                       data-olswidget="select"
                       data-olsontology=""
                       data-selectpath="https://www.ebi.ac.uk/ols/"
                       olstype=""
                       id={"olsSelect"+this.props.i}
                       placeholder="Enter the term you are looking for"
                       className="ac_input"
                       onChange={this.props.onChange}
                       onFocus={this.props.onFocus}>
                </input>
            </div>
        );
    };
};

export default OLSautocomplete;