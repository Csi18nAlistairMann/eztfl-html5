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
    for (var a = 0; a < num_pairs - 1; a++) {
	tracked_coord_pairs[a] = tracked_coord_pairs[a + 1];
    }
    tracked_coord_pairs[num_pairs - 1] = [position.coords.latitude,
					  position.coords.longitude];
}

//-------------------------------------------------------------
//
// mainLoop
//
function mainLoop(position) {
    coordsPush(NUM_TRACKED_COORD_PAIRS, position);
    alert(tracked_coord_pairs.toString());
}
