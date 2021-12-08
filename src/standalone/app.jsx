/// <reference path="../../node_modules/iina-plugin-definition/iina/index.d.ts" />

import "bulma/css/bulma.min.css";

import React, { useEffect, useState } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

import Editor from "./Editor";
import List from "./List";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/edit/:id">
          <Editor />
        </Route>
        <Route path="/">
          <List />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
