const parseData = (contentData) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contentData, 'text/xml');
  const parseError = doc.querySelector('parsererror');
  console.log(parseError);

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

export default parseData;
