import {Component} from "react";
import React from "react";
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const UPLOAD=gql`
  mutation($file: Upload!) {
       uploadDataset(file:$file){
            name
            path
       }
  }
`;
class UploadDataset extends Component {
    render() {
        return(
            <Mutation mutation={UPLOAD}>
                {(uploadDataset,{data}) => (
                    <input type="file" required onChange={async (e) => {
                        e.preventDefault();
                        if (typeof FileReader !== "undefined") {
                            if(e.target.files.length>0){
                                var size = e.target.files[0].size;
                                if(size>25000000){
                                    alert('file must be smaller than 25MB');
                                    this.props.form.current.reset();
                                } else {
                                    console.log('here');
                                    var res = await uploadDataset({
                                        variables: { file: e.target.files[0]}
                                    });
                                    this.props.changeFile(res);
                                }
                            }
                        }
                    }} />
                )}
            </Mutation>
        );
    }
}
export default UploadDataset;