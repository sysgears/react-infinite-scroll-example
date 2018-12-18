import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import ChaptersListQuery from '../chapters/ChaptersListQuery';
import chaptersResolvers from '../chapters/resolvers';

import './App.css';

const client = new ApolloClient({
  clientState: chaptersResolvers
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <ChaptersListQuery />
      </ApolloProvider>
    );
  }
}

export default App;
