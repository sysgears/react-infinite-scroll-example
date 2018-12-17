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
    <h2>Chapters list</h2>
    <ul
      className="list-group chapters-list"
      onScroll={e => handleScroll(e, onLoadMore)}
    >
      {chapters.map(({ id, title }) => (
        <li key={id} className="list-group-item">
          {title}
        </li>
      ))}
    </ul>
  </div>
);

export default ChaptersList;
