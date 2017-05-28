/*
  eztfl-html5  Alistair Mann

  In comments, 'middle' and 'front' are used. Front is for front-end and
  denotes the code in that section is used by the device for getting data
  onto the screen.
  Middle interfaces between that front-end and the back-end servers
  charged with keep the raw data.
*/
//
/* jshint esversion: 6 */
//
//
// Constants
//
const FAKE_POSITION = false;
const USE_BUMPOMATIC = true;

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
const MINIMUM_RADIUS_TO_LOOK = 250;
const MAXIMUM_RADIUS_TO_LOOK = 500; // only used when fake_position = true
const CLASS_COUNTDOWN_NAME = 'countdown';
const CLASS_BUSSTOP_NAME = 'busstop';
const CLASS_BUSSTOP_NAPTAN_NAME = 'busstop_';
const CLASS_NEARDEST_NAME = 'neardest';
const CLASS_COMMONNAME_NAME = 'commonnamedir';
const CLASS_ROUTE_NAME = 'lineno';
const CLASS_ROUTE_CELL_NAME = 'cell_lineno'
const ID_ROUTE_TABLE_NAME = 'table_routenos';
const ID_ROUTE_DIV_NAME = 'div_table_routenos';
const ID_BUSSTOP_NAME = 'busstopno_';
const ID_NEARDEST_NAME = 'neardestno_';
const ID_COMMONNAMEDIR_NAME = 'commonnamedir_';
const ID_ROUTE_NAME = 'lineno_';
const ID_ARRIVAL_NAME = 'arrival_';
const RADIUS_NAME = 'radius';
const LATITUDE_NAME = 'latitude';
const LONGITUDE_NAME = 'longitude';
const NAPTAN_NAME = 'naptan';
const RENDERFIELD_WIDTH = 360;
const PREDICTION_POINT_X = RENDERFIELD_WIDTH / 2;
const PREDICTION_POINT_Y = 477 / 3;
const RENDERFIELD_HEIGHT = 510;
const EGG_WIDTH = 1440;
const EGG_HEIGHT = 2040;
const DIVISOR_FOR_RING2 = 6;
const DIVISOR_FOR_RING3 = 8;
const RING0 = 0; // centre for bus stops
const RING1 = 1; // middle for bus routes
const RING2 = 2; // outside for near destinations
const DEVICES_HEADING_NAME = 'devicesheading';
const FORCED_HEADING_NAME = 'forcedheading';

const STR_GEOLOC_NOT_SUPPORTED = 'Geolocation is not supported by this browser.';
const STR_GEOLOC_WAITING = 'Waiting for more data';

const RPROXY_URL_STUB = 'https://eztfl-html5.mpsvr.com/mirror';
const RPROXY_URL_BUSSTOPS = RPROXY_URL_STUB + '/foo/StopPoint?stopTypes=NaptanPublicBusCoachTram';
const RPROXY_URL_COUNTDOWN_PRE = RPROXY_URL_STUB + '/bar/StopPoint/';
const RPROXY_URL_COUNTDOWN_POST = '/arrivals';

const HTTP_200 = 200;
const RENDERING_FIELD_NAME = 'renderingField';
const ROUTENOS_TABLE_WIDTH = 11;
const BUMP_COLOUR_FG = '#e2e2e2';
const BUMP_COLOUR_BG = '#dc241f';
const USE_BUMP_COLOURING = false;
const CLASS_YELLOW_BORDER = 'selected_border';
const GUESSED_TRANSPORT_MODE_NAME = 'guessed_transport_mode';

const PREDICTION_METHOD_NAME = 'prediction-method';
const PREDICTION_METHOD_SIMPLEST = 'simplest';
const PREDICTION_METHOD_RECTANGLE_IN_RADIUS = 'rectinrad';

const SPEED_STATIONARY_BELOW = 0.1;
const SPEED_GUESS_TEXT_STATIONARY = 'stationary';
const SPEED_WALKING_BELOW = 3;
const SPEED_GUESS_TEXT_WALKING = 'walking';
const SPEED_IN_CITY_BELOW = 7;
const SPEED_GUESS_TEXT_IN_CITY = 'city transit';
const SPEED_TEXT = 'Metres per sec: ';
const SPEED_DISPLAY_DECIMAL_PLACES = 2;
const SPEED_GUESS_TEXT_NAN = 'undetermined';
const SPEED_GUESS_TEXT_VFAST = 'intercity travel';
const SPEED_METRES_PS_TEXT_NAN = 'n/a';
const SPEED_MPS_NAME = 'speed_mps';

const WHERES_NORTH_ARROW_NAME = 'wheres_north_arrow';
const RADIUS_SCALE_NAME = 'radius_scale';
const TOGGLE_SHOW_NEARDEST_COMMONNAME_NAME = 'show_neardest_commonname';
const TOGGLE_SHOW_NEARDEST_COMMONNAME_NEARDEST = 'neardest';
const TOGGLE_SHOW_NEARDEST_COMMONNAME_COMMONNAME = 'commonname';
const TOGGLE_SHOW_NEARDEST_COMMONNAME_NEITHER = 'neither';
const TOGGLE_SHOW_NEARDEST_COMMONNAME_BOTH = 'both';
const TOGGLE_LOOKING_AT_NEARDEST = 'neardest';
const TOGGLE_LOOKING_AT_COMMONNAME = 'commonname';

const RECT_LAT_NAME = 'rectangle-latitude';
const RECT_LON_NAME = 'rectangle-longitude';
const RECT_HEADING_NAME = 'rectangle-heading';
const RECT_WIDTH_NAME = 'rectangle-width';
const RECT_LENGTH_NAME = 'rectangle-length';
const RECT_STANDARD_WIDTH = 200;
const DIR_LEFT = 'L';
const DIR_RIGHT = 'R';
const DIR_TOP = 'T';
const DIR_BOTTOM = 'B';

const LAT = 0;
const LON = 1;

const FAKE_SRC_PECKHAM = 'peckham';
const FAKE_SRC_PICCADILLY = 'piccadilly';
const FAKE_SRC_TRAFALGAR = 'trafalgar';
const FAKE_SRC_HIGHBURYCORNER = 'highburycorner';
const FAKE_DATA_SOURCE = FAKE_SRC_TRAFALGAR;

//
// Globals (middle)
//
var tracked_positions = [];

//
// setup helpers (middle)
//
function eztflHtml5_setup()
{
    'use strict';

    setup_tracked_positions(NUM_TRACKED_POSITIONS);
    getLocationSetup();
    setToggleNeardestCommonname(TOGGLE_SHOW_NEARDEST_COMMONNAME_BOTH);
}

//
// geolocation helpers (middle)
//
function getLocationSetup()
{
    'use strict';

    if (FAKE_POSITION === true) {
	runAsFake();

    } else if (navigator.geolocation) {
	navigator.geolocation.watchPosition(mainLoop, cannotWatchPosition);

    } else {
	alert(STR_GEOLOC_NOT_SUPPORTED);
    }
}

function cannotWatchPosition(positionError)
{
    'use strict';
    var msg;

    switch (positionError.code) {
    case positionError.PERMISSION_DENIED:
	msg = 'User denied the request for Geolocation.';
	break;
    case positionError.POSITION_UNAVAILABLE:
	msg = 'Location information is unavailable.';
	break;
    case positionError.TIMEOUT:
	msg = 'The request to get user location timed out.';
	break;
    case positionError.UNKNOWN_ERROR:
	msg = 'An unknown error occurred.';
	break;
    }
    alert('Failed to start geolocation. Error:"' + msg + '"');
}

//-------------------------------------------------------------
//
// Fake data helpers (front end)
//
function runAsFake()
{
    'use strict';
    var data;
    var position = {};

    data = fakeData(FAKE_DATA_SOURCE);

    position = {};
    position.coords = {};
    position.coords.latitude = data[0];
    position.coords.longitude = data[1];
    position.timestamp = 1193421444000;
    positionPush(NUM_TRACKED_POSITIONS, position);
    position = {};
    position.coords = {};
    position.coords.latitude = data[2];
    position.coords.longitude = data[3];
    position.timestamp = 1193421460000;
    mainLoop(position);
}

function fakeData(source)
{
    'use strict';

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
    case (FAKE_SRC_HIGHBURYCORNER):
	// where naptan and sms arrivals were different
	return [51.545838, -0.102309, 51.546098, -0.103039];
    }
}

//-------------------------------------------------------------
//
// trigonometry helpers (middle and front)
//
function se_deg2rad(deg)
{
    'use strict';

    return deg * (Math.PI / 180);
}

