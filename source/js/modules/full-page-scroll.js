import throttle from 'lodash/throttle';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.screen = {
      active: 0,
      previous: 0,
      cover: document.querySelector(`.cover-from-bottom-to-top`)
    };

    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
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
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.screen.previous = this.screen.active;
    this.screen.active = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  setActivateScreen(removeCover) {
    this.screenElements.forEach((screen) => {
      screen.classList.remove(`active`);
      screen.classList.add(`screen--hidden`);
    });
    this.screenElements[this.screen.active].classList.remove(`screen--hidden`);
    this.screenElements[this.screen.active].classList.add(`active`);

    if (removeCover) {
      this.screen.cover.classList.remove(`show`);
    }
  }

  changeVisibilityDisplay() {
    // экраны
    const active = this.screenElements[this.screen.active].id;
    const previous = this.screenElements[this.screen.previous].id;

    const showStoryCover = active !== `story` && previous === `story`;

    if (showStoryCover) {
      this.screen.cover.classList.add(`show`);
      setTimeout(() => this.setActivateScreen(true), 750);
    } else {
      this.setActivateScreen();
    }
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
