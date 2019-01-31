import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import ChapterListQuery from '../chapters/ChapterListQuery';
import chapterResolvers from '../chapters/resolvers';

import './App.css';

const client = new ApolloClient({
  clientState: chapterResolvers
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <ChapterListQuery />
      </ApolloProvider>
    );
  }
}

export default App;
