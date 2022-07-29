const spanLetters = (string) => {
  const words = string.textContent.split(` `);
  string.textContent = ``;

  words.forEach((word) => {
    const wrapper = document.createElement(`span`);
    const letters = word.split(``);

    letters.forEach((letter) => {
      let letterWrapper = document.createElement(`span`);
      letterWrapper.textContent = letter;
      wrapper.append(letterWrapper)
    });
    string.append(wrapper);
  });
};

export const letterByLetter = () => document.querySelectorAll(`
  .intro__title, .intro__date, .slider__item-title, .prizes__title, .rules__title, .game__title
`).forEach(spanLetters);
