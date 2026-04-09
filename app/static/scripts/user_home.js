$(document).ready(function() {
    var currentUsername = "{{ current_user.username }}";
    $('body').data('currentUsername', currentUsername);
});

var isReverse = false;

var carImages = {
// Super 3D car icons (local PNGs)
'ViteGo': '/static/images/uberx_3d.png',
'ViteGo XL': '/static/images/vitego_xl_3d.png',
};

var activeDirectionsDisplay = null;
var activeDirectionsDisplayOutline = null;
var activeTransitStopMarkers = [];
var activeTransitPolylines = [];

function clearActiveRoute() {
    if (activeTransitStopMarkers && activeTransitStopMarkers.length) {
        activeTransitStopMarkers.forEach(function (m) { m.setMap(null); });
        activeTransitStopMarkers = [];
    }
    if (activeTransitPolylines && activeTransitPolylines.length) {
        activeTransitPolylines.forEach(function (p) { p.setMap(null); });
        activeTransitPolylines = [];
    }
    if (activeDirectionsDisplayOutline) {
        activeDirectionsDisplayOutline.setMap(null);
        activeDirectionsDisplayOutline.setDirections({ routes: [] });
    }
    if (activeDirectionsDisplay) {
        activeDirectionsDisplay.setMap(null);
        activeDirectionsDisplay.setDirections({ routes: [] });
    }
}

function addTransitStopMarkers(directionsResult) {
    try {
        var route = directionsResult.routes && directionsResult.routes[0];
        var leg = route && route.legs && route.legs[0];
        var steps = (leg && leg.steps) || [];

        steps.forEach(function (step) {
            if (!step || step.travel_mode !== 'TRANSIT' || !step.transit) return;
            var dep = step.transit.departure_stop;
            var arr = step.transit.arrival_stop;

            [dep, arr].forEach(function (stop) {
                if (!stop || !stop.location) return;
                var marker = new google.maps.Marker({
                    map: map,
                    position: stop.location,
                    title: stop.name || 'Transit stop',
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 7,
                        fillColor: '#7c3aed',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2
                    }
                });
                activeTransitStopMarkers.push(marker);
            });
        });
    } catch (e) {
        // ignore; route still shows
    }
}

function drawTransitFullPath(directionsResult) {
    try {
        if (activeTransitPolylines && activeTransitPolylines.length) {
            activeTransitPolylines.forEach(function (p) { p.setMap(null); });
            activeTransitPolylines = [];
        }

        var route = directionsResult.routes && directionsResult.routes[0];
        var leg = route && route.legs && route.legs[0];
        var steps = (leg && leg.steps) || [];

        if (!steps.length || !steps.some(function (s) { return s && s.path && s.path.length; })) {
            if (route && route.overview_path && route.overview_path.length) {
                activeTransitPolylines.push(new google.maps.Polyline({
                    map: map,
                    path: route.overview_path,
                    strokeColor: '#7c3aed',
                    strokeOpacity: 0.95,
                    strokeWeight: 7
                }));
            }
            return;
        }

        steps.forEach(function (step) {
            if (!step || !step.path || !step.path.length) return;
            var mode = (step.travel_mode || '').toUpperCase();

            if (mode === 'WALKING') {
                activeTransitPolylines.push(new google.maps.Polyline({
                    map: map,
                    path: step.path,
                    strokeOpacity: 0,
                    icons: [{
                        icon: {
                            path: 'M 0,-1 0,1',
                            strokeOpacity: 1,
                            strokeColor: '#2563eb',
                            strokeWeight: 4
                        },
                        offset: '0',
                        repeat: '14px'
                    }]
                }));
            } else if (mode === 'TRANSIT') {
                activeTransitPolylines.push(new google.maps.Polyline({
                    map: map,
                    path: step.path,
                    strokeColor: '#7c3aed',
                    strokeOpacity: 0.95,
                    strokeWeight: 7
                }));
            } else {
                activeTransitPolylines.push(new google.maps.Polyline({
                    map: map,
                    path: step.path,
                    strokeColor: '#7c3aed',
                    strokeOpacity: 0.75,
                    strokeWeight: 6
                }));
            }
        });
    } catch (e) {
        // ignore
    }
}

function toggleDateTimePicker() {
$('#datetimepicker').toggle();
setDefaultTime();
}

function setDefaultTime() {
var defaultPickupTime;

if (isReverse) {
    defaultPickupTime = moment().add(30, 'minutes');
} else {
    defaultPickupTime = moment().add(Math.floor(Math.random() * (5 - 2 + 1)) + 2, 'minutes');
}

$('#selected_datetime').val(defaultPickupTime.format('YYYY-MM-DD HH:mm'));
$('#car_list').addClass('hide');
}

