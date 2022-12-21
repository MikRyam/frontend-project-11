import * as yup from 'yup';
import onChange from 'on-change';
import render from './view';

const app = () => {
  console.log('Hello World!');

  const initialState = {
    rssForm: {
      // valid: true,
      state: 'valid', // filling valid invalid
      error: null,
      processError: null,
      fields: {
        url: '',
      },
    },
    feeds: [],
    posts: [],
    rssUrls: ['https://ru.hexlet.io/lessons.rss'],
  };

  const schema = yup
    .string()
    .trim()
    .required('Поле должно быть заполнено')
    .url('Ссылка должна быть действительным URL')
    .notOneOf(initialState.rssUrls, 'RSS уже существует');

  const validate = (inputUrl, state) =>
    schema
      .validate(inputUrl)
      .then(() => {
        state.rssForm.state = 'valid';
        state.rssForm.error = null;
      })
      .catch((error) => {
        state.rssForm.error = error.message;
        console.log(error.message);
        state.rssForm.state = 'invalid';
      });
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

  const state = onChange(initialState, render(elements, initialState));

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    console.log('url', url);
    validate(url, state);
  });
};

export default app;
