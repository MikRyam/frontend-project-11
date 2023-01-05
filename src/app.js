import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import resources from './locales/index.js';
import render from './view';
import validate from './validate';
import fetchData from './fetchData';
import parseData from './parseData';
import handleData from './handleData';
import updatePosts from './updatePosts';

const handleError = (error) => {
  if (error.isParsingError) {
    return 'form.feedback.invalidRss';
  }
  if (axios.isAxiosError(error)) {
    return 'form.feedback.networkError';
  }
  return error.message;
};

const app = async () => {
  console.log('Hello World!');

  const refreshTime = 5000;

  const defaultLanguage = 'ru';
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  const initialState = {
    rssForm: {
      state: 'ready', // ready, filling, valid, invalid
      error: null,
    },
    fetchingData: {
      state: 'waiting', // waiting, loading, success, failed
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

  const { fetchingData, rssForm } = state;

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.fetchingData.state = 'waiting';
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validate(url, state)
      .then(() => {
        rssForm.state = 'valid';
        rssForm.error = null;
        fetchingData.state = 'loading';
        return fetchData(url);
      })
      .then((response) => {
        console.log(response.data.contents);
        const data = parseData(response.data.contents);
        handleData(data, state, url);
        fetchingData.state = 'success';
        rssForm.state = 'ready';
      })
      .catch((error) => {
        // rssForm.error = error.message;
        rssForm.error = handleError(error);
        rssForm.state = 'invalid';
        fetchingData.state = 'failed';
      });
  });

  setTimeout(() => updatePosts(state, refreshTime), refreshTime);
};

export default app;
