$(function () {

    var owl = $('.owl-carousel');
    owl.owlCarousel({
        items: 1,
        loop: true,
        margin: 10,
        autoplay: true,
        autoplayTimeout: 8000,
        autoplayHoverPause: true,
        animateIn: 'fadeIn',
        animateOut: 'fadeOut',
        autoplayHoverPause: false,
        autoHeight: true,
        center: true,
    });

    //Cars

    $(document).ready(function () {
        $('.fleet .cars').slick({
            autoplay: 3000,
            infinite: true,
            arrows: false,
            dots: false,
        });
    });

    const carOne = $('.car_one');
    const carTwo = $('.car_two');
    const carThree = $('.car_three');

    const audi = $('#audi');
    const peugeot = $('#partner');
    const renault = $('#traffic');

    carOne.on('mouseenter', function () {
        audi.addClass("info")
    })

    carOne.on('mouseleave', function () {
        audi.removeClass("info");
        audi.addClass("hidden");
    })

    carTwo.on('mouseenter', function () {
        peugeot.addClass("info")
    })

    carTwo.on('mouseleave', function () {
        peugeot.removeClass("info");
        peugeot.addClass("hidden");
    })

    carThree.on('mouseenter', function () {
        renault.addClass("info")
    })

    carThree.on('mouseleave', function () {
        renault.removeClass("info");
        renault.addClass("hidden");
    })

    $('.text').slideDown(2000)

})




