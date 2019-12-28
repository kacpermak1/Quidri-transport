$(function () {

    var url = "https://my-json-server.typicode.com/kacpermak1/quidri/trips";
    var urlOnWebsite = "https://my-json-server.typicode.com/kacpermak1/quidri/tripsOnWebsite";
    const tripsList = $('.trips_list');

    loadTrips();

    function loadTrips() {
        $.ajax({
            url: url,
        }).done(function (resp) {
            console.log(resp);
            insertTrips(resp);
        }).fail(function (err) {
            console.error(err);
        });
    }

    tripsList.on('click', '.admin_delete_button', function () {
        const id = $(this).parent().data('id');
        const ask = prompt(`Czy na pewno chcesz usunąć rezerwację numer: ${id} z bazy danych? Wprowadź "tak" lub "nie"`);
        if (ask === "tak") { removeTrip(id) } else { alert('Nie usunięto rezerwacji') }

    });

    tripsList.on('click', '.admin_add_button', function () {
        const idTrip = $(this).parent().data('id');
        const tripFrom = $(this).parent().find('h2').eq(0).find('span').text();
        const tripTo = $(this).parent().find('h2').eq(1).find('span').text();
        const dateToWebsite = $(this).parent().find('h2').eq(2).find('span').text();
        const tripStartToWebsite = $(this).parent().find('h2').eq(3).find('span').text();
        const tripPrice = prompt('Podaj cenę przejazdu');

        if (tripPrice === "" || tripPrice === null) { alert('musisz podać cenę') } else {

            addTripOnWebsite(tripTo, tripFrom, dateToWebsite, tripStartToWebsite, tripPrice);

            alert(`Przejazd numer: ${idTrip} z ${tripFrom} do ${tripTo} został dodany na stronę internetową`)
        };

    });

    function insertTrips(trips) {
        tripsList.empty();
        for (let i = 0; i < trips.length; i++) {
            const trip = trips[i];
            const html = $(`
            <div data-id="${trip.id}">
            <h1>Rezerwacja nr.: <span>${trip.id}</span></h1>
            <h2>Wyjazd z: <span>${trip.placeFrom}</span></h2>
            <h2>Do: <span>${trip.placeTo}</span></h2>
            <h2>Data wyjazdu: <span>${trip.date}</span></h2>
            <h2>Godzina Wyjazdu: <span>${trip.startTime}</span></h2>
            <h2>Imię Nazwisko: <span class="name">${trip.name}</span> <span class="surname">${trip.surname}</span></h2>
            <h2>Liczba osób: <span>${trip.numOfPeople}</span></h2>
            <h2>Liczba walizek: <span>${trip.suitcases}</span></h2>
            <h2>email: <span>${trip.email}</span></h2>
            <h2>Numer telefonu: <span>${trip.phoneNumber}</span></h2>
            <p>Dodatkowe informacje: <span>${trip.addInfo}</span></p>
            <button class="admin_add_button">Dodaj na stronę</button>
            <button class="admin_edit_button">Edytuj</button>
            <button class="admin_delete_button">Usuń z bazy danych</button>
            <h2>Cena Promocyjna: <span>${trip.price}</span></h2>
        </div>
            `);
            tripsList.append(html);
        }
    }

    function removeTrip(id) {
        $.ajax({
            url: url + '/' + id,
            method: 'DELETE',
        }).done(function (resp) {
            console.log(resp);
        }).fail(function (err) {
            console.error(err);
        }).always(function () {
            loadTrips();
        })
    }

    function addTripOnWebsite(placeTo, placeFrom, date, startTime, price) {
        const tripsOnWebsite = {
            date: date,
            placeFrom: placeFrom,
            placeTo: placeTo,
            startTime: startTime,
            price: price
        };
        $.ajax({
            url: urlOnWebsite,
            method: "POST",
            dataType: "json",
            data: tripsOnWebsite,
        }).done(function (resp) {
            console.log(resp);
        }).always(function () {
            loadTrips();
        });
    }

    tripsList.on('click', '.admin_edit_button', function () {
        const btn = $(this)
        const li = btn.parent();
        const id = li.data('id');
        li.toggleClass('editable');
        if (li.hasClass('editable')) {
            // pierwsze klikniecie

            const addInfo = li.find('p').find('span');
            const addInfoVal = addInfo.text();
            addInfo.replaceWith(`<input class="info_edit" value="${addInfoVal}" />`);
            btn.text('Zatwierdź');
        } else {
            // drugie klikniecie

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
        $.ajax({
            url: url + '/' + id,
            method: 'PUT',
            data: trips,
        }).done(function (resp) {
            console.log(resp);
        }).fail(function (err) {
            console.error(err);
        });
    }

})