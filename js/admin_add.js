$(function () {

    const formWebsite = $('.form_add');
    const websitePlaceFrom = formWebsite.find('#website_place_from');
    const websitePlaceTo = formWebsite.find('#website_place_to');
    const websiteStartTime = formWebsite.find('#website_start_time');
    const websitePrice = formWebsite.find('#price');
    const websiteDate = formWebsite.find('#website_trip_date');
    const listOnWebsite = $('.list_on_website');

    loadTripsOnWebsite();

    function loadTripsOnWebsite(){

        firebase.database().ref('tripsOnWebsite').once('value', function (snapshot) {

            if (snapshot.val()) {
                const response = Object.values(snapshot.val());
                let id = Object.keys(snapshot.val());
                insertTripsOnWebsite(response, id);
            } else {
                listOnWebsite.empty();
            }
        })
    };

    listOnWebsite.on('click', '.remove_from_website', function () {
        const id = $(this).parent().data('id');
        removeTripFromWebsite(id);
    });

    function insertTripsOnWebsite(tripsOnWebsite, id) {
        listOnWebsite.empty();
        for (let i = 0; i < tripsOnWebsite.length; i++) {
            const tripOnWebsite = tripsOnWebsite[i];
            const html = $(`
            <div class="each_trip" data-id="${id[i]}">
            <h2 class="place_to">${tripOnWebsite.placeTo}</h2>
            <h2 class="place_from">${tripOnWebsite.placeFrom}</h2>
            <h2 class="date_value">${tripOnWebsite.date}</h2>
            <h2>${tripOnWebsite.startTime}</h2>
            <h2>${tripOnWebsite.price}</h2>
            <button class="edit_info_website">Edit</button>
            <button class="remove_from_website">Remove</button>
        </div>`);
            listOnWebsite.append(html);
        }
    }

    function removeTripFromWebsite(id) {
        firebase.database().ref('tripsOnWebsite').child(id).remove(function(){
            loadTripsOnWebsite();
        });
    }

    formWebsite.on('submit', function (e) {
        e.preventDefault();
        addTripOnWebsite(websitePlaceTo.val(), websitePlaceFrom.val(), websiteDate.val().split('-').reverse().join('-'), websiteStartTime.val(), websitePrice.val());
        websitePlaceTo.val('');
        websitePlaceFrom.val('');
        websiteDate.val('');
        websiteStartTime.val('');
        websitePrice.val('');
        alert('Added successfully');
    })

    function addTripOnWebsite(placeTo, placeFrom, date, startTime, price) {
        const tripsOnWebsite = {
            date: date,
            placeFrom: placeFrom,
            placeTo: placeTo,
            startTime: startTime,
            price: price
        };
        const newTrip = firebase.database().ref('tripsOnWebsite');
        const newTripPush = newTrip.push();
        newTripPush.set(tripsOnWebsite)
            loadTripsOnWebsite();
        }
    

    listOnWebsite.on('click', '.edit_info_website', function () {
        const btn = $(this)
        const li = btn.parent();
        const id = li.data('id');
        li.toggleClass('editable');
        if (li.hasClass('editable')) {
            // first click
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
            btn.text('Confirm');
        } else {
            // second click
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
            btn.text('Edit');

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

        firebase.database().ref('tripsOnWebsite').child(id).set(tripsOnWebsite)};

        $('.hamburger_icon').on('click',function(){
            $('.page-nav-list').toggleClass('toggle_menu');
        })

        $('#filter_from_input').on('keyup',function(){
            filterByPlaceFrom();
        })
        $('#filter_to_input').on('keyup',function(){
            filterByPlaceTo();
        })
        $('#filter_by_date').on('keyup',function(){
            filterByDate();
        })

        function filterByPlaceFrom() {
            let filterValue, input, divSection, tripDivs, i;
    
            input = $('#filter_from_input');
            filterValue = input.val().toUpperCase();
            divSection = $('.list_on_website');
            tripDivs = divSection.find('.each_trip');
            const eachDivValue = tripDivs.find('.place_from');
    
            for (i = 0; i < eachDivValue.length; i++) {
                const a = eachDivValue[i];
    
                if (a.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
                    eachDivValue[i].parentElement.style.display = "";
                } else {
                    eachDivValue[i].parentElement.style.display = "none";
                }
            }
        }

        function filterByPlaceTo() {
            let filterValue, input, divSection, tripDivs, i;
    
            input = $('#filter_to_input');
            filterValue = input.val().toUpperCase();
            divSection = $('.list_on_website');
            tripDivs = divSection.find('.each_trip');
            const eachDivValue = tripDivs.find('.place_to');
    
            for (i = 0; i < eachDivValue.length; i++) {
                const a = eachDivValue[i];
    
                if (a.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
                    eachDivValue[i].parentElement.style.display = "";
                } else {
                    eachDivValue[i].parentElement.style.display = "none";
                }
            }
        }

        function filterByDate() {
            let filterValue, input, divSection, tripDivs, i;
    
            input = $('#filter_by_date');
            filterValue = input.val().toUpperCase();
            divSection = $('.list_on_website');
            tripDivs = divSection.find('.each_trip');
            const eachDivValue = tripDivs.find('.date_value');
    
            for (i = 0; i < eachDivValue.length; i++) {
                const a = eachDivValue[i];
    
                if (a.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
                    eachDivValue[i].parentElement.style.display = "";
                } else {
                    eachDivValue[i].parentElement.style.display = "none";
                }
            }
        }

})