function generateRandomPickupTime() {
return moment().add(Math.floor(Math.random() * (5 - 2 + 1)) + 2, 'minutes').format('YYYY-MM-DD HH:mm');
}

function calculateTripCost(estimatedDistance) {
estimatedDistance = parseFloat(estimatedDistance);

if (isNaN(estimatedDistance) || estimatedDistance === null) {
    console.error("Invalid input for calculateTripCost:", estimatedDistance);
    return 'N/A'; 
}

console.log("Input distance for calculateTripCost:", estimatedDistance);

var costPerKilometer = 1.5;
var totalCost = estimatedDistance * costPerKilometer;

return totalCost.toFixed(2);
}

function displayCarList(carsList, estimatedDuration, estimatedDistance) {
var cars = '';

carsList.forEach(function (car) {
    var carImage = carImages[car.name] || 'path/to/default_image.jpg';

    var arrivalTime = moment(car.pickupTime, 'YYYY-MM-DD HH:mm').add(estimatedDuration, 'minutes').format('YYYY-MM-DD HH:mm');

    var tripCost = calculateTripCost(parseFloat(estimatedDistance));

    cars += '<div class="list-group-item car-item" onclick="selectCar(\'' + car.name + '\', \'' + car.pickupTime + '\', \'' + arrivalTime + '\', ' + tripCost + ')">' +
        '<div class="car-image-container">' +
        '<img src="' + carImage + '" alt="' + car.name + '" class="car-image">' +
        '</div>' +
        '<div class="car-details">' +
        '<h4>' + car.name + '</h4>' +
        '<p class="pickup-info">🕐 Pickup at ' + car.pickupTime + '</p>' +
        '<p class="arrival-info">📍 Arrive by ' + arrivalTime + '</p>' +
        '<p class="cost-info">$' + tripCost + '<span style="font-size: 0.9rem; font-weight: 650; color: rgba(87,83,78,0.9); margin-left: 0.35rem;">est.</span></p>' +
        '</div></div>';

    sessionStorage.setItem('trip_cost', tripCost);
});

// Display the list of cars
$('#car_list').html(cars);
$('#car_list').removeClass('hide').show();
}

function showNonDrivingSummary(distanceText, durationMinutes) {
    $('#ride_request').addClass('hide').hide();
    $('#selected_car').empty();
    sessionStorage.removeItem('trip_cost');
    $('#car_list').addClass('hide').hide().empty();
    // Legacy page: show summary in #result instead of alerts
    if ($('#result').length) {
        $('#result').html('🗺️ Distance: ' + distanceText + ' • Time: ~' + durationMinutes + ' min');
    }
}

function selectCar(carName, pickupTime, arrivalTime, tripCost) {
var carImage = carImages[carName] || 'path/to/default_image.jpg';

var selectedCarHtml = '<div class="list-group-item selected-car-item">' +
    '<div class="car-image-container">' +
    '<img src="' + carImage + '" alt="' + carName + '" class="car-image">' +
    '</div>' +
    '<div class="car-details">' +
    '<h4>' + carName + '</h4>' +
    '<p class="pickup-info">🕐 Pickup at ' + pickupTime + '</p>' +
    '<p class="arrival-info">📍 Arrive by ' + (arrivalTime || 'N/A') + '</p>' +
    '<p class="cost-info">$' + tripCost + '<span style="font-size: 0.9rem; font-weight: 650; color: rgba(87,83,78,0.9); margin-left: 0.35rem;">est.</span></p>' +
    '</div>' +
    '</div>';

$('#selected_car').html(selectedCarHtml);
$('#ride_request').removeClass('hide');
$('#ride_request').show();
sessionStorage.setItem('trip_cost', tripCost);
}

function requestRide() {
var originAddress = $('#from_places').val();
var destinationAddress = $('#to_places').val();

getCoordinatesFromAddress(originAddress, function (originCoordinates) {
    if (!originCoordinates) {
        showToast("Location Error", "Error getting coordinates for the origin address. Please try again.", "error");
        return;
    }

    var currentUsername = '{{ current_user.username }}';

    var selectedCarHtml = $('#selected_car').html();
    var tripCost = parseFloat(sessionStorage.getItem('trip_cost')); 
    var pickupTime = $('#selected_datetime').val() || null;

    var rideData = {
        username: currentUsername,
        selectedCarHtml: selectedCarHtml,
        status: 'requested',
        origin: originAddress,
        destination: destinationAddress,
        origin_lat: originCoordinates.latitude,
        origin_lng: originCoordinates.longitude,
        tripCost: tripCost, // 
        pickup_time: pickupTime,
    };

    $.ajax({
        type: 'POST',
        url: '/save_ride',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(rideData),
        success: function (response) {
            if (response.status === 'success') {
                showToast("Success", "Ride requested successfully!", "success");
                window.location.href = '/chat?trip_cost=' + tripCost;
            } else {
                showToast("Request Failed", "Failed to request ride. Please try again.", "error");
            }
        },
        error: function (error) {
            showToast("Error", "Error requesting ride. Please try again.", "error");
            console.error('Error:', error);
        }
    });
});
}


