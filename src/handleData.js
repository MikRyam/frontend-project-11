import { v4 as uuidv4 } from 'uuid';

export const normalizePostsData = (posts, feedId) => {
  posts.map(({ title, description, link }) => ({
    id: uuidv4(),
    feedId,
    title,
    description,
    link,
    viewed: false,
  }));
  return posts;
};

const handleData = (data, state, url) => {
  const { posts, feed } = data;
  const feedId = uuidv4();
  state.rssFeeds.push({ id: feedId, link: url, ...feed });
  normalizePostsData(posts, feedId);
  state.rssPosts.push(...posts);
};

export default handleData;
