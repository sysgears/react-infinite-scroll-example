import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import ChaptersListQuery from '../chapters/ChaptersListQuery';
import mockChapters from '../chapters/chapters';
import './App.css';

const getChapters = ({ first, after = 0 }) => {
  const chapters = mockChapters
    .filter((_, index) => !first || (index > after && index <= after + first))
    .map((chapter, index) => ({
      cursor: index,
      node: { ...chapter, __typename: 'Chapter' },
      __typename: 'ChapterNode'
    }));
  return {
    edges: chapters,
    pageInfo: {
      endCursor: chapters.length,
      hasNextPage: chapters.length < mockChapters.length,
      __typename: 'ChapterPageInfo'
    },
    __typename: 'ChapterPayload'
  };
};

const client = new ApolloClient({
  clientState: {
    defaults: {
      chapters: getChapters({ first: 10 })
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
