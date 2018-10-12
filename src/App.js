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

class App extends Component {
  render() {
    return (
        <HashRouter>
            <ApolloProvider client={client}>
                <div className="App">
                    <Switch>
                        <Route exact path="/" component={Welcome} />
                        <Route exact path="/authenticate" component={RegisterLogin} />
                        <Route exact path="/excel" component={ExcelAndReactive} />
                        <Route exact path="/upload" component={DatapackageUpload} />
                        <Route exact path="/myData" component={MyDatapackage} />
                        <Route exact path="/rdf" component={MultistepRDF} />
                    </Switch>
                </div>
            </ApolloProvider>
        </HashRouter>
    );
  }
}

export default App;
