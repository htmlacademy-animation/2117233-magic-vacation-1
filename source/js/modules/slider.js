import Swiper from "swiper";

export default () => {
  const COLORS = {
    DARK: `dark`,
    PURPLE: `purple`,
    BLUE: `blue`,
    LIGHT_BLUE: `lightBlue`,
  };
  let storySlider;
  const body = document.querySelector(`body`);
  let sliderContainer = document.getElementById(`story`);
  sliderContainer.style.backgroundImage = `url("img/slide1.jpg"), linear-gradient(180deg, rgba(83, 65, 118, 0) 0%, #523E75 16.85%)`;

  const setSlider = function () {
    if (((window.innerWidth / window.innerHeight) < 1) || window.innerWidth < 769) {
      storySlider = new Swiper(`.js-slider`, {
        pagination: {
          el: `.swiper-pagination`,
          type: `bullets`
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: () => {
            switch (storySlider.activeIndex) {
              case 0:
              case 1:
                sliderContainer.style.backgroundImage = `url("img/slide1.jpg"), linear-gradient(180deg, rgba(83, 65, 118, 0) 0%, #523E75 16.85%)`;
                body.dataset.theme = COLORS.PURPLE;
                break;
              case 2:
              case 3:
                sliderContainer.style.backgroundImage = `url("img/slide2.jpg"), linear-gradient(180deg, rgba(45, 54, 179, 0) 0%, #2A34B0 16.85%)`;
                body.dataset.theme = COLORS.BLUE;
                break;
              case 4:
              case 5:
                sliderContainer.style.backgroundImage = `url("img/slide3.jpg"), linear-gradient(180deg, rgba(92, 138, 198, 0) 0%, #5183C4 16.85%)`;
                body.dataset.theme = COLORS.LIGHT_BLUE;
                break;
              case 6:
              case 7:
                sliderContainer.style.backgroundImage = `url("img/slide4.jpg"), linear-gradient(180deg, rgba(45, 39, 63, 0) 0%, #2F2A42 16.85%)`;
                body.dataset.theme = COLORS.DARK;
                break;
            }
          },
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    } else {
      storySlider = new Swiper(`.js-slider`, {
        slidesPerView: 2,
        slidesPerGroup: 2,
        pagination: {
          el: `.swiper-pagination`,
          type: `fraction`
        },
        navigation: {
          nextEl: `.js-control-next`,
          prevEl: `.js-control-prev`,
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: () => {
            switch (storySlider.activeIndex) {
              case 0:
                sliderContainer.style.backgroundImage = `url("img/slide1.jpg")`;
                body.dataset.theme = COLORS.PURPLE;
                break;
              case 2:
                sliderContainer.style.backgroundImage = `url("img/slide2.jpg")`;
                body.dataset.theme = COLORS.BLUE;
                break;
              case 4:
                sliderContainer.style.backgroundImage = `url("img/slide3.jpg")`;
                body.dataset.theme = COLORS.LIGHT_BLUE;
                break;
              case 6:
                sliderContainer.style.backgroundImage = `url("img/slide4.jpg")`;
                body.dataset.theme = COLORS.DARK;
                break;
            }
          },
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    }
  };

  window.addEventListener(`resize`, function () {
    if (storySlider) {
      storySlider.destroy();
    }
    setSlider();
  });

  setSlider();
};
