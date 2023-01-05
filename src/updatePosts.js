import fetchData from './fetchData';
import parseData from './parseData';
import { normalizePostsData } from './handleData';

const updatePosts = (state, refreshTime) => {
  const { rssPosts, rssFeeds } = state;

  const promises = rssFeeds.map((feed) => fetchData(feed.link)
    .then((response) => {
      const { posts } = parseData(response.data.contents);
      const existedPostLinks = rssPosts.map((post) => post.link);
      let newPosts = posts.filter((post) => !existedPostLinks.includes(post.link));
      if (newPosts.length > 0) {
        newPosts = normalizePostsData(newPosts, feed.id);
        rssPosts.push(...newPosts);
        console.log(rssPosts);
      }
    }));

  Promise
    .all(promises)
    .finally(() => setTimeout(() => updatePosts(state, refreshTime), refreshTime));
};

export default updatePosts;
