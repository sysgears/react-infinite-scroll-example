import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import ChaptersListQuery from './chapters/ChaptersListQuery';
import mockChapters from './chapters/chapters';
import './App.css';

const getChapters = ({ first, after = 0 }) => {
  const chapters = mockChapters
    .map(chapter => ({
      cursor: chapter.id,
      node: { ...chapter, __typename: 'Chapter' },
      __typename: 'ChapterNode'
    }))
    .filter(
      chapter =>
        !first || (chapter.node.id > after && chapter.node.id <= after + first)
    );
  return {
    edges: chapters,
    pageInfo: {
      endCursor: chapters[chapters.length - 1].node.id,
      hasNextPage: chapters[chapters.length - 1].node.id !== mockChapters[mockChapters.length - 1].node.id,
      __typename: 'ChapterPageInfo'
    },
    __typename: 'ChapterPayload'
  };
};

const client = new ApolloClient({
  clientState: {
    defaults: {
      chapters: getChapters({})
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
