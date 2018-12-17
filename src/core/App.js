import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import ChaptersListQuery from '../chapters/ChaptersListQuery';
import mockChapters from '../chapters/chapters';
import './App.css';

const getChapters = ({ limit, offset = 0 }) =>
  mockChapters
    .filter((_, index) => !limit || (index > offset && index <= offset + limit))
    .map(chapter => ({ ...chapter, __typename: 'Chapter' }));

const client = new ApolloClient({
  clientState: {
    defaults: {
      chapters: getChapters({ limit: 10 })
    },
    resolvers: {
      Query: {
        chapters: (_, variables) => getChapters(variables)
      }
    }
  }
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
