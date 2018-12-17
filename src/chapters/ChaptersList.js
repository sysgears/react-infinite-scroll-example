import React from 'react';

const handleScroll = ({ currentTarget }, onLoadMore) => {
  if (
    currentTarget.scrollTop + currentTarget.clientHeight >=
    currentTarget.scrollHeight
  ) {
    onLoadMore();
  }
};

const ChaptersList = ({ chapters, onLoadMore }) => (
  <ul
    className="list-group chapters-list"
    onScroll={e => handleScroll(e, onLoadMore)}
  >
    {chapters &&
      chapters.edges.map(({ node }) => (
        <li key={node.id} className="list-group-item">
          {node.title}
        </li>
      ))}
  </ul>
);

export default ChaptersList;
