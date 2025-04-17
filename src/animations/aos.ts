// src/animations/aos.ts

declare module 'aos';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const initAOS = () => {
  AOS.init({
    duration: 1000,
    easing: 'ease-out',
    once: true,
    offset: 200
  });
};
