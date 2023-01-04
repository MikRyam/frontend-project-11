import * as yup from 'yup';
import fetchRssData from './fetchRssData';

const validate = (inputUrl, state) => {
  const { rssForm, rssFeeds } = state;

  yup.setLocale({
    mixed: {
      required: 'form.feedback.required',
      notOneOf: 'form.feedback.notOneOf',
    },
    string: {
      url: 'form.feedback.invalidUrl',
    },
  });

  const schema = yup
    .string()
    .trim()
    .required()
    .url()
    .notOneOf(rssFeeds.map(({ url }) => url));

  return schema
    .validate(inputUrl)
    .then(() => {
      rssForm.state = 'valid';
      rssForm.error = null;
      fetchRssData(inputUrl, state);
    })
    .catch((error) => {
      rssForm.error = error.message;
      console.log(error.message);
      rssForm.state = 'invalid';
    });
};

export default validate;
