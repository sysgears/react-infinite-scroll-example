import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import ChapterList from './ChapterList';

const chapterQuery = gql`
  query chapters($offset: String) {
    chapters(limit: 10, offset: $offset) @client {
      id
      title
    }
  }
`;

const ChapterListQuery = () => (
  <Query query={chapterQuery}>
    {({ data, fetchMore }) =>
      data && (
        <ChapterList
          chapters={data.chapters || []}
          onLoadMore={() =>
            fetchMore({
              variables: {
                offset: data.chapters.length
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return Object.assign({}, prev, {
                  chapters: [...prev.chapters, ...fetchMoreResult.chapters]
                });
              }
            })
          }
        />
      )
    }
  </Query>
);

export default ChapterListQuery;
