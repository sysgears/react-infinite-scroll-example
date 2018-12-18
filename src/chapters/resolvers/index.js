import mockChapters from '../chapters';

const getChapters = ({ limit, offset = 0 }) =>
  mockChapters
    .filter((_, index) => !limit || (index > offset && index <= offset + limit))
    .map(chapter => ({ ...chapter, __typename: 'Chapter' }));

export default {
  defaults: {
    chapters: getChapters({ limit: 10 })
  },
  resolvers: {
    Query: {
      chapters: (_, variables) => getChapters(variables)
    }
  }
};
