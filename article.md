## How to implement infinite scroll with GraphQL and React

![alt text](https://cdn.searchenginejournal.com/wp-content/uploads/2014/02/infinite-scrolling1.jpg 'Infinite Scroll')

> Using Apollo Client, React and Apollo Link State for implementing Offset-based pagination.

GraphQL is an amazing way to query and manipulate data. You describe your data, ask for what you want, and get predictable results. And Apollo Client is the best way to use GraphQL to build client applications. One of the most interesting solution is implementing offset-based pagination as infinite scroll using `fetchMore` function. It's incredibly simple and very powerful functionality.

Apollo Link State is used to simplify providing of data and can be replaced by any real GraphQL server.

### Write component with a query

We use GraphQL query to fetch our chapters. For that create `ChaptersListQuery.js` file in `src/chapters` folder and write a query.

- `limit` - the number of items that we receive at one time
- `offset` - pointer to the item starting from which we retrieve data (equals length of the previous data retrieval)
- `@client` - needed only for Apollo-link-state

```
const chaptersQuery = gql`
  query chapters($offset: String) {
    chapters(limit: 10, offset: $offset) @client {
      id
      title
    }
  }
`;
```

Then we use Query component from Apollo. The main idea there is to implement `onLoadMore` function which execute `fetchMore` to loading more data and merge it with already fetched chapters. So we add `ChaptersListQuery` component into our `ChaptersListQuery.js`.

```js
const ChaptersListQuery = () => (
  <Query query={chaptersQuery}>
    {({ data, fetchMore }) =>
      data && (
        <ChaptersList
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
```

### Create component with infinite scroll

We need a component which displays chapters list with scroll bar. This component receive the list of chapters and `onLoadMore` function for loading more chapters. Create `ChaptersList.js` in `src/chapters` folder.

You can use any type of library for infinitely load content to display data instead of building your own.

```js
const ChaptersList = ({ chapters, onLoadMore }) => (
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
);
```

And lastly, we need function that execute load more function when we scroll to the bottom of our component.

```js
const handleScroll = ({ currentTarget }, onLoadMore) => {
  if (
    currentTarget.scrollTop + currentTarget.clientHeight >=
    currentTarget.scrollHeight
  ) {
    onLoadMore();
  }
};
```

Congratulations! You've done beautifully!

Link with the example on SandBox: [https://codesandbox.io/s/github/alekseyzadorozhniy/infinite-scroll/tree/master/](https://codesandbox.io/s/github/alekseyzadorozhniy/infinite-scroll/tree/master/)
Link with example repository on Github: [https://github.com/alekseyzadorozhniy/infinite-scroll](https://github.com/alekseyzadorozhniy/infinite-scroll)
