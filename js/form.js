$(function () {

    const form = $('form')

    const formName = form.find('#name');
    const formSurname = form.find('#surname');
    const formDate = form.find('#trip_date');
    const formPlaceFrom = form.find('#place_from');
    const formPlaceTo = form.find('#place_to');
    const formStartTime = form.find('#start_time');
    const formNumberOfPeople = form.find('#number_of_people');
    const formEmail = form.find('#email');
    const formAdditionalInfo = form.find('#add_info');
    const formNumberOfSuitcases = form.find('#number_of_suitcases');
    const formPhoneNumber = form.find('#telephone');
    const price = "brak";

    form.on('submit', function (e) {
        e.preventDefault();

        const errors = [];

        if (formName.val() === "") { errors.push("Please enter your name") } else if (formSurname.val() === "") { errors.push("Please enter your surname") } else if (
            formPlaceFrom.val() === "") { errors.push("Please enter your pick up address") } else if (formPlaceTo.val() === "") { errors.push("Please enter your destination address") } else if (
                formStartTime.val().length < 4 || formStartTime.val() === "") { errors.push("Please enter your pick up time. E.g. 10:30") } else if (formNumberOfPeople.val() <= 0) { errors.push("Please enter the number of passengers") } else if (
                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formEmail.val()) !== true || formEmail.val() === "") { errors.push("Please enter your email address") } else if (
                    formNumberOfSuitcases.val() < 0 || formNumberOfSuitcases.val() === "") { errors.push("Please enter the number of bags") } else if (formPhoneNumber.val().length < 0 || formPhoneNumber.val() === "") { errors.push("Please enter your phone number") } else if (formDate.val() === "") { errors.push("Please enter the pick up date") } else {

                        addTrip(formName.val(), formSurname.val(), formDate.val().split('-').reverse().join('-'), formPlaceFrom.val(), formPlaceTo.val(), formStartTime.val(), formNumberOfPeople.val(), formEmail.val(), formAdditionalInfo.val(), formNumberOfSuitcases.val(), formPhoneNumber.val(), price);

                        formName.val('');
                        formSurname.val('');
                        formDate.val('');
                        formPlaceFrom.val('');
                        formPlaceTo.val('');
                        formStartTime.val('');
                        formNumberOfPeople.val('');
                        formEmail.val('');
                        formAdditionalInfo.val('');
                        formNumberOfSuitcases.val('');
                        formPhoneNumber.val('')

                        const modal = $('.modal_popup');
                        modal.fadeIn(600);
                    }

        if (errors.length > 0) { alert(errors) }
    });

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
        newTripPush.set(trips)}



        $('.hamburger_icon').on('click',function(){
            $('.page-nav-list').toggleClass('toggle_menu');
        })

        
})