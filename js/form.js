$(function () {

    var url = "https://my-json-server.typicode.com/kacpermak1/quidri";

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
    const formSubmit = form.find('#submit');
    const formNumberOfSuitcases = form.find('#number_of_suitcases');
    const formPhoneNumber = form.find('#telephone');
    const price = "brak";

    form.slideDown();

    form.on('submit', function (e) {
        e.preventDefault();

        const errors = [];

        if (formName.val() === "") { errors.push("Podaj imię") } else if (formSurname.val() === "") { errors.push("Podaj Nazwisko") } else if (
            formPlaceFrom.val() === "") { errors.push("Podaj adres odbioru") } else if (formPlaceTo.val() === "") { errors.push("Podaj adres miejsca docelowego") } else if (
                formStartTime.val().length < 4 || formStartTime.val() === "") { errors.push("Podaj dokładną godzinę") } else if (formNumberOfPeople.val() <= 0) { errors.push("Podaj liczbę osób") } else if (
                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formEmail.val()) !== true || formEmail.val() === "") { errors.push("Podaj poprawny adres email") } else if (
                    formNumberOfSuitcases.val() < 0 || formNumberOfSuitcases.val() === "") { errors.push("Podaj poprawną liczbę walizek") } else if (formPhoneNumber.val().length < 0 || formPhoneNumber.val() === "") { errors.push("Podaj poprawny numer telefonu") } else if (formDate.val() === "") { errors.push("Podaj datę wyjazdu") } else {

                        addTrip(formName.val(), formSurname.val(), formDate.val(), formPlaceFrom.val(), formPlaceTo.val(), formStartTime.val(), formNumberOfPeople.val(), formEmail.val(), formAdditionalInfo.val(), formNumberOfSuitcases.val(), formPhoneNumber.val(), price);

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
        $.ajax({
            url: url + "/trips",
            method: "POST",
            dataType: "json",
            data: trips,
        }).done(function (resp) {
            console.log(resp);
        })
    }


})