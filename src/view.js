const renderError = ({ feedbackEl }, error, i18nextInstance) => {
  if (error) {
    console.log('errorRender', error);
    feedbackEl.classList.add('text-danger');
    feedbackEl.textContent = i18nextInstance.t(error);
  }
};

const renderState = (elements, state) => {
  switch (state) {
    case 'valid':
      console.log(state);
      elements.input.classList.remove('is-invalid');
      elements.feedbackEl.innerHTML = '';
      break;
    case 'ready':
      console.log(state);
      elements.form.reset();
      elements.input.focus();
      break;
    case 'invalid':
      elements.input.classList.add('is-invalid');
      break;
    default:
      // https://ru.hexlet.io/blog/posts/sovershennyy-kod-defolty-v-svitchah
      throw new Error(`Unknown process state: ${state}`);
  }
};

const renderFetchingDataFeedback = ({ feedbackEl }, value, i18nextInstance) => {
  switch (value) { // waiting, loading, success, failed
    case 'waiting':
      feedbackEl.classList.remove('text-success');
      feedbackEl.classList.remove('text-warning');
      feedbackEl.classList.add('text-danger');
      feedbackEl.innerHTML = '';
      console.log(value);
      break;
    case 'loading':
      feedbackEl.classList.remove('text-success');
      feedbackEl.classList.remove('text-danger');
      feedbackEl.classList.add('text-warning');
      feedbackEl.textContent = i18nextInstance.t('form.feedback.loading');
      // feedbackEl.innerHTML = '';
      console.log(value);
      break;
    case 'failed':
      console.log(value);
      feedbackEl.classList.remove('text-success');
      feedbackEl.classList.remove('text-warning');
      feedbackEl.classList.add('text-danger');
      break;
    case 'success':
      console.log(value);
      feedbackEl.classList.remove('text-danger');
      feedbackEl.classList.remove('text-warning');
      feedbackEl.classList.add('text-success');
      feedbackEl.textContent = i18nextInstance.t('form.feedback.success');
      break;
    default:
      // https://ru.hexlet.io/blog/posts/sovershennyy-kod-defolty-v-svitchah
      throw new Error(`Unknown process state: ${value}`);
  }
};

const renderFeeds = ({ feedsContainer }, value, i18nextInstance) => {
  feedsContainer.innerHTML = '';
  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  // cardBorder.prepend(cardBody);
  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('card-title', 'h4');
  feedsTitle.textContent = i18nextInstance.t('feeds.title');
  cardBody.append(feedsTitle);
  cardBorder.append(cardBody);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  value.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    li.prepend(h3);
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    li.append(p);
    ul.prepend(li);
  });
  cardBorder.append(ul);
  feedsContainer.append(cardBorder);
};

const renderPosts = ({ postsContainer }, value, i18nextInstance) => {
  postsContainer.innerHTML = '';
  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('cadr-title', 'h4');
  postsTitle.textContent = i18nextInstance.t('posts.title');
  cardBody.append(postsTitle);
  cardBorder.append(cardBody);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounder-0');
  value.map((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.setAttribute('href', post.link);
    a.classList.add(post.viewed ? ['fw-normal', 'link-secondary'] : 'fw-bold');
    a.setAttribute('data-id', post.id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = post.title;
    li.prepend(a);
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', post.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.setAttribute('data-bs-id', post.id);
    button.setAttribute('data-bs-title', post.title);
    button.setAttribute('data-bs-description', post.description);
    button.setAttribute('data-bs-link', post.link);
    button.textContent = i18nextInstance.t('posts.button');
    li.append(button);
    ul.prepend(li);
    return ul;
  });
  cardBorder.append(ul);
  postsContainer.append(cardBorder);
};

const render = (elements, initialState, i18nextInstance) => (path, value, prevValue) => {
  switch (path) {
    case 'rssForm.state':
      renderState(elements, value);
      break;
    case 'rssForm.error':
      renderError(elements, value, i18nextInstance);
      break;
    case 'fetchingData.state':
      renderFetchingDataFeedback(elements, value, i18nextInstance);
      break;
    case 'rssFeeds':
      renderFeeds(elements, value, i18nextInstance);
      break;
    case 'rssPosts':
      renderPosts(elements, value, i18nextInstance);
      break;
    default:
      break;
  }
};

export default render;
