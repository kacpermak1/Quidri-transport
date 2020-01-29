$(function () {

    var owl = $('.owl-carousel');
    owl.owlCarousel({
        items: 1,
        loop: true,
        margin: 10,
        autoplay: true,
        autoplayTimeout: 8000,
        animateIn: 'fadeIn',
        animateOut: 'fadeOut',
        autoplayHoverPause: false,
        autoHeight: false,
        center: true,
        dots: false
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

    $('.text').slideDown(1000)

    $('.hamburger_icon').on('click', function () {
        $('.page-nav-list').toggleClass('toggle_menu');
    })

    const navList = $('.page-nav-list').children();

    for (let i = 0; i < navList.length; i++) {
        navList.on('click', function () {
            $('.page-nav-list').toggleClass('toggle_menu');
        })
    }


    //Typing Text

    const texts = ["Travel with others and get the best price!"];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";
    const placeForTypingText = document.querySelector('.typing');

    (function typing() {

        if (count === texts.length) {
            count = 0;
        }

        currentText = texts[count];
        letter = currentText.slice(0, ++index);
        placeForTypingText.textContent = letter;

        const timeoutId = setTimeout(typing, 130)

        if (letter.length === currentText.length) {
            letter = texts[0];
            clearTimeout(timeoutId)
            placeForTypingText.classList.remove("typing");
        }

    }());

})




