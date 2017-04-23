/*
  eztfl-html5  Alistair Mann
*/

//
// Constants
//
const NUM_TRACKED_COORD_PAIRS = 10;
const DEFAULT_LOOKAHEAD_SECS = 180;
const EARTH_RADIUS_IN_KM = 6371;
const EARLIEST_TIMESTAMP_EVAH = 1; // 1970-01-01T00:00:00.000Z
const LAST_TIMESTAMP_EVAH = 253402300799999; // 9999-12-31T23:59:59.999Z

const STR_GEOLOC_NOT_SUPPORTED = 'Geolocation is not supported by this browser.';
const STR_GEOLOC_WAITING = 'Waiting for more data';

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
	alert(STR_GEOLOC_NOT_SUPPORTED);
    }
}

function getSpeedInMetersPerSecond(position1, position2, distance_in_meters) {
    var seconds;
    var mseconds;

    if (distance_in_meters == 0)
	return 0;

    mseconds = position2.timestamp - position1.timestamp;

    if (mseconds == 0)
	return 0;

    seconds = mseconds / 1000;

    if (seconds == 0)
	return 0;

    return distance_in_meters / seconds;
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

function getDistanceInMeters(position1, position2) {
    return (se_getDistanceFromLatLonInKm(position1.coords.latitude,
					position1.coords.longitude,
					position2.coords.latitude,
					position2.coords.longitude)
	    * 1000);
}

function se_getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = EARTH_RADIUS_IN_KM;
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

function calculateNewPostionFromBearingDistance(lat, lng, bearing, distance_in_meters) {
    var R = EARTH_RADIUS_IN_KM;

    var distance_in_kilometers = distance_in_meters / 1000;

    var lat2 = Math.asin(Math.sin(Math.PI / 180 * lat) * Math.cos(distance_in_kilometers / R)
			 + Math.cos(Math.PI / 180 * lat) * Math.sin(distance_in_kilometers / R)
			 * Math.cos(Math.PI / 180 * bearing));
    var lon2 = Math.PI / 180 * lng + Math.atan2(Math.sin(Math.PI / 180 * bearing)
						* Math.sin(distance_in_kilometers / R)
						* Math.cos(Math.PI / 180 * lat ),
						Math.cos(distance_in_kilometers / R)
						- Math.sin(Math.PI / 180 * lat)
						* Math.sin(lat2));
    return [180 / Math.PI * lat2 , 180 / Math.PI * lon2];
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
    var distance_in_meters;
    var angle;
    var speed_in_meters_per_second;

    if (num_coords_tracked < 2)
	return [STR_GEOLOC_WAITING];

    early_coord = tracked_coord_pairs[NUM_TRACKED_COORD_PAIRS
				      -  num_coords_tracked];
    latest_coord = tracked_coord_pairs[NUM_TRACKED_COORD_PAIRS - 1];

    distance_in_meters = getDistanceInMeters(early_coord, latest_coord);
    angle = getAngle(early_coord, latest_coord);
    speed_in_meters_per_second = getSpeedInMetersPerSecond(early_coord,
							   latest_coord,
							   distance_in_meters);

    return ['Origin: ' + early_coord.coords.latitude + ','
	    + early_coord.coords.longitude
	    + ' angle: ' + angle + ' '
	    + DEFAULT_LOOKAHEAD_SECS + ' distance: ' + speed_in_meters_per_second
	    * (DEFAULT_LOOKAHEAD_SECS - ((latest_coord.timestamp - early_coord.timestamp)
					 / 1000))
	    + ' speed in m/s: ' + speed_in_meters_per_second
	    + ' newPos from: ' + latest_coord.coords.latitude,
	    latest_coord.coords.longitude
	    + ' predicts: ' +
	    calculateNewPostionFromBearingDistance(latest_coord.coords.latitude,
						   latest_coord.coords.longitude,
						   angle,
						   (speed_in_meters_per_second
						    * DEFAULT_LOOKAHEAD_SECS
						   ).toString()) +
	    ' radius: ' + speed_in_meters_per_second * (DEFAULT_LOOKAHEAD_SECS
							- ((latest_coord.timestamp
							   - early_coord.timestamp)
							   / 1000))];
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

    } else if (!(old_ts >= FIRST_TIMESTAMP_EVAH
		 && old_ts <= LAST_TIMESTAMP_EVAH)) {
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
