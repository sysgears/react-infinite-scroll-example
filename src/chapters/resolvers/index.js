import mockChapters from '../data/chapters';

const getChapters = ({ limit = 10, offset = 0 }) =>
  mockChapters
    .slice(offset, offset + limit)
    .map(chapter => ({ ...chapter, __typename: 'Chapter' }));

export default {
  defaults: {
    chapters: getChapters({})
  },
  resolvers: {
    Query: {
      chapters: (_, variables) => getChapters(variables)
    }
  }
};
