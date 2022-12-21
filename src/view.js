const renderError = ({ feedbackEl }, error) => {
  if (error) {
    console.log('errorRender', error)
    feedbackEl.textContent = error;
  }
  return;
};
const handleState = (elements, state) => {
  switch (state) {
    case 'valid':
      elements.input.classList.remove('is-invalid');
      elements.feedbackEl.innerHTML = '';
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

const render = (elements, initialState) => (path, value, prevValue) => {
  switch (path) {
    case 'rssForm.state':
      handleState(elements, value);
      break;
    case 'rssForm.error':
      renderError(elements, value);
      break;
    default:
      break;
  }
};

export default render;
