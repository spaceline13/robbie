import React, { Component } from 'react';
import {client} from "./lib/apolloClient";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import UserAreaHeader from "./Components/UserAreaHeader";
import RegisterLogin from "./Components/RegisterLogin";
import ExcelAndReactive from "./Components/ExcelAndReactive";
import DatasetUpload from "./Components/DatasetUpload";

class App extends Component {
  render() {
    return (
        <BrowserRouter>
            <ApolloProvider client={client}>
              <div className="App">
                  <Switch>
                      <Route exact path="/" component={UserAreaHeader} />
                      <Route exact path="/authenticate" component={RegisterLogin} />
                      <Route exact path="/excel" component={ExcelAndReactive} />
                      <Route exact path="/upload" component={DatasetUpload} />
                  </Switch>
              </div>
            </ApolloProvider>
        </BrowserRouter>
    );
  }
}

export default App;
