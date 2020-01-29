$(function () {

    const tripsList = $('.trips_list');

    loadTrips();

    tripsList.on('click', '.admin_delete_button', function () {
        const id = $(this).parent().data('id');
        const ask = prompt(`Czy na pewno chcesz usunąć rezerwację numer: ${id} z bazy danych? Wprowadź "tak" lub "nie"`);
        if (ask === "tak") { removeTrip(id) } else { alert('Nie usunięto rezerwacji') }

    });

    function removeTrip(id) {

        firebase.database().ref('trips').child(id).remove(function () {
            loadTrips();
        });

    }

    function loadTrips() {

        firebase.database().ref('trips').once('value', function (snapshot) {

            if (snapshot.val()) {

                const response = Object.values(snapshot.val());
                let id = Object.keys(snapshot.val());
                let bookingNo = id.map(function (e) { return e.substring(1, 7) })

                insertTrips(response, bookingNo, id);
            } else {
                alert('NO DATA');
                tripsList.empty();
                ;
            }
        });
    }

    tripsList.on('click', '.admin_add_button', function () {
        const idTrip = $(this).parent().data('id');
        const tripFrom = $(this).parent().find('h2').eq(0).find('span').text();
        const tripTo = $(this).parent().find('h2').eq(1).find('span').text();
        const dateToWebsite = $(this).parent().find('h2').eq(2).find('span').text();
        const tripStartToWebsite = $(this).parent().find('h2').eq(3).find('span').text();
        const tripPrice = prompt('Podaj cenę przejazdu');
        const tripIdShort = $(this).parent().find('.id_span').text();

        if (tripPrice === "" || tripPrice === null) { alert('musisz podać cenę') } else {

            addTripOnWebsite(tripTo, tripFrom, dateToWebsite, tripStartToWebsite, tripPrice, tripIdShort);

            alert(`Przejazd numer: ${idTrip} z ${tripFrom} do ${tripTo} został dodany na stronę internetową`)
        };

    });

    function insertTrips(trips, bookingNo, id) {
        tripsList.empty();
        for (let i = 0; i < trips.length; i++) {
            const trip = trips[i];
            const html = $(`
            <div data-id="${id[i]}">
            <h1>Booking ID: <span class="id_span">${bookingNo[i].toUpperCase()}</span></h1>
            <h2>Wyjazd z: <span class="place_from">${trip.placeFrom}</span></h2>
            <h2>Do: <span class="place_to">${trip.placeTo}</span></h2>
            <h2>Data wyjazdu: <span class="date_span">${trip.date}</span></h2>
            <h2>Godzina Wyjazdu: <span>${trip.startTime}</span></h2>
            <h2>Imię Nazwisko: <span class="surname">${trip.surname}</span><span class="name">${trip.name}</span></h2>
            <h2>Liczba osób: <span>${trip.numOfPeople}</span></h2>
            <h2>Liczba walizek: <span>${trip.suitcases}</span></h2>
            <h2>email: <span class="email_span">${trip.email}</span></h2>
            <h2>Numer telefonu: <span>${trip.phoneNumber}</span></h2>
            <p>Dodatkowe informacje: <span class="add_info_span">${trip.addInfo}</span></p>
            <button class="admin_add_button">Dodaj na stronę</button>
            <button class="admin_edit_button">Edytuj</button>
            <button class="admin_delete_button">Usuń z bazy danych</button>
            <h2>Cena Promocyjna: <span>${trip.price}</span></h2>
        </div>
            `);
            tripsList.append(html);
        }
    }

    function addTripOnWebsite(placeTo, placeFrom, date, startTime, price, tripIdShort) {
        const tripsOnWebsite = {
            date: date,
            placeFrom: placeFrom,
            placeTo: placeTo,
            startTime: startTime,
            price: price,
            tripId: tripIdShort
        };

        const newTrip = firebase.database().ref('tripsOnWebsite');
        const newTripPush = newTrip.push();
        newTripPush.set(tripsOnWebsite);
    }

    tripsList.on('click', '.admin_edit_button', function () {
        const btn = $(this)
        const li = btn.parent();
        const id = li.data('id');
        li.toggleClass('editable');
        if (li.hasClass('editable')) {
            // first click

            const addInfo = li.find('p').find('span');
            const addInfoVal = addInfo.text();
            addInfo.replaceWith(`<input class="info_edit" value="${addInfoVal}" />`);
            btn.text('Zatwierdź');
        } else {
            // second click

            const tripFrom = $(this).parent().find('h2').eq(0).find('span').text();
            const tripTo = $(this).parent().find('h2').eq(1).find('span').text();
            const date = $(this).parent().find('h2').eq(2).find('span').text();
            const tripStart = $(this).parent().find('h2').eq(3).find('span').text();
            const name = $(this).parent().find('h2').eq(4).find('.name').text();
            const surname = $(this).parent().find('h2').eq(4).find('.surname').text();
            const peopleNo = $(this).parent().find('h2').eq(5).find('span').text();
            const suitcasesNo = $(this).parent().find('h2').eq(6).find('span').text();
            const email = $(this).parent().find('h2').eq(7).find('span').text();
            const mobile = $(this).parent().find('h2').eq(8).find('span').text();
            const price = $(this).parent().find('h2').eq(9).find('span').text();

            const inputInfo = li.find('.info_edit');
            const infoVal = inputInfo.val();
            inputInfo.replaceWith(`<span>${infoVal}</span>`);
            btn.text('Edytuj');

            updateInfo(id, name, surname, date, tripFrom, tripTo, tripStart, peopleNo, email, infoVal, suitcasesNo, mobile, price);
        }
    });

    function updateInfo(id, name, surname, date, placeFrom, placeTo, startTime, numOfPeople, email, addInfo, suitcases, phoneNumber, price) {
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

        firebase.database().ref('trips').child(id).set(trips)
    };

    $('.hamburger_icon').on('click', function () {
        $('.page-nav-list').toggleClass('toggle_menu');
    })

    $('#filter_from_input').on('keyup', function () {
        filterByPlaceFrom();
    })

    $('#filter_to_input').on('keyup', function () {
        filterByPlaceTo();
    })

    $('#filter_by_date').on('keyup', function () {
        filterByDate();
    })
    $('#filter_by_id').on('keyup', function () {
        filterById();
    })
    $('#filter_by_surname').on('keyup', function () {
        filterBySurname();
    })
    $('#filter_by_email').on('keyup', function () {
        filterByEmail();
    })

    function filterByPlaceFrom() {
        let filterValue, input, divSection, tripDivs, i;

        input = $('#filter_from_input');
        filterValue = input.val().toUpperCase();
        divSection = $('.trips_list');
        tripDivs = divSection.find('div');
        const eachDivValue = tripDivs.find('.place_from');

        for (i = 0; i < eachDivValue.length; i++) {
            const a = eachDivValue[i];

            if (a.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
                eachDivValue[i].parentElement.parentElement.style.display = "";
            } else {
                eachDivValue[i].parentElement.parentElement.style.display = "none";
            }
        }
    }

    function filterByPlaceTo() {
        let filterValue, input, divSection, tripDivs, i;

        input = $('#filter_to_input');
        filterValue = input.val().toUpperCase();
        divSection = $('.trips_list');
        tripDivs = divSection.find('div');
        const eachDivValue = tripDivs.find('.place_to');

        for (i = 0; i < eachDivValue.length; i++) {
            const a = eachDivValue[i];

            if (a.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
                eachDivValue[i].parentElement.parentElement.style.display = "";
            } else {
                eachDivValue[i].parentElement.parentElement.style.display = "none";
            }
        }
    }

    function filterByDate() {
        let filterValue, input, divSection, tripDivs, i;

        input = $('#filter_by_date');
        filterValue = input.val().toUpperCase();
        divSection = $('.trips_list');
        tripDivs = divSection.find('div');
        const eachDivValue = tripDivs.find('.date_span');

        for (i = 0; i < eachDivValue.length; i++) {
            const a = eachDivValue[i];

            if (a.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
                eachDivValue[i].parentElement.parentElement.style.display = "";
            } else {
                eachDivValue[i].parentElement.parentElement.style.display = "none";
            }
        }
    }

    function filterById() {
        let filterValue, input, divSection, tripDivs, i;

        input = $('#filter_by_id');
        filterValue = input.val().toUpperCase();
        divSection = $('.trips_list');
        tripDivs = divSection.find('div');
        const eachDivValue = tripDivs.find('.id_span');

        for (i = 0; i < eachDivValue.length; i++) {
            const a = eachDivValue[i];

            if (a.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
                eachDivValue[i].parentElement.parentElement.style.display = "";
            } else {
                eachDivValue[i].parentElement.parentElement.style.display = "none";
            }
        }
    }

    function filterBySurname() {
        let filterValue, input, divSection, tripDivs, i;

        input = $('#filter_by_surname');
        filterValue = input.val().toUpperCase();
        divSection = $('.trips_list');
        tripDivs = divSection.find('div');
        const eachDivValue = tripDivs.find('.surname');

        for (i = 0; i < eachDivValue.length; i++) {
            const a = eachDivValue[i];

            if (a.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
                eachDivValue[i].parentElement.parentElement.style.display = "";
            } else {
                eachDivValue[i].parentElement.parentElement.style.display = "none";
            }
        }
    }

    function filterByEmail() {
        let filterValue, input, divSection, tripDivs, i;

        input = $('#filter_by_email');
        filterValue = input.val().toUpperCase();
        divSection = $('.trips_list');
        tripDivs = divSection.find('div');
        const eachDivValue = tripDivs.find('.email_span');

        for (i = 0; i < eachDivValue.length; i++) {
            const a = eachDivValue[i];

            if (a.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
                eachDivValue[i].parentElement.parentElement.style.display = "";
            } else {
                eachDivValue[i].parentElement.parentElement.style.display = "none";
            }
        }
    }

})