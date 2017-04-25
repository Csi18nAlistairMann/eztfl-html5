/*
  eztfl-html5  Alistair Mann
*/

//
// Constants
//
const NUM_TRACKED_POSITIONS = 10;
const DEFAULT_LOOKAHEAD_SECS = 180;
const EARTH_RADIUS_IN_KM = 6371;
const EARLIEST_TIMESTAMP_EVAH = 1; // 1970-01-01T00:00:00.000Z
const LAST_TIMESTAMP_EVAH = 253402300799999; // 9999-12-31T23:59:59.999Z
const LOWEST_LATITUDE = -90.0;
const HIGHEST_LATITUDE = 90.0;
const LOWEST_LONGITUDE = -180.0;
const HIGHEST_LONGITUDE = 180.0;

const STR_GEOLOC_NOT_SUPPORTED = 'Geolocation is not supported by this browser.';
const STR_GEOLOC_WAITING = 'Waiting for more data';

const RPROXY_URL = "https://eztfl-html5.mpsvr.com/mirror/foo/StopPoint?stopTypes=NaptanPublicBusCoachTram";

//
// Globals
//
var tracked_positions = [];
var last_prediction = [null];

//
// setup helpers
//
function eztflHtml5_setup()
{
    getLocationSetup();
    setup_tracked_positions(NUM_TRACKED_POSITIONS);
}

function setup_tracked_positions(num_positions)
{
    for(var a = 0; a < num_positions; a++) {
	tracked_positions[a] = null;
    }
}

//
// geolocation helpers
//
function getLocationSetup()
{
    if (navigator.geolocation) {
	navigator.geolocation.watchPosition(mainLoop, cannotWatchPosition);

    } else {
	alert(STR_GEOLOC_NOT_SUPPORTED);
    }
}

function cannotWatchPosition(positionError)
{
    var msg;

    switch(positionError.code) {
    case error.PERMISSION_DENIED:
	    msg = "User denied the request for Geolocation."
	break;
    case error.POSITION_UNAVAILABLE:
	    msg = "Location information is unavailable."
	break;
    case error.TIMEOUT:
	    msg = "The request to get user location timed out."
	break;
    case error.UNKNOWN_ERROR:
	    msg = "An unknown error occurred."
	break;
    }
    alert("Failed to start geolocation. Error:\"" + msg + "\"");
}

function getSpeedInMetersPerSecond(position1, position2, distance_in_meters)
{
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
function se_deg2rad(deg)
{
    return deg * (Math.PI / 180)
}

function se_rad2deg(n)
{
    return n * (180 / Math.PI);
}

function getAngle(position1, position2)
{
    return se_getAngle(position1.coords.latitude,
		       position1.coords.longitude,
		       position2.coords.latitude,
		       position2.coords.longitude);
}

function se_getAngle(startLat, startLong, endLat, endLong)
{
    startLat = se_deg2rad(startLat);
    startLong = se_deg2rad(startLong);
    endLat = se_deg2rad(endLat);
    endLong = se_deg2rad(endLong);

    var dLong = endLong - startLong;

    var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0)
			/ Math.tan(startLat / 2.0 + Math.PI / 4.0));
    if (Math.abs(dLong) > Math.PI) {
	if (dLong > 0.0)
	    dLong = -(2.0 * Math.PI - dLong);
	else
	    dLong = (2.0 * Math.PI + dLong);
    }

    return (se_rad2deg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
}

function getDistanceInMeters(position1, position2)
{
    return (se_getDistanceFromLatLonInKm(position1.coords.latitude,
					 position1.coords.longitude,
					 position2.coords.latitude,
					 position2.coords.longitude)
	    * 1000);
}

