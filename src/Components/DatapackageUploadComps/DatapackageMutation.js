import {Component} from "react";
import React from "react";
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import {DATAPACKAGES} from '../MyDatapackage';

const MUTATE=gql`
  mutation($datapackage: DatapackageInput!) {
       uploadDatapackage(datapackage:$datapackage)
  }
`;
class DatapackageMutation extends Component {
    render() {
        return(
            <Mutation mutation={MUTATE}>
                {(uploadDatapackage,{data}) => (
                    <button onClick={async (e) => {
                        e.preventDefault();
                        console.log(DATAPACKAGES);
                        var res = await uploadDatapackage({
                            refetchQueries: [{
                                query: DATAPACKAGES
                            }],
                            variables:  {datapackage:this.props.vars}
                        });
                        console.log(res);
                        if(res.data && res.data.uploadDatapackage){
                            this.props.resetForm();
                        } else {
                            alert ('There was a problem with the upload proccess. Please make sure that you filled all the required fields');
                        }
                    }} >Upload</button>
                )}
            </Mutation>
        );
    }
}
export default DatapackageMutation;