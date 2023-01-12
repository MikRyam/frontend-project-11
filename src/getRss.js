import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const makeProxy = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);
  return proxyUrl.toString();
};

export const fetchData = (url) => {
  const proxyUrl = makeProxy(url);
  return axios.get(proxyUrl);
};

export const parseData = (contentData) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contentData, 'text/xml');
  const parseError = doc.querySelector('parsererror');

  if (parseError) {
    const error = new Error(parseError.textContent);
    error.isParsingError = true;
    throw error;
  }

  const items = Array.from(doc.querySelectorAll('item'));
  const posts = [];
  items.map((item) => posts.push({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));
  const channel = doc.querySelector('channel');
  const feed = {
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
  };
  return { posts, feed };
};

export const normalizePostsData = (posts, feedId) => posts.map(({ title, description, link }) => ({
  id: uuidv4(),
  feedId,
  title,
  description,
  link,
  viewed: false,
}));

export const handleData = (data, state, url) => {
  const { posts, feed } = data;
  const feedId = uuidv4();
  state.rssFeeds.push({ id: feedId, link: url, ...feed });
  const postsNormalized = normalizePostsData(posts, feedId);
  state.rssPosts.push(...postsNormalized);
};

export const updatePosts = (state, refreshTime) => {
  const { rssPosts, rssFeeds } = state;

  const promises = rssFeeds.map((feed) => fetchData(feed.link)
    .then((response) => {
      const { posts } = parseData(response.data.contents);
      const existedPostLinks = rssPosts.map((post) => post.link);
      let newPosts = posts.filter((post) => !existedPostLinks.includes(post.link));
      if (newPosts.length > 0) {
        newPosts = normalizePostsData(newPosts, feed.id);
        rssPosts.push(...newPosts);
      }
    }));

  Promise
    .all(promises)
    .finally(() => setTimeout(() => updatePosts(state, refreshTime), refreshTime));
};
