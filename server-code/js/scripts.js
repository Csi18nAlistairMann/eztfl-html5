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

function getSpeed(position1, position2, distance) {
    var seconds;
    var mseconds;

    if (distance == 0)
	return 0;

    mseconds = position2.timestamp - position1.timestamp;

    if (mseconds == 0)
	return 0;

    seconds = mseconds / 1000;

    if (seconds == 0)
	return 0;

    return distance * 1000 / seconds;
}

//
// trigonometry helpers
//
function se_deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function se_rad2deg(n) {
    return n * (180 / Math.PI);
}

function getAngle(position1, position2) {
    return se_getAngle(position1.coords.latitude,
		       position1.coords.longitude,
		       position2.coords.latitude,
		       position2.coords.longitude);
}

function se_getAngle(startLat, startLong, endLat, endLong) {
    startLat = se_deg2rad(startLat);
    startLong = se_deg2rad(startLong);
    endLat = se_deg2rad(endLat);
    endLong = se_deg2rad(endLong);

    var dLong = endLong - startLong;

    var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0)
			/ Math.tan(startLat / 2.0 + Math.PI / 4.0));
    if (Math.abs(dLong) > Math.PI){
	if (dLong > 0.0)
	    dLong = -(2.0 * Math.PI - dLong);
	else
	    dLong = (2.0 * Math.PI + dLong);
    }

    return (se_rad2deg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
}

function getDistance(position1, position2) {
    return se_getDistanceFromLatLonInKm(position1.coords.latitude,
					position1.coords.longitude,
					position2.coords.latitude,
					position2.coords.longitude);
}

function se_getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = se_deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = se_deg2rad(lon2 - lon1);
    var a =
	Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	Math.cos(se_deg2rad(lat1)) * Math.cos(se_deg2rad(lat2)) *
	Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
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
    // tracked_coord_pairs[num_pairs - 1] = [position.coords.latitude,
    // 					  position.coords.longitude];
    tracked_coord_pairs[num_pairs - 1] = position;

    return ++count;
}

//
// prediction helpers
//
function coordsGetPrediction(num_coords_tracked) {
    return coordsGetPredictionSimplest(num_coords_tracked);
}

function coordsGetPredictionSimplest(num_coords_tracked) {
    // take first and last coord in stack, ignore rest
    var early_coord = [];
    var latest_coord = [];
    var distance;
    var angle;
    var speed;

    if (num_coords_tracked < 2)
	return ['Waiting for more data'];

    early_coord = tracked_coord_pairs[NUM_TRACKED_COORD_PAIRS
				      -  num_coords_tracked];
    latest_coord = tracked_coord_pairs[NUM_TRACKED_COORD_PAIRS - 1];

    distance = getDistance(early_coord, latest_coord);
    angle = getAngle(early_coord, latest_coord);
    speed = getSpeed(early_coord, latest_coord, distance);

    return ['prediction: d=' + distance + ' a=' + angle
	   + ' s=' + speed];
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

//
// sanity checks for the position, also replace bad/missing vals
//
function checkPositionValues(position) {
    var old_ts = position.timestamp;
    var new_ts = Date.now();

    // the timestamp should reflect a date between 1970 and 9999AD
    if (typeof(old_ts !== 'number')) {
	position.timestamp = new_ts;

    } else if (!(old_ts >= 1 && old_ts <= 253402300799999)) {
	position.timestamp = new_ts;
    }

    return position;
}

//-------------------------------------------------------------
//
// mainLoop
//
function mainLoop(position) {
    var num_coords_tracked = 0;
    var prediction = []

    position = checkPositionValues(position);
    num_coords_tracked = coordsPush(NUM_TRACKED_COORD_PAIRS, position);

    prediction = coordsGetPrediction(num_coords_tracked);

    if (!isArrayEqual(prediction, last_prediction)) {
	alert(prediction.toString());
	last_prediction = prediction;
    }
}