function getCoordinatesFromAddress(address, callback) {
var geocoder = new google.maps.Geocoder();

geocoder.geocode({ 'address': address }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
            var location = results[0].geometry.location;
            callback({
                latitude: location.lat(),
                longitude: location.lng()
            });
        } else {
            console.error('No results found for the given address');
            callback(null);
        }
    } else {
        console.error('Geocoding failed due to: ' + status);
        callback(null);
    }
});
}

// Document ready function
$(function () {
var currentDateTime = moment();
var minPickupTime = currentDateTime.clone().add(5, 'minutes');

var origin, destination, map;
google.maps.event.addDomListener(window, 'load', function () {
    setDestination();
    initMap();
    initTimePicker();
});

function initMap() {
    var myLatLng = { lat: 52.520008, lng: 13.404954 };
    map = new google.maps.Map(document.getElementById('map'), { zoom: 16, center: myLatLng });
}

function initTimePicker() {
    $('#selected_datetime').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        defaultDate: moment().add(30, 'minutes'),
        minDate: moment().add(30, 'minutes')
    });
}

function setDestination() {
    var from_places = new google.maps.places.Autocomplete(document.getElementById('from_places'));
    var to_places = new google.maps.places.Autocomplete(document.getElementById('to_places'));

    function setAddress(input, output, latOutput, lngOutput) {
        google.maps.event.addListener(input, 'place_changed', function () {
            var place = input.getPlace();
            var address = place.formatted_address;
            var lat = place.geometry.location.lat();
            var lng = place.geometry.location.lng();

            $(output).val(address);
            $(latOutput).val(lat);
            $(lngOutput).val(lng);
        });
    }

    setAddress(from_places, '#origin');
    setAddress(to_places, '#destination');
}

function getRouteStyle(travel_mode) {
    var mode = (travel_mode || '').toUpperCase();
    var color = '#de2e03'; // DRIVING default
    if (mode === 'WALKING') color = '#2563eb';
    if (mode === 'BICYCLING') color = '#10b981';
    if (mode === 'TRANSIT') color = '#7c3aed';

    return {
        strokeColor: color,
        strokeOpacity: 0.95,
        strokeWeight: 8,
        zIndex: 10
    };
}

function getRouteOutlineStyle() {
    return {
        strokeColor: '#0b0b0c',
        strokeOpacity: 0.35,
        strokeWeight: 12,
        zIndex: 9
    };
}

function displayRoute(travel_mode, origin, destination, directionsService, directionsDisplay, directionsDisplayOutline) {
    directionsService.route({
        origin: origin, destination: destination, travelMode: travel_mode, avoidTolls: true
    }, function (response, status) {
        if (status === 'OK') {
            if (directionsDisplayOutline) {
                directionsDisplayOutline.setMap(map);
                directionsDisplayOutline.setDirections(response);
            }
            directionsDisplay.setMap(map);
            directionsDisplay.setDirections(response);

            if ((travel_mode || '').toUpperCase() === 'TRANSIT') {
                addTransitStopMarkers(response);
                drawTransitFullPath(response);
            }
        } else {
            if (directionsDisplayOutline) {
                directionsDisplayOutline.setMap(null);
                directionsDisplayOutline.setDirections(null);
            }
            directionsDisplay.setMap(null);
            directionsDisplay.setDirections(null);
            showToast("Route Error", "Directions request failed due to " + status, "error");
        }
    });
}

function calculateDistance(travel_mode, origin, destination) {
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: travel_mode,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, function (response, status) {
        save_results(response, status);
    });
}

