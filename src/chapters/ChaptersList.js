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
  <div>
    <div className="chapters-list" onScroll={e => handleScroll(e, onLoadMore)}>
      {chapters &&
        chapters.edges.map(({ node }) => <p key={node.id}>{node.title}</p>)}
    </div>
  </div>
);

export default ChaptersList;
