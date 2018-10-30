import React, { Component } from 'react';
import {client} from "./lib/apolloClient";
import { ApolloProvider } from "react-apollo";
import { HashRouter, Switch, Route } from 'react-router-dom'
import Welcome from "./Components/Welcome";
import RegisterLogin from "./Components/RegisterLogin";
import ExcelAndReactive from "./Components/ExcelAndReactive";
import DatapackageUpload from "./Components/DatapackageUpload";
import MyDatapackage from "./Components/MyDatapackage";
import MultistepRDF from "./Components/MultistepRDF";
import GardianRepositories from "./Components/Gardian/GardianRepositories";
import GardianServices from "./Components/Gardian/GardianServices";
import UserList from "./Components/CMS/UserList";

class App extends Component {
  render() {
    return (
        <HashRouter>
            <ApolloProvider client={client}>
                <div className="App">
                    <Switch>
                        <Route exact path="/" component={Welcome} />
                        <Route exact path="/adminusers" component={UserList} />
                        <Route exact path="/authenticate" component={RegisterLogin} />
                        <Route exact path="/excel" component={ExcelAndReactive} />
                        <Route exact path="/upload" component={DatapackageUpload} />
                        <Route exact path="/myData" component={MyDatapackage} />
                        <Route exact path="/rdf" component={MultistepRDF} />
                        <Route exact path="/gardianServices" component={GardianServices} />
                        <Route exact path="/gardianRepo" component={GardianRepositories} />
                    </Switch>
                </div>
            </ApolloProvider>
        </HashRouter>
    );
  }
}

export default App;
