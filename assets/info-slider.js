document.addEventListener('DOMContentLoaded', function () {
    var swiper = new Swiper(".swiper-container", {
      slidesPerView: 3,
      spaceBetween: 70,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        992: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 2,  // Show 3 slides per view on tablets (width >= 768px)
          loop: true,
          autoplay: {
            delay: 2500,
            disableOnInteraction: false,
          },
        },
        0: {
          slidesPerView: 1,  // Show 2 slides per view on mobile (width >= 576px)
          loop: true,
          autoplay: {
            delay: 2500,
            disableOnInteraction: false,
          },
        }
      }
    });
  });