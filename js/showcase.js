// ЛР10: Swiper.js і Fancybox v5 для «Потік монет» (feedback-form).
// Без jQuery. Бібліотеки підключені з defer до цього файлу.
document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof Swiper !== 'undefined' && document.querySelector('.planner-swiper')) {
    new Swiper('.planner-swiper', {
      loop: true,
      spaceBetween: 24,
      autoplay: reducedMotion
        ? false
        : { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.planner-swiper .swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.planner-swiper .swiper-button-next',
        prevEl: '.planner-swiper .swiper-button-prev',
      },
      keyboard: { enabled: true },
      breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }

  if (typeof Fancybox !== 'undefined') {
    Fancybox.bind('[data-fancybox="potik-gallery"]', {
      theme: 'dark',
      Carousel: { Transition: 'fade' },
    });
  }
});