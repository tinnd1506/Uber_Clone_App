function sortTable(columnIndex) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("rideRequestsTable");
    switching = true;

    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("tr");

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[columnIndex];
            y = rows[i + 1].getElementsByTagName("td")[columnIndex];

            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}


function viewPickupLocation(lat, lng) {
    var pickupLocationMap = new google.maps.Map(document.getElementById('pickupLocationMap'), {
        center: { lat: parseFloat(lat), lng: parseFloat(lng) },
        zoom: 15
    });

    var pickupMarker = new google.maps.Marker({
        position: { lat: parseFloat(lat), lng: parseFloat(lng) },
        map: pickupLocationMap,
        title: 'Pickup Location'
    });

    var infoWindow = new google.maps.InfoWindow({
        content: 'Pickup Location:<br>Lat: ' + lat + '<br>Lng: ' + lng
    });

    infoWindow.open(pickupLocationMap, pickupMarker);

    document.getElementById('pickupLocationMap').style.display = 'block';
}

function confirmRide(rideId) {
    fetch(`/confirm_ride/${rideId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            showToast("Success", "Ride confirmed successfully!", "success");
            setTimeout(() => {
                window.location.href = '/chat'; 
            }, 1500);
        } else {
            showToast("Failed", "Failed to confirm ride. Please try again.", "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast("Error", "An error occurred. Please try again.", "error");
    });
}