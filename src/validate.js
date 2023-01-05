import * as yup from 'yup';

const validate = (inputUrl, state) => {
  const { rssFeeds } = state;

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
    .notOneOf(rssFeeds.map(({ link }) => link));

  return schema.validate(inputUrl);
};

export default validate;
