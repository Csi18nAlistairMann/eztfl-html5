/*
  eztfl-html5  Alistair Mann
*/

//
// setup helpers
//
function eztflHtml5_setup() {
    getLocationSetup()
}

//
// geolocation helpers
//
function getLocationSetup() {
    if (navigator.geolocation) {
	navigator.geolocation.watchPosition(mainLoop);

    } else {
	alert('Geolocation is not supported by this browser.');
    }
}

//-------------------------------------------------------------
//
// mainLoop
//
function mainLoop(position) {
    alert('Latitude: ' + position.coords.latitude +
	  'Longitude: ' + position.coords.longitude);
}
