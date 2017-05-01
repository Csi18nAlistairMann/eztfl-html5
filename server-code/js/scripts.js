/*
  eztfl-html5  Alistair Mann
*/
'use strict';
//
// Constants
//
const FAKE_POSITION = true;

const NUM_TRACKED_POSITIONS = 10;
const DEFAULT_LOOKAHEAD_SECS = 180;
const EARTH_RADIUS_IN_KM = 6371;
const FIRST_TIMESTAMP_EVAH = 1; // 1970-01-01T00:00:00.000Z
const LAST_TIMESTAMP_EVAH = 253402300799999; // 9999-12-31T23:59:59.999Z
const LOWEST_LATITUDE = -90.0;
const HIGHEST_LATITUDE = 90.0;
const LOWEST_LONGITUDE = -180.0;
const HIGHEST_LONGITUDE = 180.0;
const BUS_STOP_EXPIRES_IN_SECS = 10 * 60 * 60;
const NOTED_BUSSTOPS_NAME = 'notedBusStops';
const NOTED_COUNTDOWN_NAME = 'notedCountdown';
const MINIMUM_RADIUS_TO_LOOK = 200;
const MAXIMUM_RADIUS_TO_LOOK = 500; // only used when fake_position = true
const CLASS_COUNTDOWN_NAME = 'countdown';
const CLASS_BUSSTOP_NAME = 'busstop';
const CLASS_BUSSTOP_NAPTAN_NAME = 'busstop_';
const ID_BUSSTOP_NAME = 'busstopno_';
const ID_NEARDEST_NAME = 'neardestno_';
const ID_ROUTE_NAME = 'lineno_';
const RADIUS_NAME = 'radius';
const LATITUDE_NAME = 'latitude';
const LONGITUDE_NAME = 'longitude';
const NAPTAN_NAME = 'naptan';
const RENDERFIELD_WIDTH = 360;
const PREDICTION_POINT_X = RENDERFIELD_WIDTH / 2;
const PREDICTION_POINT_Y = 477 / 3;
const RENDERFIELD_HEIGHT = 509;
const EGG_WIDTH = 1440;
const EGG_HEIGHT = 2040;
const DIVISOR_FOR_RING2 = 6;
const DIVISOR_FOR_RING3 = 8;

const STR_GEOLOC_NOT_SUPPORTED = 'Geolocation is not supported by this browser.';
const STR_GEOLOC_WAITING = 'Waiting for more data';

const RPROXY_URL_STUB = 'https://eztfl-html5.mpsvr.com/mirror';
const RPROXY_URL_BUSSTOPS = RPROXY_URL_STUB + '/foo/StopPoint?stopTypes=NaptanPublicBusCoachTram';
const RPROXY_URL_COUNTDOWN_PRE = RPROXY_URL_STUB + '/bar/StopPoint/';
const RPROXY_URL_COUNTDOWN_POST = '/arrivals';

const HTTP_200 = 200;
const RENDERING_FIELD_NAME = 'renderingField';

const FAKE_SRC_PECKHAM = 'peckham';
const FAKE_SRC_PICCADILLY = 'piccadilly';
const FAKE_SRC_TRAFALGAR = 'trafalgar';
const FAKE_DATA_SOURCE = FAKE_SRC_TRAFALGAR;

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
    var a;

    for (a = 0; a < num_positions; a++) {
	tracked_positions[a] = null;
    }
}

//
// geolocation helpers
//
function getLocationSetup()
{
    var data;
    var position = {};

    if (FAKE_POSITION === true) {
	data = fakeData(FAKE_DATA_SOURCE);

	position = new Object();
	position.coords = new Object();
	position.coords.latitude = data[0];
	position.coords.longitude = data[1];
	position.timestamp = 1193421444000;
	positionPush(NUM_TRACKED_POSITIONS, position);
	position = new Object();
	position.coords = new Object();
	position.coords.latitude = data[2];
	position.coords.longitude = data[3];
	position.timestamp = 1193421460000;
	mainLoop(position);

    } else if (navigator.geolocation) {
	navigator.geolocation.watchPosition(mainLoop, cannotWatchPosition);

    } else {
	alert(STR_GEOLOC_NOT_SUPPORTED);
    }
}

