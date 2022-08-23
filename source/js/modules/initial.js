export const initial = () => {
  const body = document.querySelector(`body`);
  const onPageLoad = () => {
    body.classList.add(`is-loaded`);
  };
  window.addEventListener(`load`, onPageLoad);
};
