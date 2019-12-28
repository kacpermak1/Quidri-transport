$(function () {

    const trips = $('.trips');
    const tripsInfo = $('.trip_info');

    var url = "https://my-json-server.typicode.com/kacpermak1/Quidri-transport/tripsOnWebsite";
    var urlo = "https://my-json-server.typicode.com/kacpermak1/Quidri-transport";
    const form = $('form')

   tripsInfo.slideDown();

    loadTripsOnWebsite();

    function loadTripsOnWebsite() {
        $.ajax({
            url: url,
        }).done(function (resp) {
            insertTripsOnWebsite(resp);
        }).fail(function (err) {
        });
    }

    function insertTripsOnWebsite(tripsOnWebsite) {
        trips.empty();
        for (let i = 0; i < tripsOnWebsite.length; i++) {
            const tripOnWebsite = tripsOnWebsite[i];
            const html = $(`
<div class="trip_div" data-id="${tripOnWebsite.id}">
        <h2>${tripOnWebsite.placeTo}</h2>
        <h2>${tripOnWebsite.placeFrom}</h2>
        <h2>${tripOnWebsite.date}</h2>
        <h2>${tripOnWebsite.startTime}</h2>
        <h2>${tripOnWebsite.price}</h2>
</div>
    <form class="trip_finder_form" style="display:none" method="POST">
        <div>    
            <label>Imię</label>
            <input type="text" name="name" placeholder="Podaj imię" id="name" />            
            <label>Liczba Osób</label>
            <input type="number" name="passangers_number" placeholder="Podaj liczbę osób" id="number_of_people" />
            <label>Email</label>
            <input type="email" name="email" placeholder="Podaj email" id="email" />        
        </div>
        <div>
            <label>Nazwisko</label>
            <input type="text" name="surname" placeholder="Podaj nazwisko" id="surname" />
            <label>Ilość Bagażu</label>
            <input type="number" name="baggage_number" placeholder="Podaj liczbę walizek" id="number_of_suitcases" />
            <label>Telefon</label>
            <input type="text" name="phone" placeholder="Podaj numer kontaktowy" id="telephone" />
        </div>
        <input type="submit" class="submit" value="Dołącz" id="submit_form">
    </div>
</form>`);
            trips.append(html);
        }
    }

    trips.on('click', '.trip_div', function () {
        const exactDiv = $(this);
        
        exactDiv.next().slideToggle()
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
        const formAdditionalInfo = "Prośba o dołączenie!";
        let formName = thisForm.find('#name');
        let formSurname = thisForm.find('#surname');
        let formNumberOfPeople = thisForm.find('#number_of_people');
        let formEmail = thisForm.find('#email');
        let formNumberOfSuitcases = thisForm.find('#number_of_suitcases');
        let formPhoneNumber = thisForm.find('#telephone');

        const errors = [];

        if (formName.val() === "") { errors.push("Podaj imię") } else if (formSurname.val() === "") { errors.push("Podaj Nazwisko") } else if (formNumberOfPeople.val() <= 0) { errors.push("Podaj liczbę osób") } else if (
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formEmail.val() !== true) || formEmail.val() === "") { errors.push("Podaj poprawny adres email") } else if (
            formNumberOfSuitcases.val() < 0 || formNumberOfSuitcases.val() === "") { errors.push("Podaj poprawną liczbę walizek") } else if (formPhoneNumber.val().length < 0 || formPhoneNumber.val() === "") { errors.push("Podaj poprawny numer telefonu") } else {

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
        $.ajax({
            url: urlo + "/trips",
            method: "POST",
            dataType: "json",
            data: trips,
        }).done(function (resp) {
            console.log(resp);
        })
    }
})