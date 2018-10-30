import {Component} from "react";
import React from "react";
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const UPLOAD=gql`
  mutation($file: Upload!) {
       uploadResource(file:$file){
            name
            path
       }
  }
`;

class UploadDataset extends Component {
    render() {
        return(
            <Mutation mutation={UPLOAD}>
                {(uploadResource,{loading, error}) => (
                    <span>
                        <input type="file" multiple required onChange={async (e) => {
                            e.preventDefault();
                            if (typeof FileReader !== "undefined") {
                                var my = {files:e.target.files};
                                if(my.files.length>0){
                                    var valid = true;
                                    for(var i=0;i<my.files.length;i++){
                                        if(my.files[i].size>25000000){
                                            valid = false;
                                        }
                                    }
                                    if(!valid){
                                        alert('file must be smaller than 25MB');
                                        this.props.form.current.reset();
                                    } else {
                                        var res = await uploadResource({
                                            variables: { file: my.files}
                                        });
                                        if(res.data) {
                                            this.props.changeFile(res.data.uploadResource);
                                            this.props.setFiles(my.files);
                                        }
                                    }
                                }
                            }
                        }} />
                        {loading && <p>Loading...</p>}
                        {error && <p>Error :( Please try again</p>}
                    </span>
                )}
            </Mutation>
        );
    }
}
export default UploadDataset;