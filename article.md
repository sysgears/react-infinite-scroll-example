## How to implement infinite scroll with GraphQL and React

![alt text](https://cdn.searchenginejournal.com/wp-content/uploads/2014/02/infinite-scrolling1.jpg 'Infinite Scroll')

> Using Apollo Client, React and Relay-style pagination.

GraphQL is an amazing way to query and manipulate data. You describe your data, ask for what you want, and get predictable results. And Apollo Client is the best way to use GraphQL to build client applications. One of the most interesting solution is implementing relay-style pagination as infinite scroll using `fetchMore` function. It's incredibly simple and very powerful functionality.

### Preparing data

Using Relay-style cursors is very similar to basic cursor-based pagination.
At first we need to transform structure of our data to the something like that:

```js
{
  edges {
    cursor // pointer to an item in the dataset
    node {
      // data fields
    }
  }
  pageInfo {
    endCursor // pointer to cursor of the last element in array
    hasNextPage
  }
}
```

In my case I have a list of books chapters with the next structure:

```json
    [
        {
            "id": 69,
            "title": "The Sorting Hat",
            "book_id": 4,
            "ordering": 7
        },
        {
            "id": 70,
            "title": "The Potions Teacher",
            "book_id": 4,
            "ordering": 8
        },
        ...
    ]
```

I use `id` field as `cursor` here.
As a result I got the following initial data:

```js
    {
        edges: [
            {
                cursor: 0,
                node: {
                    id: 0,
                    title: 'The Boy Who Lived',
                    book_id: 1,
                    ordering: 1
                }
            },
            {
                cursor: 1,
                node: {
                    id: 1,
                    title: 'The Vanishing Glass',
                    book_id: 1,
                    ordering: 2
                }
            },
            ...
        ],
        pageInfo: {
            endCursor: 0,
            hasNextPage: true
        }
```

### Write a query

We can create GraphQL query to fetch our chapters.

- `first` - the number of items that we will receive at one time
- `after` - pointer to the item starting from which we will retrieve data (equals `endCursor` from the previous data retrieval)

```
const chaptersQuery = gql`
  query chapters($cursor: String) {
    chapters(first: 10, after: $cursor) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
```

Then we can use Query component from Apollo. The main idea there is to implement `onLoadMore` function which will execute `fetchMore` to loading more data and merge it with already fetched chapters.

```js
<Query query={chaptersQuery}>
  {({ data, fetchMore }) => (
    <ChaptersList
      chapters={data.chapters || []}
      onLoadMore={() =>
        fetchMore({
          variables: {
            cursor: data.chapters.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.chapters.edges;
            const pageInfo = fetchMoreResult.chapters.pageInfo;

            return newEdges.length
              ? {
                  // Put the new data at the end of the list and update `pageInfo`
                  // so we have the new `endCursor` and `hasNextPage` values
                  chapters: {
                    __typename: previousResult.chapters.__typename,
                    edges: [...previousResult.chapters.edges, ...newEdges],
                    pageInfo
                  }
                }
              : previousResult;
          }
        })
      }
    />
  )}
</Query>
```

### Create component with infinite scroll

We need a component which will be display chapters list with scroll bar. This component will receive the list of chapters and `onLoadMore` function for loading more chapters.

```js
const ChaptersList = ({ chapters, onLoadMore }) => (
  <div>
    <div className="chapters-list" onScroll={e => handleScroll(e, onLoadMore)}>
      {chapters.edges.map(({ node }) => (
        <p key={node.id}>{node.title}</p>
      ))}
    </div>
  </div>
);
```

And lastly, we need function that will execute load more function when we scroll to the bottom of our component.

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
