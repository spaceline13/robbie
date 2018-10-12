import {Component} from "react";
import React from "react";
import DatapackageUpload from "../DatapackageUpload";
class MetadataForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            title: '',
            profile: '',
            description: '',
            version: '',
            author: '',
            date:moment(),
            license: [],
            keywords: [],
            resources: []
        };
        this.onSubmit = function(){
            console.log('am here');
            this.props.parent.setState({metadata:this.state});
            this.props.jumpToStep(2);
        }
    };
    render() {
        return (
            <div>
                <DatapackageUpload noResource={true} onSubmit={this.onSubmit} parent={this}/>
            </div>
        );
    }
}

export default MetadataForm;