function se_rad2deg(n)
{
    'use strict';

    return n * (180 / Math.PI);
}

function getAngle(position1, position2)
{
    'use strict';

    return se_getAngle(position1.coords.latitude,
		       position1.coords.longitude,
		       position2.coords.latitude,
		       position2.coords.longitude);
}

function se_getAngle(startLat, startLong, endLat, endLong)
{
    'use strict';

    startLat = se_deg2rad(startLat);
    startLong = se_deg2rad(startLong);
    endLat = se_deg2rad(endLat);
    endLong = se_deg2rad(endLong);

    var dLong = endLong - startLong;

    var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) /
			Math.tan(startLat / 2.0 + Math.PI / 4.0));
    if (Math.abs(dLong) > Math.PI) {
	if (dLong > 0.0)
	    dLong = -(2.0 * Math.PI - dLong);
	else
	    dLong = (2.0 * Math.PI + dLong);
    }

    return (se_rad2deg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
}

function getDistanceInMetres(position1, position2)
{
    'use strict';
    return (se_getDistanceFromLatLonInKm(position1.coords.latitude,
					 position1.coords.longitude,
					 position2.coords.latitude,
					 position2.coords.longitude) *
	    1000);
}

function se_getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)
{
    'use strict';
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

function se_calculateNewPostionFromBearingDistance(lat, lng, bearing, distance_in_metres)
{
    'use strict';
    var R = EARTH_RADIUS_IN_KM;

    var distance_in_kilometres = distance_in_metres / 1000;

    var lat2 = Math.asin(Math.sin(Math.PI / 180 * lat) * Math.cos(distance_in_kilometres / R) +
			 Math.cos(Math.PI / 180 * lat) * Math.sin(distance_in_kilometres / R) *
			 Math.cos(Math.PI / 180 * bearing));
    var lon2 = Math.PI / 180 * lng + Math.atan2(Math.sin(Math.PI / 180 * bearing) *
						Math.sin(distance_in_kilometres / R) *
						Math.cos(Math.PI / 180 * lat ),
						Math.cos(distance_in_kilometres / R) -
						Math.sin(Math.PI / 180 * lat) *
						Math.sin(lat2));
    return [180 / Math.PI * lat2, 180 / Math.PI * lon2];
}

function se_averageBearing(set)
{
    'use strict';
    var x;
    var y;
    var idx;

    x = 0;
    y = 0;
    for (idx = 0; idx < set.length; idx++) {
	x += Math.cos(se_deg2rad(set[idx]));
	y += Math.sin(se_deg2rad(set[idx]));
    }

    return (se_rad2deg(Math.atan2(y, x)));
}

//-------------------------------------------------------------
//
// rendering (front)
//
function renderGenericDivCore(parent, name, text, onclick_handler, eztflClass, positionArr)
{
    'use strict';
    // Consider if it would be better to copy this code and shape
    // it to handling a specific element
    var paragraph;
    var node;
    var div;
    var el;

    // second time around, so test if we've already got it 1st
    el = document.getElementById(name);
    if (!el) {
	// first time around there are no divs to look at so create them.
	paragraph = document.createElement('p');
	paragraph.setAttribute('id', name);
	if (positionArr !== null) {
	    paragraph.style.position = 'fixed';
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

	paragraph.style.marginTop = '0px';
	paragraph.style.marginBottom = '0px';

	div = document.getElementById(parent);
	div.appendChild(paragraph);

    } else {
	// second time around so update instead
	paragraph = el;
	if (positionArr !== null) {
	    paragraph.style.left = positionArr[0] + 'px';
	    paragraph.style.top = positionArr[1] + 'px';
	}
    }
}

function renderBusStop(parent, name, text, onclick_handler, eztflClass, positionArr)
{
    'use strict';
    var scaledPositions;

    if (positionArr !== null) {
	scaledPositions = scaleRingToRenderfield(positionArr, RING0, null);

    } else {
	scaledPositions = null;
    }
    renderGenericDivCore(parent, name, text, onclick_handler, eztflClass, scaledPositions);
}

function renderBusStops()
{
    'use strict';
    var busstopData;
    var text;
    var id;
    var stop_count;
    var busstop;
    var routeno;
    var busstop_naptan_class;
    var deletable;
    var positionsWithLog;
    var bearing;
    var positions;
    var heading;
    var bumpArray = [];
    var routenosArray = [];
    var routenosArrayIdx = [];
    var numRoutes;
    var numOnLine;
    var div;
    var tbl;
    var tbdy;
    var tr;
    var td;
    var nrDstFound;
    var cmnNmFound;
    var towardsArr = [];
    var towardsArrIdx;
    var newTowardsArr = [];
    var commonNameArr = [];
    var commonNameArrIdx;
    var newCommonNameArr = [];
    var avgBearing;
    var classNames;
    var classNamesIdx;
    var neardest_onclick;
    var busstopNos;
    var busstopNosIdx;
    var naptans;
    var naptansIdx;
    var toggle;
    var toggle_action;
    var orphans;
    var list;
    var found;
    var a;
    var tmp;

    busstopData = getNotedBusStops();
    bumpomaticSetup(bumpArray);

    // Render new bus stop info
    heading = getComboHeading();
    setWheresNorthArrow(heading);
    deletable = getDeletableForClass(CLASS_BUSSTOP_NAME);

    stop_count = 0;
    for (busstop = 0; busstop < busstopData.length; busstop++) {
	// note bus stop going to be used, remove old name if present
	busstop_naptan_class = CLASS_BUSSTOP_NAPTAN_NAME + busstopData[busstop].naptanId;
	id = ID_BUSSTOP_NAME + busstopData[busstop].naptanId;
	deletable[id] = false;
	bumpomaticDeleteById(bumpArray, id);

	// get positioning info
	bearing = se_getAngle(busstopData[busstop].originLatitude, busstopData[busstop].originLongitude,
			      busstopData[busstop].lat, busstopData[busstop].lon);
	bearing += heading;
	bearing = modulo(bearing, 360);

	positions = getPositionOnRing(bearing);
	positionsWithLog = scalePositionsUsingLog(bearing, positions, busstopData[busstop].distance);

	// fill in for ring 0 -- the stop letter
	text = adjustStopLetter(busstopData[busstop].stopLetter);
	renderBusStop(RENDERING_FIELD_NAME, id, text,
		      'loadCountdown("' + busstopData[busstop].naptanId + '")',
		      CLASS_BUSSTOP_NAME + ' ' + busstop_naptan_class,
		      positionsWithLog);
	bumpomaticAddById(bumpArray, id);

	// Construct array of unique bus numbers that'll be on screen
	for (routeno = 0; routeno < busstopData[busstop].lines.length; routeno++) {
	    routenosArrayIdx = 0;
	    while (routenosArrayIdx < routenosArray.length &&
		   routenosArray[routenosArrayIdx].name !== busstopData[busstop].lines[routeno].name) {
		routenosArrayIdx++;
	    }

	    if (routenosArrayIdx === routenosArray.length) {
		routenosArray.push({
		    id: ID_ROUTE_NAME + busstopData[busstop].naptanId + '_' + busstopData[busstop].lines[routeno].name,
		    name: busstopData[busstop].lines[routeno].name,
		    naptans: [busstopData[busstop].naptanId]
		});

	    } else {
		routenosArray[routenosArrayIdx].naptans.push(busstopData[busstop].naptanId);
	    }
	}

	// construct array of unique near destinations
	newTowardsArr = decomposeNearDestinations(busstopData[busstop].towards);
	for (var newTowardsArrIdx = 0; newTowardsArrIdx < newTowardsArr.length; newTowardsArrIdx++) {
	    nrDstFound = false;
	    for (towardsArrIdx = 0; towardsArrIdx < towardsArr.length; towardsArrIdx++) {
		if (towardsArr[towardsArrIdx].towards === newTowardsArr[newTowardsArrIdx]) {
		    towardsArr[towardsArrIdx].bearing.push(bearing);
		    towardsArr[towardsArrIdx].classNames.push(busstop_naptan_class);
		    towardsArr[towardsArrIdx].busstopNos.push(id);
		    nrDstFound = true;
		}
	    }
	    if (nrDstFound === false) {
		towardsArr[towardsArrIdx] = {
		    towards: newTowardsArr[newTowardsArrIdx],
		    classNames: [busstop_naptan_class],
		    bearing: [bearing],
		    busstopNos: [id],
		    data: busstopData[busstop]
		};
	    }
	}

	// construct array of unique common names
	newCommonNameArr = busstopData[busstop].commonName;
	for (var newCommonNameArrIdx = 0; newCommonNameArrIdx < newCommonNameArr.length; newCommonNameArrIdx++) {
	    cmnNmFound = false;
	    for (commonNameArrIdx = 0; commonNameArrIdx < commonNameArr.length; commonNameArrIdx++) {
		if (commonNameArr[commonNameArrIdx].commonName === newCommonNameArr[newCommonNameArrIdx]) {
		    commonNameArr[commonNameArrIdx].bearing.push(bearing);
		    commonNameArr[commonNameArrIdx].classNames.push(busstop_naptan_class);
		    commonNameArr[commonNameArrIdx].busstopNos.push(id);
		    cmnNmFound = true;
		}
	    }
	    if (cmnNmFound === false) {
		commonNameArr[commonNameArrIdx] = {
		    commonName: newCommonNameArr[newCommonNameArrIdx],
		    classNames: [busstop_naptan_class],
		    bearing: [bearing],
		    busstopNos: [id],
		    data: busstopData[busstop]
		};
	    }
	}

	stop_count++;
    }
    cleanDeletable(deletable);

    // fill in the near destinations on ring 2
    toggle = getToggleNeardestCommonname(TOGGLE_SHOW_NEARDEST_COMMONNAME_NAME);
    toggle_action = getToggleAction(toggle, TOGGLE_LOOKING_AT_NEARDEST);
    deletable = getDeletableForClass(CLASS_NEARDEST_NAME);
    for (towardsArrIdx = 0; towardsArrIdx < towardsArr.length; towardsArrIdx++) {
	id = ID_NEARDEST_NAME + towardsArr[towardsArrIdx].data.naptanId;
	deletable[id] = false;
	bumpomaticDeleteById(bumpArray, id);

	if (towardsArr[towardsArrIdx].bearing.length === 0) {
	    alert('No bearings gonna crash');
	}
	avgBearing = se_averageBearing(towardsArr[towardsArrIdx].bearing);
	avgBearing = modulo(avgBearing, 360);
	positions = getPositionOnRing(avgBearing);

	text = towardsArr[towardsArrIdx].towards;

	classNames = '';
	for (classNamesIdx = 0; classNamesIdx < towardsArr[towardsArrIdx].classNames.length; classNamesIdx++) {
	    classNames += towardsArr[towardsArrIdx].classNames[classNamesIdx] + ' ';
	}

	busstopNos = '';
	neardest_onclick = null;
	for (busstopNosIdx = 0; busstopNosIdx < towardsArr[towardsArrIdx].busstopNos.length; busstopNosIdx++) {
	    busstopNos += towardsArr[towardsArrIdx].busstopNos[busstopNosIdx] + ' ';
	}
	if (busstopNos !== '') {
	    neardest_onclick = 'selectNearDestination("' + busstopNos.trim() + '")';
	}

	renderNearDestination(RENDERING_FIELD_NAME, id, text, neardest_onclick, CLASS_NEARDEST_NAME + ' ' + classNames.trim(), avgBearing, positions, toggle_action);
	bumpomaticAddById(bumpArray, id);
    }
    cleanDeletable(deletable);

    // fill in the common names on ring 2
    deletable = getDeletableForClass(CLASS_COMMONNAME_NAME);
    toggle_action = getToggleAction(toggle, TOGGLE_LOOKING_AT_COMMONNAME);
    for (commonNameArrIdx = 0; commonNameArrIdx < commonNameArr.length; commonNameArrIdx++) {
	id = ID_COMMONNAMEDIR_NAME + commonNameArr[commonNameArrIdx].data.naptanId;
	deletable[id] = false;
	bumpomaticDeleteById(bumpArray, id);

	if (commonNameArr[commonNameArrIdx].bearing.length === 0) {
	    alert('No bearings gonna crash');
	}
	avgBearing = se_averageBearing(commonNameArr[commonNameArrIdx].bearing);
	avgBearing = modulo(avgBearing, 360);
	positions = getPositionOnRing(avgBearing);

	text = commonNameArr[commonNameArrIdx].commonName;

	classNames = '';
	for (classNamesIdx = 0; classNamesIdx < commonNameArr[commonNameArrIdx].classNames.length; classNamesIdx++) {
	    classNames += commonNameArr[commonNameArrIdx].classNames[classNamesIdx] + ' ';
	}

	busstopNos = '';
	neardest_onclick = null;
	for (busstopNosIdx = 0; busstopNosIdx < commonNameArr[commonNameArrIdx].busstopNos.length; busstopNosIdx++) {
	    busstopNos += commonNameArr[commonNameArrIdx].busstopNos[busstopNosIdx] + ' ';
	}
	if (busstopNos !== '') {
	    neardest_onclick = 'selectNearDestination("' + busstopNos.trim() + '")';
	}

	renderNearDestination(RENDERING_FIELD_NAME, id, text, neardest_onclick, CLASS_COMMONNAME_NAME + ' ' + classNames.trim(), avgBearing, positions, toggle_action);
	bumpomaticAddById(bumpArray, id);
    }
    cleanDeletable(deletable);

    // now get the route numbers into new or existing paragraphs
    deletable = getDeletableForClass(CLASS_ROUTE_NAME);
    if (routenosArray.length) {
	sortRoutenosTable(routenosArray);
	for (numRoutes = 0; numRoutes < routenosArray.length; numRoutes += ROUTENOS_TABLE_WIDTH) {
	    for (numOnLine = numRoutes; numOnLine < numRoutes + ROUTENOS_TABLE_WIDTH; numOnLine++) {
		if (numOnLine < routenosArray.length) {
		    naptans = '';
		    for (naptansIdx = 0; naptansIdx < routenosArray[numOnLine].naptans.length; naptansIdx++) {
			naptans += ID_BUSSTOP_NAME + routenosArray[numOnLine].naptans[naptansIdx] + ' ';
		    }
		    id = ID_ROUTE_NAME + routenosArray[numOnLine].name;
		    deletable[id] = false;
		    text = routenosArray[numOnLine].name;
		    renderBusStop(RENDERING_FIELD_NAME, id, text,
				  'selectBusStop("' + naptans.trim() + '")',
				  CLASS_ROUTE_NAME,
				  null);
		}
	    }
	}
    }
    cleanDeletable(deletable);

    // if those paragraphs are in the existing table, remove them
    orphans = [];
    list = document.getElementsByClassName(CLASS_ROUTE_NAME);
    while(list.length) {
	orphans.push(list[0].parentNode.removeChild(list[0]));
    }
    found = true;
    while(found) {
	found = false;
	for (a = 0; a < orphans.length - 1; a++) {
	    if (orphans[a].id > orphans[a + 1].id) {
		tmp = orphans[a];
		orphans[a] = orphans[a + 1];
		orphans[a + 1] = tmp;
		found = true;
	    }
	}
    }

    // remove the existing table structure wholesale
    renderRemoveElementsById(ID_ROUTE_TABLE_NAME);
    renderRemoveElementsByClass(ID_ROUTE_DIV_NAME);

    // now reattach the paragraphs into a whole new table
    if (routenosArray.length) {
	div = document.getElementById(ID_ROUTE_DIV_NAME);
	tbl = document.createElement('table');
	tbl.style.width = '100%';
	tbl.setAttribute('id', ID_ROUTE_TABLE_NAME);
	tbdy = document.createElement('tbody');
	for (numRoutes = 0; numRoutes < routenosArray.length; numRoutes += ROUTENOS_TABLE_WIDTH) {
	    tr = document.createElement('tr');
	    for (numOnLine = numRoutes; numOnLine < numRoutes + ROUTENOS_TABLE_WIDTH; numOnLine++) {
		if (numOnLine < routenosArray.length) {
		    td = document.createElement('td');
		    td.setAttribute('class', CLASS_ROUTE_CELL_NAME);
		    td.appendChild(orphans.shift());
		    tr.appendChild(td);
		}
	    }
	    tbdy.appendChild(tr);
	}
	tbl.appendChild(tbdy);
	div.appendChild(tbl);
    }
}

function renderNearDestination(parent, name, text, onclick_handler, eztflClass, bearing, positionArr, toggle_action)
{
    'use strict';
    var scaledPositions;

    if (positionArr !== null) {
	scaledPositions = scaleRingToRenderfield(positionArr, RING2, bearing);
    }
    renderNearDestinationCore(parent, name, text, onclick_handler, eztflClass, scaledPositions, toggle_action);
}

function renderNearDestinationCore(parent, name, text, onclick_handler, eztflClass, positionArr, toggle_action)
{
    'use strict';
    var paragraph;
    var node;
    var div;
    var el;

    // second time around, so test if we've already got it 1st
    el = document.getElementById(name);
    if (!el) {
	// first time around there are no divs to look at so create them.
	paragraph = document.createElement('p');
	paragraph.setAttribute('id', name);
	if (positionArr !== null) {
	    paragraph.style.position = 'fixed';
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

	if (paragraph.offsetLeft + paragraph.clientWidth > RENDERFIELD_WIDTH) {
	    paragraph.style.left = RENDERFIELD_WIDTH - paragraph.clientWidth + 'px';
	}
	if (paragraph.offsetTop + paragraph.clientHeight > RENDERFIELD_HEIGHT) {
	    paragraph.style.top = RENDERFIELD_HEIGHT - paragraph.clientHeight + 'px';
	}
	paragraph.style.marginTop = '0px';
	paragraph.style.marginBottom = '0px';

    } else {
	// Otherwise we do have them, so merely update them
	paragraph = el;
	if (positionArr !== null) {
	    paragraph.style.left = positionArr[0] + 'px';
	    paragraph.style.top = positionArr[1] + 'px';
	}
	if (paragraph.offsetLeft + paragraph.clientWidth > RENDERFIELD_WIDTH) {
	    paragraph.style.left = RENDERFIELD_WIDTH - paragraph.clientWidth + 'px';
	}
	if (paragraph.offsetTop + paragraph.clientHeight > RENDERFIELD_HEIGHT) {
	    paragraph.style.top = RENDERFIELD_HEIGHT - paragraph.clientHeight + 'px';
	}
    }

    paragraph.style.display = toggle_action;
}

function renderCountdown(naptan)
{
    'use strict';
    var countdownData = JSON.parse(sessionStorage.getItem(NOTED_COUNTDOWN_NAME));
    var text;
    var id;
    var arrival;
    var count;
    var deletable;

    // display all the new countdown data
    deletable = getDeletableForClass(CLASS_COUNTDOWN_NAME);
    count = 0;
    for (arrival = 0; arrival < countdownData.length; arrival++) {
	id = ID_ARRIVAL_NAME + countdownData[arrival].id;
	deletable[id] = false;

	text = countdownData[arrival].lineName + ' in ' + Math.round(countdownData[arrival].timeToStation / 60);

	if (text !== '') {
	    renderRemoveElementsById(id);
	    renderGenericDivCore(RENDERING_FIELD_NAME, id, text, null, CLASS_COUNTDOWN_NAME + ' busstop_' + naptan, null);
	}

	count++;
    }
    cleanDeletable(deletable);
}

// render helpers

function renderRemoveElementsById(id)
{
    'use strict';
    var child;

    // now we remove the first
    // removeChild_4
    if (document.getElementById(id)) {
	child = document.getElementById(id);
	child.parentNode.removeChild(child);
    }
}

function renderRemoveElementsByClass(className)
{
    'use strict';
    var list;

    // now we remove the first
    // removeChild_5
    list = document.getElementsByClassName(className);
    while(list.length) {
	list[0].parentNode.removeChild(list[0]);
    }
}

//-------------------------------------------------------------
//
// Positioning (front)
//
function getPositionOnRing(bearing)
{
    'use strict';
    var idx;

    // convert it into the location on the egg
    idx = 0;
    while (RINGMAP[idx] < bearing) {
	idx += 3;
    }
    return [RINGMAP[idx + 1], RINGMAP[idx + 2]];
}

function scaleRingToRenderfield(positionArr, ringno, bearing)
{
    'use strict';
    var xoff;
    var yoff;
    var scaledPositionsArr = [];
    var ratio;

    if (ringno === 0) {
	// centre ring for stop letters
	xoff = (PREDICTION_POINT_X - (EGG_WIDTH / (DIVISOR_FOR_RING3 * 2)));
	yoff = (PREDICTION_POINT_Y - (EGG_WIDTH / (DIVISOR_FOR_RING3 * 2)));
	scaledPositionsArr[0] = positionArr[0] / DIVISOR_FOR_RING3 + xoff;
	scaledPositionsArr[1] = positionArr[1] / DIVISOR_FOR_RING3 + yoff;

    } else if (ringno === 1) {
	// middle ring for route numbers
	xoff = (PREDICTION_POINT_X - (EGG_WIDTH / (DIVISOR_FOR_RING2 * 2)));
	yoff = (PREDICTION_POINT_Y - (EGG_WIDTH / (DIVISOR_FOR_RING2 * 2)));
	scaledPositionsArr[0] = positionArr[0] / DIVISOR_FOR_RING2 + xoff;
	scaledPositionsArr[1] = positionArr[1] / DIVISOR_FOR_RING2 + yoff;

    } else if (ringno === 2) {
	// scale to within the renderfield
	scaledPositionsArr[0] = RENDERFIELD_WIDTH / EGG_WIDTH * positionArr[0];
	scaledPositionsArr[1] = RENDERFIELD_HEIGHT / EGG_HEIGHT * positionArr[1];

	// how far is this point from the prediction point?
	xoff = Math.abs(PREDICTION_POINT_X - scaledPositionsArr[0]);
	yoff = Math.abs(PREDICTION_POINT_Y - scaledPositionsArr[1]);
	ratio = xoff / yoff;

	// adjust that point outwards until we hit the edge
	if (bearing <= 90) {
	    while (scaledPositionsArr[0] < RENDERFIELD_WIDTH && scaledPositionsArr[1] > 0) {
		scaledPositionsArr[0] += ratio;
		scaledPositionsArr[1]--;
	    }

	} else if (bearing <= 180) {
	    while (scaledPositionsArr[0] < RENDERFIELD_WIDTH && scaledPositionsArr[1] < RENDERFIELD_HEIGHT) {
		scaledPositionsArr[0] += ratio;
		scaledPositionsArr[1]++;
	    }

	} else if (bearing <= 270) {
	    while (scaledPositionsArr[0] > 0 && scaledPositionsArr[1] < RENDERFIELD_HEIGHT) {
		scaledPositionsArr[0] -= ratio;
		scaledPositionsArr[1]++;
	    }

	} else if (bearing <= 360) {
	    while (scaledPositionsArr[0] > 0 && scaledPositionsArr[1] > 0) {
		scaledPositionsArr[0] -= ratio;
		scaledPositionsArr[1]--;
	    }
	}

	// clean up if we stepped beyond the renderfield
	scaledPositionsArr[0] = (scaledPositionsArr[0] < 0) ? 0 : scaledPositionsArr[0];
	scaledPositionsArr[0] = (scaledPositionsArr[0] > RENDERFIELD_WIDTH) ? RENDERFIELD_WIDTH : scaledPositionsArr[0];
	scaledPositionsArr[1] = (scaledPositionsArr[1] < 0) ? 0 : scaledPositionsArr[1];
	scaledPositionsArr[1] = (scaledPositionsArr[1] > RENDERFIELD_HEIGHT) ? RENDERFIELD_HEIGHT : scaledPositionsArr[1];
    } // Should not be any other ringno

    return scaledPositionsArr;
}

function scalePositionsUsingLog(bearing, positions, busstopDistance)
{
    'use strict';
    var full;
    var part;
    var logMultiplier;
    var ringx;
    var ringy;
    var originx;
    var originy;

    ringx = positions[0];
    ringy = positions[1];

    // obtain the prediction point on the egg
    originx = EGG_WIDTH / 2;
    originy = PREDICTION_POINT_Y * 3;

    // now get the log as if we're on the radius, and another
    // as if we're on an internal point. That gives us a
    // multiplier
    full = Math.log(sessionStorage.getItem(RADIUS_NAME));
    part = Math.log(busstopDistance);
    logMultiplier = 1 / full * part;

    // now apply that multiplier to the position we'll show
    if (bearing <= 90) {
	ringx = ((ringx - originx) * logMultiplier) + originx;
	ringy = originy - ((originy - ringy) * logMultiplier);

    } else if (bearing <= 180) {
	ringx = ((ringx - originx) * logMultiplier) + originx;
	ringy = ((ringy - originy) * logMultiplier) + originy;

    } else if (bearing <= 270) {
	ringx = originx - ((originx - ringx) * logMultiplier);
	ringy = ((ringy - originy) * logMultiplier) + originy;

    } else if (bearing <= 360) {
	ringx = originx - ((originx - ringx) * logMultiplier);
	ringy = originy - ((originy - ringy) * logMultiplier);
    }

    return [ringx, ringy];
}

//-------------------------------------------------------------
//
// prediction helpers (middle)
//
function getBusstopsInsideRectangle(lat, lon, heading, width, length)
{
    'use strict';
    var just_these;
    var likely_these;
    var all_london;
    var shape = [];

    all_london = getNotedBusStops();
    likely_these = getMostLikely(all_london);

    // create array of coords describing rectangle starting at 3 o'clock positon
    // from lat,lon and moving clockwise.
    shape.push(se_calculateNewPostionFromBearingDistance(lat, lon, modulo(heading + 270, 360), width / 2));
    shape.push(se_calculateNewPostionFromBearingDistance(shape[0][LAT], shape[0][LON], heading, length));
    shape.push(se_calculateNewPostionFromBearingDistance(shape[1][LAT], shape[1][LON], modulo(heading + 90, 360), width));
    shape.push(se_calculateNewPostionFromBearingDistance(shape[2][LAT], shape[2][LON], modulo(heading + 180, 360), length));

    just_these = getBusstopsInsideArbitraryShape(likely_these, shape, lat, lon, heading, width, length);

    setNotedBusStops(just_these);
}

function getMostLikely(all)
{
    // We might start with all of London - here we could get just those
    // likely to be in area.
    // For the mo, skip this step
    'use strict';
    var some;

    some = all;
    return some;
}

// What's the minimum x or y used in the shape?
function getShapeMin(shape, axis)
{
    'use strict';
    var min;
    var a;

    min = shape[0][axis];
    for (a = 1; a < shape.length - 1; a++) {
	if (shape[a][axis] < min)
	    min = shape[a][axis];
    }

    return min;
}

// What's the maximum x or y used in the shape?
function getShapeMax(shape, axis)
{
    'use strict';
    var max;
    var a;

    max = shape[0][axis];
    for (a = 1; a < shape.length - 1; a++) {
	if (shape[a][axis] > max)
	    max = shape[a][axis];
    }

    return max;
}

function getBusstopsInsideArbitraryShape(busstops_arr, shape, lat, lon, heading, width, length)
{
    'use strict';
    var busstops_out_arr = [];
    var idx;
    var dir;
    var min;
    var vectors_idx;
    var shape_gbt_left, shape_gbt_right, shape_gbt_top, shape_gbt_bottom;
    var dist_to_shape_gbt_l, dist_to_shape_gbt_r, dist_to_shape_gbt_t, dist_to_shape_gbt_b;
    var traverse_x, traverse_y;
    var x1_x2, y1_y2;
    var xratio, yratio;
    var num_traversals;

    // repeat the first coord at the end: this eases last->first calculations
    shape.push(shape[0]);
    shape_gbt_left = getShapeMin(shape, LON);
    shape_gbt_right = getShapeMax(shape, LON);
    shape_gbt_top = getShapeMax(shape, LAT);
    shape_gbt_bottom = getShapeMin(shape, LAT);

    // consider each bus stop in turn
    for (idx = 0; idx < busstops_arr.length; idx++) {
	// gross box applied to whole shape
	if (busstops_arr[idx].lon < shape_gbt_left) {
	    continue;
	}
	if (busstops_arr[idx].lon > shape_gbt_right) {
	    continue;
	}
	if (busstops_arr[idx].lat > shape_gbt_top) {
	    continue;
	}
	if (busstops_arr[idx].lat < shape_gbt_bottom) {
	    continue;
	}

	// Which side of the shape_gbt is nearest to lat/lon? Using that
	// side likely means less processing as fewer opportunities for
	// a vector to get between lat/lon and that side
	dist_to_shape_gbt_l = busstops_arr[idx].lon - shape_gbt_left;
	dist_to_shape_gbt_r = shape_gbt_right - busstops_arr[idx].lon;
	dist_to_shape_gbt_t = shape_gbt_top - busstops_arr[idx].lat;
	dist_to_shape_gbt_b = busstops_arr[idx].lat - shape_gbt_bottom;
	min = dist_to_shape_gbt_l;
	dir = DIR_LEFT;
	if (dist_to_shape_gbt_r < min) {
	    min  = dist_to_shape_gbt_r;
	    dir = DIR_RIGHT;
	}
	if (dist_to_shape_gbt_t < min) {
	    min = dist_to_shape_gbt_t;
	    dir = DIR_TOP;
	}
	if (dist_to_shape_gbt_b < min) {
	    min = dist_to_shape_gbt_b;
	    dir = DIR_BOTTOM;
	}

	// look through each vector in the shape to see if affects the inside/outside question
	num_traversals = 0;
	for (vectors_idx = 0; vectors_idx < shape.length - 1; vectors_idx++) {
	    // apply gross box technique to the vector. Could be improved
	    // by doing Min/Max work before looking at first bus stop
	    if (busstops_arr[idx].lon > Math.max(shape[vectors_idx][LON], shape[vectors_idx + 1][LON])) {
		continue;
	    }
	    if (busstops_arr[idx].lon < Math.min(shape[vectors_idx][LON], shape[vectors_idx + 1][LON])) {
		continue;
	    }
	    if (busstops_arr[idx].lat < Math.min(shape[vectors_idx][LAT], shape[vectors_idx + 1][LAT])) {
		continue;
	    }
	    if (busstops_arr[idx].lat > Math.max(shape[vectors_idx][LAT], shape[vectors_idx + 1][LAT])) {
		continue;
	    }

	    // Lat/lon shares axes with the vector. Calculate if the vector
	    // traverses the axis between the point and the nearest shape GBT side

	    // Calculate the ratio of X and Y lengths of the vector_gbt
	    x1_x2 = (Math.abs(shape[vectors_idx][LAT] - shape[vectors_idx + 1][LAT])) / 100;
	    y1_y2 = (Math.abs(shape[vectors_idx][LON] - shape[vectors_idx + 1][LON])) / 100;
	    xratio = (busstops_arr[idx].lon - Math.min(shape[vectors_idx][LON], shape[vectors_idx + 1][LON])) * x1_x2;
	    yratio = (busstops_arr[idx].lat - Math.min(shape[vectors_idx][LAT], shape[vectors_idx + 1][LAT])) * y1_y2;

	    // Calculate the value of Y where the vector traverses M's x-axis, ditto
	    // for the value of X where the vector traverses M's y-axis
	    traverse_x = shape[vectors_idx][LAT] + (x1_x2 * yratio);
	    traverse_y = shape[vectors_idx][LON] + (y1_y2 * xratio);

	    // now we know where it traverses, does it happen between the
	    // point and the nearest shape_gbt side? If so, we have a
	    // traversal to count.
	    if (dir === DIR_LEFT && traverse_x < shape[vectors_idx][LAT]) {
		num_traversals++;

	    } else if (dir === DIR_RIGHT && traverse_x > shape[vectors_idx + 1][LAT]) {
		num_traversals++;

	    } else if (dir === DIR_TOP && traverse_y > shape[vectors_idx][LON]) {
		num_traversals++;

	    } else if (dir === DIR_BOTTOM && traverse_y > shape[vectors_idx + 1][LON]) {
		num_traversals++;
	    }
	}

	// If the number of traversals is odd, then the point lies
	// inside the area, and so should be counted
	if (Math.abs(num_traversals % 2) === 1) {
	    busstops_out_arr.push(busstops_arr[idx]);
	}
    }

    return busstops_out_arr;
}

function updateForNewPrediction(num_positions_tracked)
{
    'use strict';
    var early_position = [];
    var latest_position = [];
    var distance_in_metres;
    var devices_heading;
    var speed_in_metres_per_second;
    var lat_lon_pair;
    var prediction_method;

    if (num_positions_tracked < 2)
	return [STR_GEOLOC_WAITING];

    early_position = tracked_positions[NUM_TRACKED_POSITIONS -
				       num_positions_tracked];
    latest_position = tracked_positions[NUM_TRACKED_POSITIONS - 1];

    distance_in_metres = getDistanceInMetres(early_position, latest_position);

    devices_heading = getAngle(early_position, latest_position);
    setDevicesHeading(devices_heading);

    speed_in_metres_per_second = getSpeedInMetresPerSecond(early_position,
							   latest_position,
							   distance_in_metres);
    setSpeedDisplayed(speed_in_metres_per_second);
    setGuessedTransportMode(speed_in_metres_per_second);
    if (speed_in_metres_per_second < SPEED_WALKING_BELOW) {
	prediction_method = PREDICTION_METHOD_SIMPLEST;

    } else {
	prediction_method = PREDICTION_METHOD_RECTANGLE_IN_RADIUS;
    }

    lat_lon_pair = se_calculateNewPostionFromBearingDistance(latest_position.coords.latitude,
							     latest_position.coords.longitude,
							     devices_heading,
							     speed_in_metres_per_second * DEFAULT_LOOKAHEAD_SECS);

    switch (prediction_method) {
	// I'm thinking here of cases that don't involve an initial
	// radius look-up at tfl

	// And these cases that do
    case PREDICTION_METHOD_SIMPLEST:
    case PREDICTION_METHOD_RECTANGLE_IN_RADIUS:
	return updateForNewPredictionGenericRadius(num_positions_tracked, early_position, latest_position, distance_in_metres, devices_heading, speed_in_metres_per_second, lat_lon_pair, prediction_method);
    }
}

function updateForNewPredictionGenericRadius(num_positions_tracked, early_position, latest_position, distance_in_metres, devices_heading, speed_in_metres_per_second, lat_lon_pair, prediction_method)
{
    // take first and last coord in stack, ignore rest
    'use strict';
    var url;
    var radius;
    var lat;
    var lon;

    radius = speed_in_metres_per_second * (DEFAULT_LOOKAHEAD_SECS -
					   ((latest_position.timestamp - early_position.timestamp) /
					    1000));
    if (radius < MINIMUM_RADIUS_TO_LOOK) {
	radius = MINIMUM_RADIUS_TO_LOOK;

    } else if (FAKE_POSITION && radius > MAXIMUM_RADIUS_TO_LOOK) {
	radius = MAXIMUM_RADIUS_TO_LOOK;
    }
    radius = Math.round(radius);
    setRadiusScale(radius);

    lat = lat_lon_pair[LAT];
    lon = lat_lon_pair[LON];
    url = RPROXY_URL_BUSSTOPS + '&radius=' + radius + '&lat=' + lat + '&lon=' + lon;
    sessionStorage.setItem(RADIUS_NAME, JSON.stringify(radius));
    sessionStorage.setItem(LATITUDE_NAME, JSON.stringify(lat));
    sessionStorage.setItem(LONGITUDE_NAME, JSON.stringify(lon));
    sessionStorage.setItem(PREDICTION_METHOD_NAME, JSON.stringify(prediction_method));

    sessionStorage.setItem(RECT_HEADING_NAME, JSON.stringify(devices_heading));
    sessionStorage.setItem(RECT_LAT_NAME, JSON.stringify(latest_position.coords.latitude));
    sessionStorage.setItem(RECT_LON_NAME, JSON.stringify(latest_position.coords.longitude));
    sessionStorage.setItem(RECT_WIDTH_NAME, JSON.stringify(RECT_STANDARD_WIDTH));
    sessionStorage.setItem(RECT_LENGTH_NAME, JSON.stringify(radius * 2));

    sendGetCore(url, callback_receiveNewBusStopsFromRadius);

    return url;
}

//-------------------------------------------------------------
//
// User Interface helpers (front)
//

function getDeletableForClass(classname)
{
    'use strict';
    var deletable;
    var extants;
    var idx;

    deletable = [];
    extants = document.getElementsByClassName(classname);
    for (idx = 0; idx < extants.length; idx++) {
	deletable.push(extants[idx].id);
	deletable[extants[idx].id] = extants[idx].id;
    }

    return deletable;
}

function cleanDeletable(deletable)
{
    'use strict';
    var id;
    var el;

    while(deletable.length) {
	id = deletable.shift();
	if (deletable[id] !== false) {
	    el = document.getElementById(id);
	    el.parentNode.removeChild(el);
	}
    }
}

function getToggleNeardestCommonname(name)
{
    'use strict';
    var toggle;

    toggle = JSON.parse(sessionStorage.getItem(name));
    if (toggle === null) {
	toggle = TOGGLE_SHOW_NEARDEST_COMMONNAME_BOTH;
    }
    return toggle;
}

function setToggleNeardestCommonname(toggle)
{
    'use strict';

    sessionStorage.setItem(TOGGLE_SHOW_NEARDEST_COMMONNAME_NAME, JSON.stringify(toggle));
}

function updateToggleNeardestCommonname(toggle)
{
    'use strict';

    if (toggle === TOGGLE_SHOW_NEARDEST_COMMONNAME_BOTH) {
	toggle = TOGGLE_SHOW_NEARDEST_COMMONNAME_NEARDEST;

    } else if (toggle === TOGGLE_SHOW_NEARDEST_COMMONNAME_NEARDEST) {
	toggle = TOGGLE_SHOW_NEARDEST_COMMONNAME_COMMONNAME;

    } else if (toggle === TOGGLE_SHOW_NEARDEST_COMMONNAME_COMMONNAME) {
	toggle = TOGGLE_SHOW_NEARDEST_COMMONNAME_NEITHER;

    } else {
	toggle = TOGGLE_SHOW_NEARDEST_COMMONNAME_BOTH;
    }
    return toggle;
}

function applyToggleNeardestCommonnameAction(toggle)
{
    'use strict';
    var neardest_action;
    var commonname_action;
    var els;
    var a;

    if (toggle === TOGGLE_SHOW_NEARDEST_COMMONNAME_BOTH) {
	neardest_action = 'block';
	commonname_action = 'block';

    } else if (toggle === TOGGLE_SHOW_NEARDEST_COMMONNAME_NEARDEST) {
	neardest_action = 'block';
	commonname_action = 'none';

    } else if (toggle === TOGGLE_SHOW_NEARDEST_COMMONNAME_COMMONNAME) {
	neardest_action = 'none';
	commonname_action = 'block';

    } else {
	neardest_action = 'none';
	commonname_action = 'none';
    }

    els = document.getElementsByClassName(CLASS_NEARDEST_NAME);
    for(a = 0; a < els.length; a++){
	els[a].style.display = neardest_action;
    }
    els = document.getElementsByClassName(CLASS_COMMONNAME_NAME);
    for(a = 0; a < els.length; a++){
	els[a].style.display = commonname_action;
    }
}

function getToggleAction(toggle, name)
{
    'use strict';
    var action;

    action = null;
    if (name === TOGGLE_LOOKING_AT_NEARDEST) {
	switch (toggle) {
	case TOGGLE_SHOW_NEARDEST_COMMONNAME_BOTH:
	case TOGGLE_SHOW_NEARDEST_COMMONNAME_NEARDEST:
	    action = 'block';
	    break;
	case TOGGLE_SHOW_NEARDEST_COMMONNAME_NEITHER:
	case TOGGLE_SHOW_NEARDEST_COMMONNAME_COMMONNAME:
	    action = 'none';
	    break;

	default:
	}

    } else if (name === TOGGLE_LOOKING_AT_COMMONNAME) {
	switch (toggle) {
	case TOGGLE_SHOW_NEARDEST_COMMONNAME_BOTH:
	case TOGGLE_SHOW_NEARDEST_COMMONNAME_COMMONNAME:
	    action = 'block';
	    break;
	case TOGGLE_SHOW_NEARDEST_COMMONNAME_NEITHER:
	case TOGGLE_SHOW_NEARDEST_COMMONNAME_NEARDEST:
	    action = 'none';
	    break;

	default:
	}
    }
    return action;
}

function toggleNeardestCommonname()
{
    'use strict';
    var toggle;

    toggle = getToggleNeardestCommonname(TOGGLE_SHOW_NEARDEST_COMMONNAME_NAME);
    toggle = updateToggleNeardestCommonname(toggle);
    setToggleNeardestCommonname(toggle);
    applyToggleNeardestCommonnameAction(toggle);
}

//
// what to do if user resets his heading?
//
function resetForcedHeading()
{
    'use strict';
    setForcedHeading(null);
}

function getDevicesHeading()
{
    'use strict';
    return JSON.parse(sessionStorage.getItem(DEVICES_HEADING_NAME));
}

function setDevicesHeading(devices_heading)
{
    'use strict';
    sessionStorage.setItem(DEVICES_HEADING_NAME, JSON.stringify(devices_heading));
}

function getForcedHeading()
{
    'use strict';
    var heading;

    heading = sessionStorage.getItem(FORCED_HEADING_NAME);
    if (heading === null || heading === undefined) {
	return 0;

    } else {
	return JSON.parse(sessionStorage.getItem(FORCED_HEADING_NAME));
    }
}

function setForcedHeading(forced_choice_heading)
{
    'use strict';
    sessionStorage.setItem(FORCED_HEADING_NAME, JSON.stringify(forced_choice_heading));
}

function getComboHeading()
{
    'use strict';
    var device;
    var forced;

    device = getDevicesHeading();
    forced = getForcedHeading();

    return modulo(device + forced, 360);
}

function setNotedBusStops(notedBusStops)
{
    'use strict';

    localStorage.setItem(NOTED_BUSSTOPS_NAME, JSON.stringify(notedBusStops));
}

function getNotedBusStops()
{
    'use strict';
    var busstopData;

    busstopData = localStorage.getItem(NOTED_BUSSTOPS_NAME);
    if (busstopData === null || busstopData === undefined) {
	busstopData = [];

    } else {
	busstopData = JSON.parse(busstopData);
    }
    return busstopData;
}

//
// what to do if user selects a route number?
//
function selectBusStop(naptans)
{
    'use strict';

    clearSelected();
    makeSelected(naptans);
}

//
// what to do if user selects a near destination?
//
function selectNearDestination(naptans)
{
    'use strict';

    clearSelected();
    makeSelected(naptans);
}

//
// what to do if user clicks on bus stop?
//
function loadCountdown(naptan)
{
    'use strict';
    getArrivalsFromTfl(naptan);
}

function capturedKeypress(evt)
{
    'use strict';
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (charCode == 48) {
	fakeHeadingRotate(1);

    } else if (charCode == 49) {
	fakeHeadingRotate(-1);

    } else {
	return;
    }
}

function fakeHeadingRotate(step)
{
    'use strict';
    fakeHeadingRotateCore(step);
}

function fakeHeadingRotateCore(headingOffset)
{
    'use strict';
    var heading;

    heading = getForcedHeading();
    heading += headingOffset;
    heading = modulo(heading, 360);
    setForcedHeading(heading);

    renderBusStops();
}

function setGuessedTransportMode(speed_in_metres_ps)
{
    'use strict';
    var guess;
    var el;

    if (isNaN(speed_in_metres_ps)) {
	guess = SPEED_GUESS_TEXT_NAN;

    } else if (speed_in_metres_ps < SPEED_STATIONARY_BELOW) {
	guess = SPEED_GUESS_TEXT_STATIONARY;

    } else if (speed_in_metres_ps < SPEED_WALKING_BELOW) {
	guess = SPEED_GUESS_TEXT_WALKING;

    } else if (speed_in_metres_ps < SPEED_IN_CITY_BELOW) {
	guess = SPEED_GUESS_TEXT_IN_CITY;

    } else {
	guess = SPEED_GUESS_TEXT_VFAST;
    }

    el = document.getElementById(GUESSED_TRANSPORT_MODE_NAME);
    el.innerHTML = guess;
}

function setSpeedDisplayed(speed_in_metres_ps)
{
    'use strict';
    var val;
    var el;

    if (isNaN(speed_in_metres_ps)) {
	val = SPEED_METRES_PS_TEXT_NAN;

    } else {
	val = speed_in_metres_ps.toFixed(SPEED_DISPLAY_DECIMAL_PLACES);
    }

    el = document.getElementById(SPEED_MPS_NAME);
    el.innerHTML = SPEED_TEXT + val;
}

function setWheresNorthArrow(heading)
{
    'use strict';
    var el;

    el = document.getElementById(WHERES_NORTH_ARROW_NAME);
    el.style.transform = 'rotate(' + (360 - heading) + 'deg)';
}

function setRadiusScale(radius)
{
    'use strict';
    var el;
    var val;

    if (isNaN(radius)) {
	val = 1;

    } else {
	val = 1 / radius * 10000;
	val = (val > 100) ? 100 : val;
	val = (val < 0) ? 0 : val;
    }

    el = document.getElementById(RADIUS_SCALE_NAME);
    el.width = val + '%';
}

//-------------------------------------------------------------
//
// selection highlighting helpers
//

//
// what to do if user clicks on near dest?
//
function clearSelected()
{
    'use strict';
    var extants;

    extants = document.getElementsByClassName(CLASS_YELLOW_BORDER);
    while (extants.length) {
	extants[0].classList.remove(CLASS_YELLOW_BORDER);
    }
}

function makeSelected(naptans)
{
    'use strict';
    var idx;
    var el;
    var naptansArr;

    naptansArr = naptans.split(' ');
    for (idx = 0; idx < naptansArr.length; idx++) {
	el = document.getElementById(naptansArr[idx]);
	el.classList.add(CLASS_YELLOW_BORDER);
    }
}

//-------------------------------------------------------------
//
// other helpers (middle and front)
//
function decomposeNearDestinations(originalNearDest)
{
    'use strict';
    var towardsArr = [];
    var idx;

    towardsArr = originalNearDest.split(/,|\Wand\W|\Wor\W/);
    for (idx = 0; idx < towardsArr.length; idx++) {
	towardsArr[idx] = towardsArr[idx].trim();
    }
    return towardsArr;
}

// necessary as two adjacent stops can have the same name
// so differentiate using direction of travel
function recomposeCommonNameDir(busstop)
{
    'use strict';
    var commonName;
    var dir;
    var a;

    commonName = busstop.commonName;
    dir = null;
    for (a = 0; a < busstop.additionalProperties.length; a++) {
	if (busstop.additionalProperties[a].key === 'CompassPoint') {
	    dir = busstop.additionalProperties[a].value;
	}
    }

    if (dir === null) {
	return [commonName];
    } else {
	return [commonName + '(' + dir + ')'];
    }
}

function modulo(value, modulo)
{
    // required because % on test machine handles negatives
    // in a manner other than I would wish
    'use strict';
    return ((value % modulo) + modulo) % modulo;
}

function getSpeedInMetresPerSecond(position1, position2, distance_in_metres)
{
    'use strict';
    var seconds;
    var mseconds;

    if (distance_in_metres === 0) {
	return 0;
    }

    mseconds = position2.timestamp - position1.timestamp;

    if (mseconds === 0) {
	return 0;
    }

    seconds = mseconds / 1000;

    if (seconds === 0) {
	return 0;
    }

    return distance_in_metres / seconds;
}

//
// Convert stop letters to something more meaningful
//
function adjustStopLetter(stopletter)
{
    'use strict';
    if (stopletter === undefined) {
	return '@';

    } else {
	return stopletter;
    }
}

//
// array comparison
//
function isArrayEqual(arr1, arr2)
{
    'use strict';
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
// Sort by time to arrive at station
//
function sortArrivalsDataByArrivalIn(data)
{
    'use strict';
    var tmp;
    var idx;
    var found;

    do {
	found = false;
	for (idx = 0; idx < data.length -1; idx++) {
	    if (data[idx].timeToStation > data[idx + 1].timeToStation) {
		found = true;
		tmp = data[idx];
		data[idx] = data[idx + 1];
		data[idx + 1] = tmp;
	    }
	}
    } while (found === true);

    return JSON.stringify(data);
}

//
// Sort by time to arrive at station
//
function sortRoutenosTable(data)
{
    'use strict';
    var tmp;
    var idx;
    var found;

    do {
	found = false;
	for (idx = 0; idx < data.length -1; idx++) {
	    if (data[idx].name > data[idx + 1].name) {
		found = true;
		tmp = data[idx];
		data[idx] = data[idx + 1];
		data[idx + 1] = tmp;
	    }
	}
    } while (found === true);
}

//-------------------------------------------------------------
//
// Sanity check helpers (middle)
//

//
// sanity checks for the position, also replace bad/missing vals
//
function checkPositionValues(original_position)
{
    'use strict';
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

    } else if (!(old_ts >= FIRST_TIMESTAMP_EVAH &&
		 old_ts <= LAST_TIMESTAMP_EVAH)) {
	new_ts = FIRST_TIMESTAMP_EVAH;
    }

    if (typeof(old_ts) !== 'number') {
	position.timestamp = new_ts;

    } else if (!(old_ts >= FIRST_TIMESTAMP_EVAH &&
		 old_ts <= LAST_TIMESTAMP_EVAH)) {
	position.timestamp = new_ts;
    }

    // the latitude and longitude should be values between
    // -90 & +90, -180 & +180 respectively
    if (typeof(position.coords.latitude) !== 'number') {
	position.coords.latitude = 0;

    } else if (!(position.coords.latitude >= LOWEST_LATITUDE &&
		 position.coords.latitude <= HIGHEST_LATITUDE)) {
	position.coords.latitude = 0;
    }

    if (typeof(position.coords.longitude) !== 'number') {
	position.coords.longitude = 0;

    } else if (!(position.coords.longitude >= LOWEST_LONGITUDE &&
		 position.coords.longitude <= HIGHEST_LONGITUDE)) {
	position.coords.longitude = 0;
    }

    return position;
}

//-------------------------------------------------------------
//
// Higher level handling of API (middle)
//
function callback_receiveNewBusStopsFromRadius()
{
    /* jshint validthis: true */
    'use strict';
    var show;

    var lat;
    var lon;
    var heading;
    var width;
    var length;

    if (this.status == HTTP_200) {
	this.response.stopPoints.forEach(receiveNewBusStop);

	switch (JSON.parse(sessionStorage.getItem(PREDICTION_METHOD_NAME))) {
	case PREDICTION_METHOD_RECTANGLE_IN_RADIUS:
	    lat = JSON.parse(sessionStorage.getItem(RECT_LAT_NAME));
	    lon = JSON.parse(sessionStorage.getItem(RECT_LON_NAME));
	    heading = JSON.parse(sessionStorage.getItem(RECT_HEADING_NAME));
	    width = JSON.parse(sessionStorage.getItem(RECT_WIDTH_NAME));
	    length = JSON.parse(sessionStorage.getItem(RECT_LENGTH_NAME));
	    getBusstopsInsideRectangle(lat, lon, heading, width, length);
	    break;
	case PREDICTION_METHOD_SIMPLEST:
	    break;
	default:
	}

	renderBusStops();

    } else {
	show = 'Request failed: (' + this.status.toString() + ') ' + name;
	alert(show);
    }
}

function receiveNewBusStop(currentValue, index, array)
{
    'use strict';
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
    notedBusStops = getNotedBusStops();

    currentValue.originLatitude = sessionStorage.getItem(LATITUDE_NAME);
    currentValue.originLongitude = sessionStorage.getItem(LONGITUDE_NAME);

    // we'll use this to expire old bus stops
    currentValue.timestamp = timeNow;

    towards = '';
    for (additionalPropertyIdx in currentValue.additionalProperties) {
	if (currentValue.additionalProperties[additionalPropertyIdx].key === 'Towards') {
	    towards = currentValue.additionalProperties[additionalPropertyIdx].value;
	}
    }
    currentValue.towards = towards;
    currentValue.commonName = recomposeCommonNameDir(currentValue);

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

    setNotedBusStops(notedBusStops);
}

//
// getArrivalsFromTfl('490015575X');
function getArrivalsFromTfl(naptan)
{
    'use strict';
    var url;
    var handler;

    if (naptan === '') {
	return '';
    }

    url = RPROXY_URL_COUNTDOWN_PRE + naptan + RPROXY_URL_COUNTDOWN_POST;
    sessionStorage.setItem(NAPTAN_NAME, naptan);
    handler = callback_receiveNewCountdown;
    sendGetCore(url, handler);

    return url;
}

function callback_receiveNewCountdown(naptan)
{
    /* jshint validthis: true */
    'use strict';
    var data;
    var show;

    if (this.status == HTTP_200) {
	data = sortArrivalsDataByArrivalIn(this.response);
	sessionStorage.setItem(NOTED_COUNTDOWN_NAME, data);
	renderCountdown(sessionStorage.getItem(NAPTAN_NAME));

    } else {
	show = 'Request failed: (' + this.status.toString() + ') ' + name;
	alert(show);
    }
}

//-------------------------------------------------------------
//
// bump'o'matic (front)
//
function bumpomaticSetup(bumpArray)
{
    // yes, I could just used an empty bumpArray. Not doing so
    // is a reminder it's an option to benefit from cleaning the
    // old one. What that benefit might be IDK but that's the
    // nature of preparing for the future
    'use strict';
    if (!USE_BUMPOMATIC) {
	return;
    }

    while (bumpArray.length) {
	bumpArray.splice(0, 1);
    }
}

function bumpomaticDeleteById(bumpArray, idName)
{
    'use strict';
    var element_idx;

    if (!USE_BUMPOMATIC) {
	return;
    }

    element_idx = 0;
    while (element_idx < bumpArray.length) {
	if (bumpArray[element_idx].id === idName) {
	    bumpArray.splice(element_idx, 1);

	} else {
	    element_idx++;
	}
    }
}

function bumpomaticDeleteByClass(bumpArray, className)
{
    'use strict';
    var element_idx;
    var class_idx;
    var found;

    if (!USE_BUMPOMATIC) {
	return;
    }

    element_idx = 0;
    while (element_idx < bumpArray.length) {
	found = false;
	class_idx = 0;
	while (class_idx < bumpArray[element_idx].classes.length) {
	    if (bumpArray[element_idx].classes[class_idx].indexOf(className) !== -1) {
		bumpArray.splice(element_idx, 1);
		found = true;
		break;

	    } else {
		class_idx++;
	    }
	}
	if (found === false) {
	    element_idx++;
	}
    }
}

function bumpomaticAddById(bumpArray, idName)
{
    'use strict';
    var html;
    var element;
    var offset;
    var was_none;

    if (!USE_BUMPOMATIC) {
	return;
    }

    html = document.getElementById(idName);
    if (html !== null) {
	was_none = false;
	if (html.style.display === 'none') {
	    was_none = true;
	    html.style.display = 'block';
	}
	element = {};
	element.id = idName;
	element.classes = html.classList;
	element.xpos = html.offsetLeft;
	element.ypos = html.offsetTop;
	element.width = html.clientWidth;
	element.height = html.clientHeight;

	offset = bumpomaticCheckIfCollides(bumpArray, element);
	if (offset !== null) {
	    // shift html about
	    if (USE_BUMP_COLOURING === true) {
		html.style.backgroundColor = BUMP_COLOUR_BG;
		html.style.color = BUMP_COLOUR_FG;
	    }
	    html.style.top = html.offsetTop + offset[1] + 'px';
	    element.ypos = html.offsetTop; // note setting style.top changed this in the last line!
	}
	if (was_none === true) {
	    // this is an awful kludge. Should really completely rerun the
	    // bumpomatic when toggling neardest/commonnames
	    html.style.display = 'none';
	}
	bumpArray.push(element);
    }
}

function bumpomaticCheckIfCollides(bumpArray, element)
{
    'use strict';
    var xcollides;
    var ycollides;
    var xoff;
    var yoff;
    var index;
    var found;

    if (!USE_BUMPOMATIC) {
	return;
    }

    xoff = 0;
    yoff = 0;
    do {
	found = false;
	for (index = 0; index < bumpArray.length; index++) {
	    // simple: force element down page until it doesn't collide
	    do {
		xcollides = false;
		ycollides = false;
		if (element.xpos + xoff < bumpArray[index].xpos + bumpArray[index].width &&
		    element.xpos + element.width + xoff > bumpArray[index].xpos) {
		    xcollides = true;
		    if (element.ypos + yoff < bumpArray[index].ypos + bumpArray[index].height &&
			element.ypos + element.height + yoff > bumpArray[index].ypos) {
			ycollides = true;
			if (element.height > 0) {
			    yoff += element.height;

			} else {
			    yoff++;
			}
			found = true;
		    }
		}
	    } while (xcollides === true && ycollides === true);
	}
    } while (found === true);

    if (xoff === 0 && yoff === 0) {
	return null;
    } else {
	return [xoff, yoff];
    }
}

//-------------------------------------------------------------
//
// handling the stack of tracked positions (middle)
//
function setup_tracked_positions(num_positions)
{
    'use strict';
    var a;

    for (a = 0; a < num_positions; a++) {
	tracked_positions[a] = null;
    }
}

function positionPush(num_positions, position)
{
    'use strict';
    var count;
    var a;

    count = 0;
    for (a = 0; a < num_positions - 1; a++) {
	tracked_positions[a] = tracked_positions[a + 1];
	if (tracked_positions[a] !== null) {
	    count++;
	}
    }
    tracked_positions[num_positions - 1] = position;

    return ++count;
}

//-------------------------------------------------------------
//
// Reused lower level networking calls
//

//  Note that these all make CORS requests in the background first, as the
//  call are all Cross Origin in nature.
function sendGetCore(url, handler)
{
    'use strict';
    if (XMLHttpRequest) {
	var request = new XMLHttpRequest();
	if('withCredentials' in request) {
	    request.open('GET', url, true);
	    request.setRequestHeader('Accept', 'application/json');
	    request.responseType = 'json';
	    request.onload = handler;
	    request.send();
	}
    }
}

//-------------------------------------------------------------
//
// mainLoop (middle)
//
function mainLoop(position)
{
    'use strict';
    var num_positions_tracked = 0;

    position = checkPositionValues(position);
    num_positions_tracked = positionPush(NUM_TRACKED_POSITIONS, position);
    updateForNewPrediction(num_positions_tracked);
}
