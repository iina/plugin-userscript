/// <reference path="../../node_modules/iina-plugin-definition/iina/index.d.ts" />

import React, { useEffect, useState } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

import Editor from "./Editor";
import List from "./List";
import { CssVarsProvider, CssBaseline } from "@mui/joy";

const App = () => {
  return (
    <CssVarsProvider defaultMode="system">
      <CssBaseline />
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
    </CssVarsProvider>
  );
};

export default App;
