$(function () {

    const trips = $('.trips');
    const tripsInfo = $('.trip_info');

    tripsInfo.slideDown();

    getData();

    function getData() {

        firebase.database().ref('tripsOnWebsite').once('value', function (snapshot) {

            if (snapshot.val()) {
                const response = Object.values(snapshot.val());
                insertTripsOnWebsite(response);
            } else {
                trips.empty();
            }
        })
    };

    function insertTripsOnWebsite(tripsOnWebsite) {
        trips.empty();
        for (let i = 0; i < tripsOnWebsite.length; i++) {
            const tripOnWebsite = tripsOnWebsite[i];
            const html = $(`
<div class="trip_div form_inactive" data-id="${tripOnWebsite.tripId}">
        <h2 id="placeTo">${tripOnWebsite.placeTo}</h2>
        <h2 id="placeFrom">${tripOnWebsite.placeFrom}</h2>
        <h2>${tripOnWebsite.date}</h2>
        <h2>${tripOnWebsite.startTime}</h2>
        <h2>${tripOnWebsite.price}</h2>
</div>
    <form class="trip_finder_form" style="display:none" method="POST">
        <div>    
            <input type="text" name="name" placeholder="Your Name" class="name" />  
            <label>Name</label>          
            <input type="number" name="passangers_number" placeholder="Number Of Passengers" class="number_of_people" />
            <label>Number of Passengers</label>
            <input type="email" name="email" placeholder="Email" class="email" />    
            <label>Your email</label>    
        </div>
        <div>
            <input type="text" name="surname" placeholder="Your Surname" class="surname" />
            <label>Surname</label>
            <input type="number" name="baggage_number" placeholder="Number Of Bags" class="number_of_suitcases" />
            <label>Number of Bags</label>
            <input type="text" name="phone" placeholder="Your Phone Number" class="telephone" />
            <label>Phone Number</label>
        </div>
        <input type="submit" class="submit submit_form_button" value="JOIN" />
    </div>
</form>`);
            trips.append(html);
        }
    }

    trips.on('click', '.trip_div', function () {
        const exactDiv = $(this);

        exactDiv.next().slideToggle()

        if (exactDiv.hasClass('form_inactive')) {
            exactDiv.removeClass('form_inactive');
            exactDiv.addClass('form_active');
        } else {
            exactDiv.removeClass('form_active');
            exactDiv.addClass('form_inactive');
        }
    })

    // Joining the trip

    trips.on('submit', 'form', function (e) {
        e.preventDefault();
        const thisForm = $(this);

        const to = thisForm.prev().find('h2').eq(0).text();
        const from = thisForm.prev().find('h2').eq(1).text();
        const date = thisForm.prev().find('h2').eq(2).text();
        const time = thisForm.prev().find('h2').eq(3).text();
        const price = thisForm.prev().find('h2').eq(4).text();
        const tripId = thisForm.prev().data('id');
        const formAdditionalInfo = "Request to join the trip id: " + tripId;
        let formName = thisForm.find('.name');
        let formSurname = thisForm.find('.surname');
        let formNumberOfPeople = thisForm.find('.number_of_people');
        let formEmail = thisForm.find('.email');
        let formNumberOfSuitcases = thisForm.find('.number_of_suitcases');
        let formPhoneNumber = thisForm.find('.telephone');

        const errors = [];

        if (formName.val() === "") { errors.push("Please enter your name") } else if (formSurname.val() === "") { errors.push("Please enter your surname") } else if (formNumberOfPeople.val() <= 0) { errors.push("Please enter the number of passengers") } else if (
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formEmail.val() !== true) || formEmail.val() === "") { errors.push("Please enter correct email address") } else if (
            formNumberOfSuitcases.val() < 0 || formNumberOfSuitcases.val() === "") { errors.push("Please enter the number of bags") } else if (formPhoneNumber.val().length < 0 || formPhoneNumber.val() === "") { errors.push("Please enter your phone number") } else {

                addTrip(formName.val(), formSurname.val(), date, from, to, time, formNumberOfPeople.val(), formEmail.val(), formAdditionalInfo, formNumberOfSuitcases.val(), formPhoneNumber.val(), price);
                formName.val('');
                formSurname.val('');
                formNumberOfPeople.val('');
                formEmail.val('');
                formNumberOfSuitcases.val('');
                formPhoneNumber.val('');

                const modal = $('.modal_popup');
                modal.fadeIn(600);
            }

        if (errors.length > 0) { alert(errors) }
    })

    function addTrip(name, surname, date, placeFrom, placeTo, startTime, numOfPeople, email, addInfo, suitcases, phoneNumber, price) {
        const trips = {
            name: name,
            surname: surname,
            date: date,
            placeFrom: placeFrom,
            placeTo: placeTo,
            startTime: startTime,
            numOfPeople: numOfPeople,
            email: email,
            addInfo: addInfo,
            suitcases: suitcases,
            phoneNumber: phoneNumber,
            price: price
        };

        const newTrip = firebase.database().ref('trips');
        const newTripPush = newTrip.push();
        newTripPush.set(trips);

    }


    $('.hamburger_icon').on('click', function () {
        $('.page-nav-list').toggleClass('toggle_menu');
    })

    $('#filter_input').on('keyup', function () {
        filterTo();
        hideAllFormsOnKeyUp();
        changeColorOfDivIfFormOpen();
    })

    function filterTo() {
        let filterValue, input, divSection, tripDivs, i;

        input = $('#filter_input');
        filterValue = input.val().toUpperCase();
        divSection = $('.trips');
        tripDivs = divSection.find('div.trip_div');
        const eachDivValue = tripDivs.find('#placeTo');

        for (i = 0; i < eachDivValue.length; i++) {
            const a = eachDivValue[i];

            if (a.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
                eachDivValue[i].parentElement.style.display = "";
            } else {
                eachDivValue[i].parentElement.style.display = "none";
            }
        }
    }

    $('#filter_from_input').on('keyup', function () {
        filterFrom();
        hideAllFormsOnKeyUp();
        changeColorOfDivIfFormOpen();
    })

    function filterFrom() {
        let filterValue, input, divSection, tripDivs, i;

        input = $('#filter_from_input');
        filterValue = input.val().toUpperCase();
        divSection = $('.trips');
        tripDivs = divSection.find('div.trip_div');
        const eachDivValue = tripDivs.find('#placeFrom');

        for (i = 0; i < eachDivValue.length; i++) {
            const a = eachDivValue[i];

            if (a.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
                eachDivValue[i].parentElement.style.display = "";
            } else {
                eachDivValue[i].parentElement.style.display = "none";
            }
        }
    }

    function hideAllFormsOnKeyUp() {
        const trips = document.querySelector('.trips');
        const forms = trips.querySelectorAll('form');

        for (let i = 0; i < forms.length; i++) {
            forms[i].style.display = "none"
        }
    }

    function changeColorOfDivIfFormOpen() {
        const trips = $('.trips');
        const allDivs = trips.find('.trip_div');

        for (let i = 0; i < allDivs.length; i++) {
            if (allDivs.hasClass('form_active')) {
                allDivs.removeClass('form_active')
                allDivs.addClass('form_inactive')
            }
        }
    }
})