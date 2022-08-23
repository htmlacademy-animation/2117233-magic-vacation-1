// modules
import {initial} from './modules/initial.js';
import mobileHeight from './modules/mobile-height-adjust.js';
import slider from './modules/slider.js';
import menu from './modules/menu.js';
import footer from './modules/footer.js';
import chat from './modules/chat.js';
import result from './modules/result.js';
import form from './modules/form.js';
import social from './modules/social.js';
import FullPageScroll from './modules/full-page-scroll.js';
import {letterByLetter} from './modules/letter-by-letter.js';

// init modules
initial();
mobileHeight();
slider();
menu();
footer();
chat();
result();
form();
social();
letterByLetter();

const fullPageScroll = new FullPageScroll();
fullPageScroll.init();

window.addEventListener(`load`, () => document.body.classList.add(`loaded`));
