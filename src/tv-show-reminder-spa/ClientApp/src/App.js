import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Search } from './components/Search';
import { Subscriptions } from './components/Subscriptions';
import { Authentication } from './components/Authentication';
import { ProtectedRoute } from "./components/protected-route";

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <ProtectedRoute exact path='/' component={Home} />
        <ProtectedRoute exact path='/search' component={Search} />
        <ProtectedRoute exact path='/subscriptions' component={Subscriptions} />
        <Route exact path='/authentication' component={Authentication} />
      </Layout>
    );
  }
}