function se_getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)
{
    var R = EARTH_RADIUS_IN_KM;
    var dLat = se_deg2rad(lat2 - lat1);
    var dLon = se_deg2rad(lon2 - lon1);
    var a =
	Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	Math.cos(se_deg2rad(lat1)) * Math.cos(se_deg2rad(lat2)) *
	Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function calculateNewPostionFromBearingDistance(lat, lng, bearing, distance_in_meters)
{
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
    return [180 / Math.PI * lat2, 180 / Math.PI * lon2];
}

//-------------------------------------------------------------
//
// other helpers
//

//
// handling the stack of tracked positions
//
function positionPush(num_positions, position)
{
    var count = 0;
    for (var a = 0; a < num_positions - 1; a++) {
	tracked_positions[a] = tracked_positions[a + 1];
	if (tracked_positions[a] != null)
	    count++
    }
    tracked_positions[num_positions - 1] = position;

    return ++count;
}

//
// prediction helpers
//
function positionsGetPrediction(num_positions_tracked)
{
    return positionsGetPredictionSimplest(num_positions_tracked);
}

function positionsGetPredictionSimplest(num_positions_tracked)
{
    // take first and last coord in stack, ignore rest
    var early_position = [];
    var latest_position = [];
    var distance_in_meters;
    var angle;
    var speed_in_meters_per_second;
    var url;
    var handler;

    if (num_positions_tracked < 2)
	return [STR_GEOLOC_WAITING];

    early_position = tracked_positions[NUM_TRACKED_POSITIONS
				       -  num_positions_tracked];
    latest_position = tracked_positions[NUM_TRACKED_POSITIONS - 1];

    distance_in_meters = getDistanceInMeters(early_position, latest_position);
    angle = getAngle(early_position, latest_position);
    speed_in_meters_per_second = getSpeedInMetersPerSecond(early_position,
							   latest_position,
							   distance_in_meters);
    var pair = calculateNewPostionFromBearingDistance(latest_position.coords.latitude,
						      latest_position.coords.longitude,
						      angle,
						      speed_in_meters_per_second * DEFAULT_LOOKAHEAD_SECS);

    var radius = speed_in_meters_per_second * (DEFAULT_LOOKAHEAD_SECS
					       - ((latest_position.timestamp - early_position.timestamp)
						  / 1000));
    if (radius < 100)
	radius = 300;

    url = RPROXY_STUB + "&radius=" + radius + "&lat=" + pair[0] + "&lon=" + pair[1];
//    handler = handler_task_1; //receivingNewBusStops;
    sendGetCore(url, handler);

    // return ['Origin: ' + early_position.coords.latitude + ','
    // 	    + early_position.coords.longitude
    // 	    + ' angle: ' + angle + ' '
    // 	    + DEFAULT_LOOKAHEAD_SECS + ' distance: ' + speed_in_meters_per_second
    // 	    * (DEFAULT_LOOKAHEAD_SECS - ((latest_position.timestamp - early_position.timestamp)
    // 					 / 1000))
    // 	    + ' speed in m/s: ' + speed_in_meters_per_second
    // 	    + ' newPos from: ' + latest_position.coords.latitude,
    // 	    latest_position.coords.longitude
    // 	    + ' predicts: ' +
    // 	    calculateNewPostionFromBearingDistance(latest_position.coords.latitude,
    // 						   latest_position.coords.longitude,
    // 						   angle,
    // 						   (speed_in_meters_per_second
    // 						    * DEFAULT_LOOKAHEAD_SECS
    // 						   ).toString()) +
    // 	    ' radius: ' + speed_in_meters_per_second * (DEFAULT_LOOKAHEAD_SECS
    // 							- ((latest_position.timestamp
    // 							    - early_position.timestamp)
    // 							   / 1000))];
}

function receivingNewBusStops()
{

}

//
// array comparison
//
function isArrayEqual(arr1, arr2)
{
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
function checkPositionValues(position)
{
    var old_ts = position.timestamp;
    var new_ts = Date.now();

    // the timestamp should reflect a date between 1970 and 9999AD
    if (typeof(new_ts !== 'number')) {
	new_ts = EARLIEST_TIMESTAMP_EVAH;

    } else if (!(old_ts >= FIRST_TIMESTAMP_EVAH
		 && old_ts <= LAST_TIMESTAMP_EVAH)) {
	new_ts = EARLIEST_TIMESTAMP_EVAH;
    }

    if (typeof(old_ts !== 'number')) {
	position.timestamp = new_ts;

    } else if (!(old_ts >= FIRST_TIMESTAMP_EVAH
		 && old_ts <= LAST_TIMESTAMP_EVAH)) {
	position.timestamp = new_ts;
    }

    // the latitude and longitude should be values between
    // -90 & +90, -180 & +180 respectively
    if (typeof(position.latitude !== 'number')) {
	position.latitude = 0;

    } else if (!(position.latitude >= LOWEST_LATITUDE
		 && position.latitude <= HIGHEST_LATITUDE)) {
	position.latitude = 0;
    }

    if (typeof(position.longitude !== 'number')) {
	position.longitude = 0;

    } else if (!(position.longitude >= LOWEST_LONGITUDE
		 && position.longitude <= HIGHEST_LONGITUDE)) {
	position.longitude = 0;
    }

    return position;
}

//-------------------------------------------------------------
//
// mainLoop
//
function mainLoop(position)
{
    var num_positions_tracked = 0;
    var prediction = []

    position = checkPositionValues(position);
    num_positions_tracked = positionPush(NUM_TRACKED_POSITIONS, position);

    prediction = positionsGetPrediction(num_positions_tracked);

    if (!isArrayEqual(prediction, last_prediction)) {
	last_prediction = prediction;

    }
}
