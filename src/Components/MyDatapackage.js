import {Component} from "react";
import React from "react";
import UserAreaHeader from "./UserAreaHeader";

import gql from "graphql-tag";
import { Query } from "react-apollo";

export const DATAPACKAGES = gql`
  query getMyDatapackages {
    getMyDatapackages {
        name
        title
        profile
        description
        version
        author
        resources{
            name
            path
        }
    }
  }
`;

class MyDatapackage extends Component {
    render() {
        const authToken = localStorage.getItem('auth-token');
        return (
            <div>
                <UserAreaHeader/>
                <br />
                {authToken ? (
                    <Query query={DATAPACKAGES}>
                        {({ loading, error, data }) => {
                            if (loading) return "Loading...";
                            if (error) return `Error! ${error.message}`;

                            return (
                                <section>
                                    <ul style={{margin:'0px',padding:'0px'}}>
                                        {data.getMyDatapackages.map((datapackage, index) => (
                                            <li style={{border: '1px solid grey',display: 'block',marginBottom: '10px', }} key={datapackage.name}>
                                                <h3 style={{margin:'0px',backgroundColor:'#ff920066',padding:'5px'}}>{datapackage.name}</h3>
                                                <hr style={{marginTop:'0px'}}/>
                                                <span style={{fontSize:'14px'}} dangerouslySetInnerHTML={{ __html: datapackage.description}}></span>
                                                resources: {datapackage.resources.map(resource => (<a style={{fontSize:'14px'}} href={resource.name}>{resource.name}</a>))}<br />
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