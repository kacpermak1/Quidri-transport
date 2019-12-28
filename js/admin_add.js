$(function () {

    var url = "https://my-json-server.typicode.com/kacpermak1/Quidri-transport/tripsOnWebsite";

    const formWebsite = $('.form_add');
    const websitePlaceFrom = formWebsite.find('#website_place_from');
    const websitePlaceTo = formWebsite.find('#website_place_to');
    const websiteStartTime = formWebsite.find('#website_start_time');
    const websitePrice = formWebsite.find('#price');
    const websiteDate = formWebsite.find('#website_trip_date');
    const listOnWebsite = $('.list_on_website');

    loadTripsOnWebsite();

    function loadTripsOnWebsite() {
        $.ajax({
            url: url,
        }).done(function (resp) {
            console.log(resp);
            insertTripsOnWebsite(resp);
        }).fail(function (err) {
            console.error(err);
        });
    }

    listOnWebsite.on('click', '.remove_from_website', function () {
        const id = $(this).parent().data('id');
        removeTripFromWebsite(id);
    });

    function insertTripsOnWebsite(tripsOnWebsite) {
        listOnWebsite.empty();
        for (let i = 0; i < tripsOnWebsite.length; i++) {
            const tripOnWebsite = tripsOnWebsite[i];
            const html = $(`
            <div data-id="${tripOnWebsite.id}">
            <h2>${tripOnWebsite.placeTo}</h2>
            <h2>${tripOnWebsite.placeFrom}</h2>
            <h2>${tripOnWebsite.date}</h2>
            <h2>${tripOnWebsite.startTime}</h2>
            <h2>${tripOnWebsite.price}</h2>
            <button class="edit_info_website">Edytuj</button>
            <button class="remove_from_website">Usuń</button>
        </div>`);
            listOnWebsite.append(html);
        }
    }

    function removeTripFromWebsite(id) {
        $.ajax({
            url: url + '/' + id,
            method: 'DELETE',
        }).done(function (resp) {
            console.log(resp);
        }).fail(function (err) {
            console.error(err);
        }).always(function () {
            loadTripsOnWebsite();
        })
    }

    formWebsite.on('submit', function (e) {
        e.preventDefault();
        addTripOnWebsite(websitePlaceTo.val(), websitePlaceFrom.val(), websiteDate.val(), websiteStartTime.val(), websitePrice.val());
        websitePlaceTo.val('');
        websitePlaceFrom.val('');
        websiteDate.val('');
        websiteStartTime.val('');
        websitePrice.val('');
        alert('Dodano przejazd');
    })

    function addTripOnWebsite(placeTo, placeFrom, date, startTime, price) {
        const tripsOnWebsite = {
            date: date,
            placeFrom: placeFrom,
            placeTo: placeTo,
            startTime: startTime,
            price: price
        };
        $.ajax({
            url: url,
            method: "POST",
            dataType: "json",
            data: tripsOnWebsite,
        }).done(function (resp) {
            console.log(resp);
        }).always(function () {
            loadTripsOnWebsite();
        });
    }

    listOnWebsite.on('click', '.edit_info_website', function () {
        const btn = $(this)
        const li = btn.parent();
        const id = li.data('id');
        li.toggleClass('editable');
        if (li.hasClass('editable')) {
            // pierwsze klikniecie
            const toTrip = li.find('h2').eq(0);
            const fromTrip = li.find('h2').eq(1);
            const dateTrip = li.find('h2').eq(2);
            const timeTrip = li.find('h2').eq(3);
            const priceTrip = li.find('h2').eq(4);
            const fromVal = fromTrip.text();
            const toVal = toTrip.text();
            const dateVal = dateTrip.text();
            const timeVal = timeTrip.text();
            const priceVal = priceTrip.text();
            fromTrip.replaceWith(`<input class="from" value="${fromVal}" />`);
            toTrip.replaceWith(`<input class="to" value="${toVal}" />`);
            dateTrip.replaceWith(`<input class="date" value="${dateVal}" />`);
            timeTrip.replaceWith(`<input class="time" value="${timeVal}" />`);
            priceTrip.replaceWith(`<input class="price" value="${priceVal}" />`);
            btn.text('Gotowe');
            //console.log(titleVal, descVal);
        } else {
            // drugie klikniecie
            const inputFrom = li.find('.from');
            const inputTo = li.find('.to');
            const inputDate = li.find('.date');
            const inputTime = li.find('.time');
            const inputPrice = li.find('.price');
            const fromVal = inputFrom.val();
            const toVal = inputTo.val();
            const dateVal = inputDate.val();
            const timeVal = inputTime.val();
            const priceVal = inputPrice.val();
            inputFrom.replaceWith(`<h2>${fromVal}</h2>`);
            inputTo.replaceWith(`<h2>${toVal}</h2>`);
            inputDate.replaceWith(`<h2>${dateVal}</h2>`);
            inputTime.replaceWith(`<h2>${timeVal}</h2>`);
            inputPrice.replaceWith(`<h2>${priceVal}</h2>`);
            btn.text('Edytuj');

            updateTrip(id, dateVal, fromVal, toVal, timeVal, priceVal);
        }
    });

    function updateTrip(id,date,placeFrom,placeTo,startTime, price) {
        const tripsOnWebsite = {
            date: date,
            placeFrom: placeFrom,
            placeTo: placeTo,
            startTime: startTime,
            price: price
        };
        $.ajax({
            url: url +'/'+id,
            method: 'PUT',
            data: tripsOnWebsite,
        }).done(function(resp) {
            console.log(resp);
        }).fail(function(err) {
            console.error(err);
        });
    }
})