function save_results(response, status) {
    console.log("API Response Status:", status);
    console.log("API Response:", response);

    if (status !== google.maps.DistanceMatrixStatus.OK) {
        $('#result').html("Error: " + status);
    } else {
        try {
            var pickupTimeInput = $('#selected_datetime');
            var pickupTime;

            // Check if pickup time is provided and valid
            if (pickupTimeInput.val()) {
                // datetimepicker sometimes returns values with slightly different formats.
                // Try strict first; if it fails, fall back to a more lenient parse.
                pickupTime = moment(pickupTimeInput.val(), 'YYYY-MM-DD HH:mm', true);
                if (!pickupTime.isValid()) {
                    pickupTime = moment(pickupTimeInput.val());
                }

                if (isReverse && pickupTime.isBefore(moment().add(30, 'minutes'))) {
                    showToast("Invalid Time", "Please choose a pickup time at least 30 minutes from the current time.", "info");
                    return;
                }
            } else {
                setPickupNow();
                // setPickupNow() sets #selected_datetime; re-parse it so we can continue
                pickupTime = moment(pickupTimeInput.val());
            }

            var carsList = [
                { name: 'ViteGo', pickupTime: pickupTime.format('YYYY-MM-DD HH:mm') },
                { name: 'ViteGo XL', pickupTime: pickupTime.format('YYYY-MM-DD HH:mm') },
            ];

            var distance = response.rows[0].elements[0].distance.text;
            var durationInSeconds = response.rows[0].elements[0].duration.value;
            var durationInMinutes = Math.ceil(durationInSeconds / 60);

            console.log('Distance:', distance);
            console.log('Duration in minutes:', durationInMinutes);

            var tripCost = calculateTripCost(parseFloat(distance));

            var travel_mode = $('#travel_mode').val();
            if (travel_mode && travel_mode.toUpperCase() !== 'DRIVING') {
                showNonDrivingSummary(distance, durationInMinutes);
                return;
            }

            displayCarList(carsList, durationInMinutes, parseFloat(distance));
        } catch (error) {
            console.error("Error processing API response:", error);
            $('#result').html("Error processing API response: " + error.message);
        }
    }
}


$('#distance_form').submit(function (e) {
    e.preventDefault();
    var origin = $('#origin').val();
    var destination = $('#destination').val();
    var travel_mode = $('#travel_mode').val();
    var pickupTimeInput = $('#selected_datetime');
    var pickupTime;

    if (pickupTimeInput.val()) {
                // datetimepicker sometimes returns values with slightly different formats.
                // Try strict first; if it fails, fall back to a more lenient parse.
                pickupTime = moment(pickupTimeInput.val(), 'YYYY-MM-DD HH:mm', true);

                if (!pickupTime.isValid()) {
                    setPickupNow();
                    pickupTime = moment(pickupTimeInput.val());
                }

        if (isReverse && pickupTime.isBefore(moment().add(30, 'minutes'))) {
            showToast("Invalid Time", "Please choose a pickup time at least 30 minutes from the current time.", "info");
            return;
        }
    } else {
        setPickupNow();
        // setPickupNow() sets #selected_datetime; re-parse it so the rest runs
                pickupTime = moment(pickupTimeInput.val());
    }

    clearActiveRoute();

    var mode = (travel_mode || '').toUpperCase();
    if (mode === 'TRANSIT') {
        // Use Google's default transit rendering (keeps full multi-segment transit path details).
        activeDirectionsDisplayOutline = null;
        activeDirectionsDisplay = new google.maps.DirectionsRenderer({
            draggable: false,
            suppressMarkers: false,
            preserveViewport: false
        });
    } else {
        activeDirectionsDisplayOutline = new google.maps.DirectionsRenderer({
            draggable: false,
            suppressMarkers: true,
            preserveViewport: false,
            polylineOptions: getRouteOutlineStyle()
        });

        activeDirectionsDisplay = new google.maps.DirectionsRenderer({
            draggable: false,
            suppressMarkers: false,
            preserveViewport: false,
            polylineOptions: getRouteStyle(travel_mode)
        });
    }
    var directionsService = new google.maps.DirectionsService();
    displayRoute(travel_mode, origin, destination, directionsService, activeDirectionsDisplay, activeDirectionsDisplayOutline);
    calculateDistance(travel_mode, origin, destination);
});

function setCurrentPosition(pos) {
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                var formattedAddress = results[0].formatted_address;
                var originLat = results[0].geometry.location.lat();
                var originLng = results[0].geometry.location.lng();

                var rideData = {
                    username: '{{ current_user.username }}',
                    selectedCarHtml: '',
                    status: 'requested',
                    origin: formattedAddress,
                    destination: '',
                    origin_lat: originLat,
                    origin_lng: originLng,
                    pickup_time: ($('#selected_datetime').val() || null)
                };

                $.ajax({
                    type: 'POST',
                    url: '/save_ride',
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify(rideData),
                    success: function (response) {
                        if (response.status === 'success') {
                            showToast("Success", "Ride requested successfully!", "success");
                        } else {
                            showToast("Request Failed", "Failed to request ride. Please try again.", "error");
                        }
                    },
                    error: function (error) {
                        showToast("Error", "Error requesting ride. Please try again.", "error");
                        console.error('Error:', error);
                    }
                });
            }
        } else {
                showToast("Geocoder Failed", "Geocoder failed due to: " + status, "error");
            }
    });
}
});