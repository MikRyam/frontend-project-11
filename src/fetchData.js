import axios from 'axios';

const makeProxy = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);
  return proxyUrl.toString();
};

const fetchData = (url) => {
  const proxyUrl = makeProxy(url);
  return axios.get(proxyUrl);
};

export default fetchData;