function fakeData(source)
{
    switch (source) {
    case (FAKE_SRC_PECKHAM):
	// 4 local stops
	return [51.465367, -0.079329, 51.465398, -0.078962];
    case (FAKE_SRC_PICCADILLY):
	// more stops that can shake a stick at
	return [51.510172, -0.133610, 51.510149, -0.133997];
    case (FAKE_SRC_TRAFALGAR):
	// stop central
	return [51.505971, -0.129358, 51.506227, -0.129165];
    }
}

function cannotWatchPosition(positionError)
{
    var msg;

    switch(positionError.code) {
    case positionError.PERMISSION_DENIED:
	    msg = 'User denied the request for Geolocation.'
	break;
    case positionError.POSITION_UNAVAILABLE:
	    msg = 'Location information is unavailable.'
	break;
    case positionError.TIMEOUT:
	    msg = 'The request to get user location timed out.'
	break;
    case positionError.UNKNOWN_ERROR:
	    msg = 'An unknown error occurred.'
	break;
    }
    alert('Failed to start geolocation. Error:"' + msg + '"');
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
// rendering
//
function renderAddDivWithText(parent, name, text, onclick_handler, eztflClass, positionArr)
{
    var paragraph;
    var node;
    var div;

    // second time around, so test if we've already got it 1st
    if (!document.getElementById(name)) {
	// first time around there are no divs to look at so create them.
	paragraph = document.createElement('p');
	paragraph.setAttribute('id', name);
	if (positionArr !== null) {
	    paragraph.style.position = 'fixed';
	    positionArr = adjustForRing(positionArr, 0);
	    paragraph.style.left = positionArr[0] + 'px';
	    paragraph.style.top = positionArr[1] + 'px';
	}
	if (eztflClass !== null) {
	    paragraph.setAttribute('class', eztflClass);
	}
	if (onclick_handler !== null) {
	    paragraph.setAttribute('onclick', onclick_handler);
	}
	node = document.createTextNode(text);
	paragraph.appendChild(node);

	div = document.getElementById(parent);
	div.appendChild(paragraph);
    }
}

function renderBusRoute(parent, name, text, onclick_handler, eztflClass, positionArr)
{
    var paragraph;
    var node;
    var div;

    // second time around, so test if we've already got it 1st
    if (!document.getElementById(name)) {
	// first time around there are no divs to look at so create them.
	paragraph = document.createElement('p');
	paragraph.setAttribute('id', name);
	if (positionArr !== null) {
	    paragraph.style.position = 'fixed';
	    positionArr = adjustForRing(positionArr, 1);
	    paragraph.style.left = positionArr[0] + 'px';
	    paragraph.style.top = positionArr[1] + 'px';
	}
	if (eztflClass !== null) {
	    paragraph.setAttribute('class', eztflClass);
	}
	if (onclick_handler !== null) {
	    paragraph.setAttribute('onclick', onclick_handler);
	}
	node = document.createTextNode(text);
	paragraph.appendChild(node);

	div = document.getElementById(parent);
	div.appendChild(paragraph);
    }
}

function renderNearDestination(parent, name, text, onclick_handler, eztflClass, positionArr)
{
    var paragraph;
    var node;
    var div;
    var x;
    var y;

    // second time around, so test if we've already got it 1st
    if (!document.getElementById(name)) {
	// first time around there are no divs to look at so create them.
	paragraph = document.createElement('p');
	paragraph.setAttribute('id', name);
	if (positionArr !== null) {
	    paragraph.style.position = 'fixed';
	    x = positionArr[0];
	    y = positionArr[1];
	    paragraph.style.left = x + 'px';
	    paragraph.style.top = y + 'px';
	}
	if (eztflClass !== null) {
	    paragraph.setAttribute('class', eztflClass);
	}
	node = document.createTextNode(text);
	paragraph.appendChild(node);

	div = document.getElementById(parent);
	div.appendChild(paragraph);

	if (paragraph.offsetLeft + paragraph.clientWidth > RENDERFIELD_WIDTH) {
	    paragraph.style.left = RENDERFIELD_WIDTH - paragraph.clientWidth + 'px';
	}
	if (paragraph.offsetTop + paragraph.clientHeight > RENDERFIELD_HEIGHT) {
	    paragraph.style.top = RENDERFIELD_HEIGHT - paragraph.clientHeight + 'px';
	}
	paragraph.style.marginTop = '0px';
	paragraph.style.marginBottom = '0px';
    }
}

function adjustForRing(positionArr, ringno)
{
    var xoff;
    var yoff;

    if (ringno === 0) {
	// centre ring for stop letters
	xoff = (PREDICTION_POINT_X - (EGG_WIDTH / (DIVISOR_FOR_RING3 * 2)));
	yoff = (PREDICTION_POINT_Y - (EGG_WIDTH / (DIVISOR_FOR_RING3 * 2)));
	positionArr[0] = positionArr[0] / DIVISOR_FOR_RING3 + xoff;
	positionArr[1] = positionArr[1] / DIVISOR_FOR_RING3 + yoff;

    } else if (ringno === 1) {
	// middle ring for route numbers
	xoff = (PREDICTION_POINT_X - (EGG_WIDTH / (DIVISOR_FOR_RING2 * 2)));
	yoff = (PREDICTION_POINT_Y - (EGG_WIDTH / (DIVISOR_FOR_RING2 * 2)));
	positionArr[0] = positionArr[0] / DIVISOR_FOR_RING2 + xoff;
	positionArr[1] = positionArr[1] / DIVISOR_FOR_RING2 + yoff;

    } else if (ringno === 2) {
	// outer ring for near destinations
	// REEEAAAALLLYY simple. If out of rectangle shove off
	// to one side. No elegance at all
	// if (positionArr[0] < (1440 / 2) - 180) {
	//     positionArr[0] = 0;

	// } else if (positionArr[0] > (1440 / 2) + 180) {
	//     positionArr[0] = 180;
	// }

	// if (positionArr[1] < (2040 / 2) - 180) {
	//     positionArr[1] = 0;

	// } else if (positionArr[1] > (2040 / 2) + 180) {
	//     positionArr[1] = 180;
	// }
    } // Should not be any other ringno

    return positionArr;
}

function renderRemoveDivById(id)
{
    var child;

    // now we remove the first
    if (document.getElementById(id)) {
	child = document.getElementById(id);
	child.parentNode.removeChild(child);
    }
}

function renderRemoveDivByClass(className)
{
    var child;
    var list;

    // now we remove the first
    list = document.getElementsByClassName(className);
    while(list.length) {
	list[0].parentNode.removeChild(list[0]);
    }
}

function renderReplaceDivWithText(dest, source, text)
{
    var paragraph;
    var node;
    var destChild;

    // now we replace the second
    if (!document.getElementById(source)) {
	paragraph = document.createElement('p');
	paragraph.setAttribute('id', source);
	node = document.createTextNode(text);
	paragraph.appendChild(node);

	destChild = document.getElementById(dest);
	destChild.parentNode.replaceChild(node, destChild);
    }
}

function renderBusStops()
{
    var busstopData = JSON.parse(localStorage.getItem(NOTED_BUSSTOPS_NAME));
    var text;
    var id;
    var line_count;
    var stop_count;
    var busstop;
    var routeno;
    var busstop_naptan_class;
    var extants;
    var deletable;
    var elementmatch;
    var classname;
    var key;
    var posOnRing;
    var nearDestPos;

    // html that could be deleted when a busstop goes out of range
    // is distinguished by having class busstop_<naptan>. Get an
    // array of all such currently present in the DOM - we'll delete
    // any that don't get updated
    deletable = [];
    extants = document.getElementsByClassName(CLASS_BUSSTOP_NAME);
    for (elementmatch = 0; elementmatch < extants.length; elementmatch++) {
	for (classname = 0; classname < extants[elementmatch].classList.length; classname++) {
	    if (extants[elementmatch].classList[classname].substring(0, 8) === CLASS_BUSSTOP_NAPTAN_NAME) {
		deletable[extants[elementmatch].classList[classname]] = true;
	    }
	}
    }

    // Render new bus stop info
    stop_count = 0;
    for (busstop in busstopData) {
	busstop_naptan_class = CLASS_BUSSTOP_NAPTAN_NAME + busstopData[busstop].naptanId;

	id = ID_BUSSTOP_NAME + busstopData[busstop].naptanId;
	deletable[busstop_naptan_class] = false;
	text = adjustStopLetter(busstopData[busstop].stopLetter);
	renderRemoveDivById(id);
	posOnRing = translatePositionOnRing(busstopData[busstop]);
	renderAddDivWithText(RENDERING_FIELD_NAME, id, text,
			     'loadCountdown("' + busstopData[busstop].naptanId + '")',
			     CLASS_BUSSTOP_NAME + ' ' + busstop_naptan_class,
			     posOnRing);

	id = ID_NEARDEST_NAME + busstopData[busstop].naptanId;
	text = busstopData[busstop].towards;
	renderRemoveDivById(id);

	nearDestPos = translatePosToRing3(busstopData[busstop]);
	renderNearDestination(RENDERING_FIELD_NAME, id, text, null, busstop_naptan_class, nearDestPos);

	line_count = 0;
	for (routeno in busstopData[busstop].lines) {
	    id = ID_ROUTE_NAME + busstopData[busstop].naptanId + '_' + busstopData[busstop].lines[routeno].name;
	    text = busstopData[busstop].lines[routeno].name;
	    renderRemoveDivById(id);
	    posOnRing = translatePositionOnRing(busstopData[busstop]); // guarantees overlap for now
	    renderBusRoute(RENDERING_FIELD_NAME, id, text, null, busstop_naptan_class, posOnRing);
	    line_count++;
	}

	stop_count++;
    }

    // and delete any old items that didn't get updated
    for (key in deletable) {
	if (deletable.hasOwnProperty(key)) {
	    if (deletable[key] === true) {
		renderRemoveDivByClass(key);
	    }
	}
    }
}

function adjustStopLetter(stopletter)
{
    if (stopletter === undefined) {
	return '@';

    } else {
	return stopletter;
    }
}

function translatePositionOnRing(busstop)
{
    var bearing;
    var idx;

    bearing = se_getAngle(busstop.originLatitude, busstop.originLongitude,
			  busstop.lat, busstop.lon);

    idx = 0;
    while (ring[idx] < bearing) {
	idx += 3;
    }
    return [ring[idx + 1], ring[idx + 2]]
}

function translatePosToRing3(busstop)
{
    var bearing;
    var idx;
    var x;
    var y;
    var xoff;
    var yoff;
    var ratio;
    var potential_x;
    var potential_y;

    bearing = se_getAngle(busstop.originLatitude, busstop.originLongitude,
			  busstop.lat, busstop.lon);

    idx = 0;
    while (ring[idx] < bearing) {
	idx += 3;
    }

    x = RENDERFIELD_WIDTH / EGG_WIDTH * ring[idx + 1] ;
    y = RENDERFIELD_HEIGHT / EGG_HEIGHT * ring[idx + 2] ;

    xoff = Math.abs(PREDICTION_POINT_X - x);
    yoff = Math.abs(PREDICTION_POINT_Y - y);
    ratio = xoff / yoff;

    // this is the bit that could more usefully be done with tangents
    if (bearing <= 90) {
	while (x < RENDERFIELD_WIDTH && y > 0) {
	    x += ratio;
	    y--;
	}

    } else if (bearing <= 180) {
	while (x < RENDERFIELD_WIDTH && y < RENDERFIELD_HEIGHT) {
	    x += ratio;
	    y++;
	}

    } else if (bearing <= 270) {
	while (x > 0 && y < RENDERFIELD_HEIGHT) {
	    x -= ratio;
	    y++;
	}

    } else if (bearing <= 360) {
	while (x > 0 && y > 0) {
	    x -= ratio;
	    y--;
	}
    }
    x = (x < 0) ? 0 : x;
    x = (x > RENDERFIELD_WIDTH) ? RENDERFIELD_WIDTH : x;
    y = (y < 0) ? 0 : y;
    y = (y > RENDERFIELD_HEIGHT) ? RENDERFIELD_HEIGHT : y;

    return [x, y];
}

function renderCountdown(naptan)
{
    var countdownData = JSON.parse(sessionStorage.getItem(NOTED_COUNTDOWN_NAME));
    var text;
    var id;
    var arrival;
    var count;
    var extants;
    var idx;

    // remove all existing countdown data
    extants = document.getElementsByClassName(CLASS_COUNTDOWN_NAME);
    for (idx = 0; idx < extants.length; idx++) {
	extants[idx].parentNode.removeChild(extants[idx]);
    }

    // display all the new countdown data
    count = 0;
    for (arrival in countdownData) {
	id = 'arrival_' + count;

	text = countdownData[arrival].lineName + ' in ' + Math.round(countdownData[arrival].timeToStation / 60);

	if (text !== '') {
	    renderRemoveDivById(id);
	    renderAddDivWithText(RENDERING_FIELD_NAME, id, text, null, CLASS_COUNTDOWN_NAME + ' busstop_' + naptan, null);
	}

	count++;
    }
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
    var a;

    for (a = 0; a < num_positions - 1; a++) {
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
    var pair;
    var radius;
    var lat;
    var lon;

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
    pair = calculateNewPostionFromBearingDistance(latest_position.coords.latitude,
						  latest_position.coords.longitude,
						  angle,
						  speed_in_meters_per_second * DEFAULT_LOOKAHEAD_SECS);

    radius = speed_in_meters_per_second * (DEFAULT_LOOKAHEAD_SECS
					   - ((latest_position.timestamp - early_position.timestamp)
					      / 1000));
    if (radius < MINIMUM_RADIUS_TO_LOOK) {
	radius = MINIMUM_RADIUS_TO_LOOK;

    } else if (FAKE_POSITION && radius > MAXIMUM_RADIUS_TO_LOOK) {
	radius = MAXIMUM_RADIUS_TO_LOOK;
    }
    radius = Math.round(radius);

    lat = pair[0];
    lon = pair[1];
    url = RPROXY_URL_BUSSTOPS + '&radius=' + radius + '&lat=' + lat + '&lon=' + lon;
    sessionStorage.setItem(RADIUS_NAME, JSON.stringify(radius));
    sessionStorage.setItem(LATITUDE_NAME, JSON.stringify(lat));
    sessionStorage.setItem(LONGITUDE_NAME, JSON.stringify(lon));
    handler = receiveNewBusStops;
    sendGetCore(url, handler);

    return url;
}

function receiveNewBusStops()
{
    var show;

    if (this.status == HTTP_200) {
	this.response.stopPoints.forEach(receiveNewBusStop);
	renderBusStops();

    } else {
	show = 'Request failed: (' + this.status.toString() + ') ' + name;
	alert(show);
    }
}

function receiveNewBusStop(currentValue, index, array)
{
    var timeNow;
    var notedBusStops;
    var include_this;
    var towards;
    var additionalPropertyIdx;
    var busStop;

    if (currentValue.lines.length === 0) {
	// bus stop has no routes serving it
	return;
    }

    timeNow = Date.now();
    notedBusStops = localStorage.getItem(NOTED_BUSSTOPS_NAME);

    currentValue.originLatitude = sessionStorage.getItem(LATITUDE_NAME);
    currentValue.originLongitude = sessionStorage.getItem(LONGITUDE_NAME);

    // we'll use this to expire old bus stops
    currentValue.timestamp = timeNow;

    // retrieve or create the storage we're after
    if (notedBusStops === null) {
	notedBusStops = [];

    } else {
	notedBusStops = JSON.parse(notedBusStops);
    }

    towards = '';
    for (additionalPropertyIdx in currentValue.additionalProperties) {
	if (currentValue.additionalProperties[additionalPropertyIdx].key === 'Towards') {
	    towards = currentValue.additionalProperties[additionalPropertyIdx].value;
	}
    }
    currentValue.towards = towards;

    // see if we already have this bus stop, and expire old
    include_this = true;
    for (busStop in notedBusStops) {
	if (notedBusStops[busStop].timestamp < timeNow - BUS_STOP_EXPIRES_IN_SECS) {
	    // expire when ten minutes old
	    notedBusStops.splice(busStop, 1);
	    include_this = false;

	} else if (notedBusStops[busStop].id === currentValue.id) {
	    // we're already watching this one
	    include_this = false;
	}
    }
    if (include_this === true) {
	notedBusStops.push(currentValue);
    }

    localStorage.setItem(NOTED_BUSSTOPS_NAME, JSON.stringify(notedBusStops));
}

function loadCountdown(naptan)
{
    getArrivalsFromTfl(naptan);
}

//
// getArrivalsFromTfl('490015575X');
function getArrivalsFromTfl(naptan)
{
    var url;
    var handler;

    if (naptan == '')
	return '';

    url = RPROXY_URL_COUNTDOWN_PRE + naptan + RPROXY_URL_COUNTDOWN_POST;
    sessionStorage.setItem(NAPTAN_NAME, naptan);
    handler = receiveNewCountdown;
    sendGetCore(url, handler);

    return url;
}

function receiveNewCountdown(naptan)
{
    if (this.status == HTTP_200) {
	sessionStorage.setItem(NOTED_COUNTDOWN_NAME, JSON.stringify(this.response));
	renderCountdown(sessionStorage.getItem(NAPTAN_NAME));

    } else {
	$show = 'Request failed: (' + this.status.toString() + ') ' + name;
	alert($show);
    }
}

//
// array comparison
//
function isArrayEqual(arr1, arr2)
{
    var a;

    if (arr1.length != arr2.length)
	return false;
    for (a = 0; a < arr1.length; a++) {
	if (arr1[a] !== arr2[a])
	    return false;
    }
    return true;
}

//
// sanity checks for the position, also replace bad/missing vals
//
function checkPositionValues(original_position)
{
    var old_ts = original_position.timestamp;
    var new_ts = Date.now();
    var position;

    position = Object.assign({}, original_position);
    position.coords = Object.assign({}, original_position.coords);
    position.coords.latitude = original_position.coords.latitude;
    position.coords.longitude = original_position.coords.longitude;
    position.timestamp = original_position.timestamp;

    // the timestamp should reflect a date between 1970 and 9999AD
    if (typeof(new_ts) !== 'number') {
	new_ts = FIRST_TIMESTAMP_EVAH;

    } else if (!(old_ts >= FIRST_TIMESTAMP_EVAH
		 && old_ts <= LAST_TIMESTAMP_EVAH)) {
	new_ts = FIRST_TIMESTAMP_EVAH;
    }

    if (typeof(old_ts) !== 'number') {
	position.timestamp = new_ts;

    } else if (!(old_ts >= FIRST_TIMESTAMP_EVAH
		 && old_ts <= LAST_TIMESTAMP_EVAH)) {
	position.timestamp = new_ts;
    }

    // the latitude and longitude should be values between
    // -90 & +90, -180 & +180 respectively
    if (typeof(position.coords.latitude) !== 'number') {
	position.coords.latitude = 0;

    } else if (!(position.coords.latitude >= LOWEST_LATITUDE
		 && position.coords.latitude <= HIGHEST_LATITUDE)) {
	position.coords.latitude = 0;
    }

    if (typeof(position.coords.longitude) !== 'number') {
	position.coords.longitude = 0;

    } else if (!(position.coords.longitude >= LOWEST_LONGITUDE
		 && position.coords.longitude <= HIGHEST_LONGITUDE)) {
	position.coords.longitude = 0;
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
    var prediction = null;

    position = checkPositionValues(position);
    num_positions_tracked = positionPush(NUM_TRACKED_POSITIONS, position);

    prediction = positionsGetPrediction(num_positions_tracked);

    // if (prediction === last_prediction) {
    // 	last_prediction = prediction;
    // }
    // if (!isArrayEqual(prediction, last_prediction)) {
    // 	last_prediction = prediction;
    // }
}
