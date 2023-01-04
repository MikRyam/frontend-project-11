import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const xmlParser = (contentData) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contentData, 'application/xml');
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

const fetchRssData = (inputUrl, state) => {
  const {
    rssFeeds, rssPosts, fetchingData, rssForm,
  } = state;
  fetchingData.state = 'loading';
  axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(inputUrl)}`)
    .then((response) => {
      // handle success
      console.log(response.data.contents);
      const isRSS = (data) => data.includes('<rss');
      if (!isRSS(response.data.contents)) {
        console.log('not contain RSS');
        fetchingData.state = 'failed';
        return new Error('Site does not contain RSS');
      }

      const { posts, feed } = xmlParser(response.data.contents);
      console.log(feed);
      console.log(posts);
      const feedId = uuidv4();
      rssFeeds.push({ id: feedId, url: inputUrl, ...feed });
      rssPosts.push(...posts.map(({ title, description, link }) => ({
        id: uuidv4(),
        feedId,
        title,
        description,
        link,
        viewed: false,
      })));
      fetchingData.state = 'success';
      rssForm.state = 'ready';
    })
    .catch((error) => {
      // handle error
      console.log(error);
      fetchingData.state = 'networkError';
    });
};

export default fetchRssData;
