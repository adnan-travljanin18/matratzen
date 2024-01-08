var swiper = new Swiper(".testimonial-slider", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 4500,
        disableOnInteraction: false,
    },
    loop: true,
    speed: 1500,
    effect: 'fade', // Add fade effect
    fadeEffect: {
        crossFade: true // Enable crossFade transition
    },
});