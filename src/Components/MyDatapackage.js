import {Component} from "react";
import React from "react";
import UserAreaHeader from "./UserAreaHeader";

import gql from "graphql-tag";
import { Query } from "react-apollo";
import xmlParser from "fast-xml-parser";

export const DATAPACKAGES = gql`
  query getMyDatapackages {
    getMyDatapackages {
        name
        title
        creator
        description
        publisher
        contributor
        resources{
            name
            path
        }
        doi
    }
  }
`;
const DELETEPACKAGE = gql`
    mutation($name: String!) {
        deleteDatapackage(name:$name)
    }
`;

class MyDatapackage extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
        this.checkState = this.checkState.bind(this);
    }
    async checkState(e,doi){
        const rawResponse = await fetch('https://demo.dataverse.org/dvn/api/data-deposit/v1.1/swordv2/statement/study/doi:'+doi, {
            method: 'GET',
            headers: {
                'Authorization': 'Basic NDIwZGFhNWMtMzYyYi00ZjJkLWIyZDUtNTU4YWMyZmEwNzEzOg',
            },
        });
        const xmlData = await rawResponse.text();

        var jsonObj = null;
        if (xmlParser.validate(xmlData) === true) {//optional
            jsonObj = xmlParser.parse(xmlData);
        }
        if(jsonObj&&jsonObj.feed)
            alert('The dataset is: '+jsonObj.feed.category[0]);
        else
            alert('There was a problem trying to retrieve information about this dataset');
    }
    async deleteDataset(e,doi,client){
        const rawResponse = await fetch('https://demo.dataverse.org/dvn/api/data-deposit/v1.1/swordv2/edit/study/doi:'+doi, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Basic NDIwZGFhNWMtMzYyYi00ZjJkLWIyZDUtNTU4YWMyZmEwNzEzOg',
            },
        });
        const xmlData = await rawResponse.text();

        var jsonObj = null;
        if (xmlParser.validate(xmlData) === true) {//optional
            jsonObj = xmlParser.parse(xmlData);
        }
        console.log(jsonObj,'del');

    }
    render() {
        const authToken = localStorage.getItem('auth-token');
        return (
            <div>
                <UserAreaHeader features={['auth','upload','myData']}/>
                <br />
                {authToken ? (
                    <Query query={DATAPACKAGES}>
                        {({ loading, error, data, client }) => {
                            if (loading) return "Loading...";
                            if (error) {
                                console.log(`Error! ${error.message}`);
                                return 'We could not find any datasets in your folder';
                            }

                            return (
                                <section>
                                    <ul style={{margin:'0px',padding:'0px'}}>
                                        {data.getMyDatapackages.map((datapackage, index) => (
                                            <li style={{border: '1px solid grey',display: 'block',marginBottom: '10px', paddingBottom:'3px' }} key={datapackage.name}>
                                                <button style={{float:'right'}} onClick={(e)=>{this.deleteDataset(e,datapackage.doi,client)}}>delete</button>
                                                <h3 style={{margin:'0px',backgroundColor:'#ff920066',padding:'5px'}}>{datapackage.name}</h3>
                                                <hr style={{marginTop:'0px'}}/>
                                                <span style={{fontSize:'14px'}} dangerouslySetInnerHTML={{ __html: datapackage.description}}></span>
                                                resources: {datapackage.resources.map(resource => (<a style={{fontSize:'14px'}} href={resource.name}>{resource.name}</a>))}
                                                <button style={{float:'right'}} id={'checkState'+datapackage.doi} onClick={(e)=>{this.checkState(e,datapackage.doi)}}>check state</button>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            );
                        }}
                    </Query>
                ) : (
                    <div></div>
                )}
            </div>
        );
    }
}
export default MyDatapackage;