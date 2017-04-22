/*
  eztfl-html5  Alistair Mann
*/

//
// Constants
//
const NUM_TRACKED_COORD_PAIRS = 10;

//
// Globals
//
var tracked_coord_pairs = [];
var last_prediction = [null];

//
// setup helpers
//
function eztflHtml5_setup() {
    getLocationSetup();
    setup_tracked_coord_pairs(NUM_TRACKED_COORD_PAIRS);
}

function setup_tracked_coord_pairs(num_pairs) {
    for(var a = 0; a < num_pairs; a++) {
	tracked_coord_pairs[a] = null;
    }
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
// other helpers
//

//
// handling the stack of tracked coords
//
function coordsPush(num_pairs, position) {
    var count = 0;
    for (var a = 0; a < num_pairs - 1; a++) {
	tracked_coord_pairs[a] = tracked_coord_pairs[a + 1];
	if (tracked_coord_pairs[a] != null)
	    count++
    }
    tracked_coord_pairs[num_pairs - 1] = [position.coords.latitude,
					  position.coords.longitude];
    return ++count;
}

//
// prediction helpers
//
function coordsGetPrediction(num_coords_tracked) {
    return ['prediction ' + num_coords_tracked];
}

//
// array comparison
//
function isArrayEqual(arr1, arr2) {
    if (arr1.length != arr2.length)
	return false;
    for(var a = 0; a < arr1.length; a++) {
	if (arr1[a] !== arr2[a])
	    return false;
    }
    return true;
}

//-------------------------------------------------------------
//
// mainLoop
//
function mainLoop(position) {
    var num_coords_tracked = 0;
    var prediction = []

    num_coords_tracked = coordsPush(NUM_TRACKED_COORD_PAIRS, position);

    if (num_coords_tracked > 1) {
	prediction = coordsGetPrediction(num_coords_tracked);
    }

    if (!isArrayEqual(prediction, last_prediction)) {
	alert(prediction.toString());
	last_prediction = prediction;
    }
}
