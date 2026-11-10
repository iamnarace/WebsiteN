import { animate, hover, press, scroll } from './vendor/motion.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function springHover(selector, scale) {
  document.querySelectorAll(selector).forEach((element) => {
    hover(element, () => {
      animate(element, { scale }, { type: 'spring', stiffness: 460, damping: 18 });
      return () => animate(element, { scale: 1 }, { type: 'spring', stiffness: 520, damping: 28 });
    });
    press(element, () => {
      animate(element, { scale: 0.975 }, { type: 'spring', stiffness: 700, damping: 24 });
      return () => animate(element, { scale: 1 }, { type: 'spring', stiffness: 520, damping: 26 });
    });
  });
}

function bindScrollLine() {
  const line = document.querySelector('.process-line-fill');
  const process = document.querySelector('.process');
  if (!line || !process) return;
  const controls = animate(line, { scaleX: [0, 1] }, { ease: 'linear', autoplay: false });
  scroll(controls, { target: process, offset: ['start 80%', 'end 55%'] });
}

function bindScreenTilt() {
  const frame = document.querySelector('#homelife-preview .product-screen-frame');
  if (!frame) return;
  scroll((progress) => {
    const shift = (0.5 - progress) * 10;
    frame.style.transform = `perspective(1200px) rotateY(${shift}deg) rotateX(${shift / 3}deg)`;
  }, { target: frame, offset: ['start end', 'end start'] });
}

if (!reduced) {
  document.documentElement.classList.add('motion');
  try {
    springHover('.btn, .submit-btn, .service-tab, .nav-cta', 1.045);
    springHover('.tcard.home', 1.02);
    springHover('.tcard.biz', 1.018);
    springHover('.tcard.digital', 1.025);
    springHover('.gcard.c1', 1.02);
    springHover('.gcard.c2', 1.03);
    springHover('.gcard.c3', 1.025);
    springHover('.svc', 1.012);
    springHover('.testi', 1.015);
    springHover('.founder-card', 1.012);
    springHover('.why', 1.02);
    springHover('.guide-card', 1.015);
    springHover('.sitem', 1.02);
    springHover('.social a', 1.08);
    bindScrollLine();
    bindScreenTilt();
  } catch (error) {
    console.warn('Motion enhancements skipped', error);
  }
}
