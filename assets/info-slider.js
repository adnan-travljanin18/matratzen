document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded event fired');
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
    }
  });
});