import React, {Component} from 'react';

class GenerateRDF extends Component {
    constructor(props) {
        super(props);
        this.state ={
            funct:'',
            loading:false
        };

        this.loader = this.loader.bind(this);
    };
    loader(value){
        this.setState({loading:value});
    }

    render() {
        return (
            <div>
                <div style={this.state.loading?{display:'block'}:{display:'none'}}>
                    Loading...
                </div>
            </div>
        );
    };
};

export default GenerateRDF;