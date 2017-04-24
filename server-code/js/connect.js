///////////////////////////////////////////////////////////////////

// Note that these all make CORS requests in the background first, as the
// call are all Cross Origin in nature.
//

function sendGetToTfl()
{
    var url = "https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&radius=322&lat=51.473840&lon=-0.200628"
    if (XMLHttpRequest) {
	var request = new XMLHttpRequest();
	if("withCredentials" in request) {
	    // Firefox 3.5 and Safari 4
	    request.open('GET', url, true);
	    request.setRequestHeader("Accept", "application/json");
	    request.responseType = "json";
	    request.setRequestHeader("If-Modified-Since", "Tue,  1 Jan 1980 19:12:53 BST");
	    request.setRequestHeader("If-None-Match", "Wibble");
	    request.onload = handler_otoos_content_14_h;
	    request.send();
	}
    }

}

function handler_otoos_content_14_h()
{
    handler_uber(this, arguments.callee.toString());
}

function handler_uber(this1, name)
{
    name = name.substr('function '.length);
    name = name.substr(0, name.indexOf('('));
    name = name.substr(8);
    name = name.replace(/_/g, '-');

    if (this1.status == 200) {

	$json_o = this1.response;
	if (window.ie !== false)
	    $json_o = JSON.parse($json_o);
	alert($json_o);

    } else {
	$show = '(' + this1.status.toString() + ') ' + name;
	alert($show);
    }
}
