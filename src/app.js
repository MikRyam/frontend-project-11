import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/index.js';
import render from './view';
import validate from './validate';

const app = async () => {
  console.log('Hello World!');

  const defaultLanguage = 'ru';
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  const initialState = {
    rssForm: {
      // valid: true,
      state: 'ready', // ready, filling, valid, invalid
      error: null,
      fields: {
        url: '',
      },
    },
    fetchingData: {
      state: 'waiting', // waiting, loading, success, failed, networkError
      feedback: null,
    },
    rssFeeds: [],
    rssPosts: [],
  };

  const elements = {
    form: document.querySelector('form.rss-form'),
    input: document.getElementById('url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedbackEl: document.querySelector('p.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modalEl: document.getElementById('modal'),
    closeModalButtons: document.querySelectorAll('#modal button[data-bs-dismiss="modal"]'),
    readAllModalButton: document.querySelector('#modal a.full-article'),
  };

  const state = onChange(initialState, render(elements, initialState, i18nextInstance));

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    state.fetchingData.state = 'waiting';
    const formData = new FormData(e.target);
    const url = formData.get('url');
    console.log('url', url);
    await validate(url, state);
  });
};

export default app;
