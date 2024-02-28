var swiperScript = document.createElement('script');
swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js';
swiperScript.defer = true;

swiperScript.onload = function () {
  // Swiper script has loaded successfully, you can now initialize Swiper
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
};

swiperScript.onerror = function () {
  // Handle the error, perhaps by falling back to a local copy or showing an error message
  console.error('Failed to load Swiper script.');
};

// document.addEventListener('DOMContentLoaded', function () {
//   console.log('DOMContentLoaded event fired');
  
// });