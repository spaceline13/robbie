import {Component} from "react";
import React from "react";
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import {DATAPACKAGES} from '../MyDatapackage';
import xmlParser from 'fast-xml-parser';

const UPLOAD=gql`
    mutation($datapackage: DatapackageInput!) {
        uploadDatapackage(datapackage:$datapackage)
    }
`;
const SAVE_DOI=gql`
    mutation($name: String!, $doi: String!){
        setDoi(name:$name, doi:$doi)
    }
`;

class DatapackageMutation extends Component {
    constructor(props) {
        super(props);
        this.createDatasetDataverse = this.createDatasetDataverse.bind(this);
    }
    createDatasetDataverse(xml){
        var res = new Promise(async (resolve, reject) => {
            const rawResponse = await fetch('https://demo.dataverse.org/dvn/api/data-deposit/v1.1/swordv2/collection/dataverse/demo', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic NDIwZGFhNWMtMzYyYi00ZjJkLWIyZDUtNTU4YWMyZmEwNzEzOg',
                    'Content-Type': 'application/atom+xml'
                },
                body: xml
            });
            const xmlData = await rawResponse.text();

            var jsonObj = null;
            if(xmlParser.validate(xmlData)=== true){//optional
                jsonObj = xmlParser.parse(xmlData);
            }

            var doi = jsonObj.entry.id.substring(jsonObj.entry.id.indexOf("/doi:")+5);
            var my = this.props.getFiles();
            for(var i=0;i<my.files.length;i++){
                if(my.files[i]){
                    await fetch('https://demo.dataverse.org/dvn/api/data-deposit/v1.1/swordv2/edit-media/study/doi:'+doi, {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Basic NDIwZGFhNWMtMzYyYi00ZjJkLWIyZDUtNTU4YWMyZmEwNzEzOg',
                            'Packaging': 'http://purl.org/net/sword/package/SimpleZip',
                            'Content-Disposition': 'filename='+my.files[i].name
                        },
                        body: my.files[i]
                    });
                }
            }
            resolve(doi);
        });
        return res;
    }
    render() {
        return(
            <Mutation mutation={UPLOAD}>
                {(uploadDatapackage,{client}) => (
                    <button onClick={async (e) => {
                        e.preventDefault();
                        //console.log(DATAPACKAGES);
                        var datapackage = this.props.vars;
                        var res = await uploadDatapackage({
                            variables:  {datapackage:datapackage}
                        });
                        //console.log(res);
                        if(res.data && res.data.uploadDatapackage){
                            var doi = await this.createDatasetDataverse(res.data.uploadDatapackage);
                            this.props.resetForm();
                            client.mutate({
                                mutation: SAVE_DOI,
                                variables:  {name:datapackage.name, doi:doi},
                                refetchQueries: [{
                                    query: DATAPACKAGES
                                }]
                            });
                            if(this.props.onSubmit){
                                this.props.onSubmit();
                            }
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