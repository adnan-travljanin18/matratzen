document.addEventListener('DOMContentLoaded', function () {
  var swiper = new Swiper(".swiper-container-info", {
    slidesPerView: 3,
    spaceBetween: 20,
    autoplay: {
      delay: 2000, // Adjust the delay as needed
    },
    breakpoints: {
      992: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 20,
      }
    },
    touchEventsTarget: 'container',
    touchEvents: true,
    on: {
      init: function () {
        this.touchEventsData.allowTouchCallbacks = true;
      },
      touchStart: function () {
        this.touchEventsData.allowTouchCallbacks = true;
      },
    },
  });
});