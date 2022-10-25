import throttle from 'lodash/throttle';

const PAGE_INDEX = {
  TOP: 0,
  STORY: 1,
  PRIZES: 2,
  RULES: 3,
  GAME: 4,
};

export default class FullPageScroll {
  constructor() {
    this.TIMEOUT = {
      THROTTLE: 1000,
      COVER: 500
    };
    this.scrollFlag = true;
    this.timeout = null;

    this.bodyElement = document.querySelector(`body`);
    this.curtainElement = document.querySelector(`.screen__cover`);
    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);
    this.journeyItem = document.querySelector(`.prizes__item--journeys`);
    this.casesItem = document.querySelector(`.prizes__item--cases`);
    this.codesItem = document.querySelector(`.prizes__item--codes`);

    this.screen = {
      active: 0,
      previous: 0
    };

    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.TIMEOUT.THROTTLE, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.screen.active;
      if (currentPosition !== this.screen.active) {
        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.TIMEOUT.THROTTLE);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.screen.previous = this.screen.active;
    this.screen.active = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
    if (this.screen.active === PAGE_INDEX.STORY) {
      this.bodyElement.classList.add(`theme-active`);
      return;
    }
    this.bodyElement.classList.remove(`theme-active`);
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }


  animatePrizes() {
    if (this.journeyItem.classList.contains(`active`)) {
      return;
    }
    // 1st
    const firstSvgPrize = document.getElementById(`journeysPrize`).contentDocument;
    const journeysAnimation = firstSvgPrize.getElementById(`journeysAnimation`);

    if (!firstSvgPrize) {
      return;
    }

    if (journeysAnimation) {
      this.journeyItem.classList.add(`active`);
      journeysAnimation.beginElement();
    }
    // 2nd
    setTimeout(() => {
      const secondSvgPrize = document.getElementById(`casesPrize`).contentDocument;
      const animationTag = secondSvgPrize.getElementById(`casesAnimation`);

      if (animationTag) {
        this.casesItem.classList.add(`active`);
        animationTag.beginElement();
      }
    }, 4000);
    // 3rd
    setTimeout(() => {
      const thirdSvgPrize = document.getElementById(`additionalAward`).contentDocument;
      const animationTag = thirdSvgPrize.getElementById(`suitcaseAnimation`);

      if (animationTag) {
        this.codesItem.classList.add(`active`);
        animationTag.beginElement();
      }
    }, 6200);
  }

  changeVisibilityDisplay() {
    let timeout = 0;

    const isStoryToPrizes = this.screen.active === PAGE_INDEX.PRIZES;
    const isPrizesToRules =
      this.screen.previous === PAGE_INDEX.PRIZES
      && this.screen.active === PAGE_INDEX.RULES;

    this.curtainElement.classList.remove(`showed`);
    if (isStoryToPrizes) {
      this.curtainElement.classList.add(`showed`);
      timeout = this.TIMEOUT.COVER;
      setTimeout(() => this.animatePrizes(), timeout + 500);
    }

    if (isPrizesToRules) {
      const footer = this.screenElements[this.screen.previous].querySelector(`.screen__footer-note`);
      footer.classList.add(`hide`);
      timeout = this.TIMEOUT.COVER;

      setTimeout(() => footer.classList.remove(`hide`), timeout);
    }

    setTimeout(() => {
      this.screenElements.forEach((screen) => {
        screen.classList.add(`screen--hidden`);
        screen.classList.remove(`active`);
      });
      this.screenElements[this.screen.active].classList.remove(`screen--hidden`);
      setTimeout(() => this.screenElements[this.screen.active].classList.add(`active`), 100);
    }, timeout);
  }

  changeActiveMenuItem() {
    const activeItem = Array
      .from(this.menuElements)
      .find((item) => item.dataset.href === this.screenElements[this.screen.active].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.screen.active,
        'screenName': this.screenElements[this.screen.active].id,
        'screenElement': this.screenElements[this.screen.active]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    this.screen.active = delta > 0
      ? Math.min(this.screenElements.length - 1, ++this.screen.active)
      : Math.max(0, --this.screen.active);
  }
}
