window.onload = function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Service Worker registered', reg))
        .catch((err) => console.log('Service Worker not registered', err));
    }

    var socket = io.connect();

    var map = L.map('mapid').setView([0, 0], 2); // Initial view set to show whole world
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    var markers = {}; // Object to store markers

    var myMarker; // Marker for the user's location

var countdownElement = document.getElementById('countdown');

var countdown; // Countdown timer

// Function to update countdown timer
function updateCountdown() {
    countdownElement.textContent = 'Updating location in ' + countdown + ' seconds...';
    countdown--;
}

// Update countdown timer every second
setInterval(updateCountdown, 1000);

// Function to update user's location
function updateLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
        var myLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
        map.setView([myLocation.latitude, myLocation.longitude], 16); // Set view to user's location

        if (myMarker) {
            map.removeLayer(myMarker); // Remove old marker
        }
        myMarker = L.marker([myLocation.latitude, myLocation.longitude]).addTo(map); // Add new marker

        socket.emit('locationUpdate', myLocation);
    });
}

socket.on('initialLocations', (locations) => {
    for (let id in locations) {
        let location = locations[id];
        markers[id] = L.marker([location.latitude, location.longitude]).addTo(map); // Add marker for each location
    }
});

socket.on('initialCountdown', function(initialCountdown) {
    countdown = initialCountdown;
});

socket.on('newLocation', (data) => {
        if (markers[data.id]) {
            map.removeLayer(markers[data.id]); // Remove old marker
        }
        markers[data.id] = L.marker([data.location.latitude, data.location.longitude]).addTo(map); // Add new marker to map
    });

    socket.on('removeLocation', (id) => {
        map.removeLayer(markers[id]); // Remove marker from map
        delete markers[id]; // Remove marker from object
    });

    // Update location when countdown hits 0
socket.on('updateLocation', updateLocation);
}