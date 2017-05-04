/*
  eztfl-html5  Alistair Mann
  Note that these all make CORS requests in the background first, as the
  call are all Cross Origin in nature.
*/

function sendGetToTfl()
{
    var url = "https://eztfl-html5.mpsvr.com/mirror/foo/StopPoint?stopTypes=NaptanPublicBusCoachTram&radius=322&lat=51.473840&lon=-0.200628"
    var handler = handler_task_1

    sendGetCore(url, handler);
}

function sendGetCore(url, handler)
{
    if (XMLHttpRequest) {
	var request = new XMLHttpRequest();
	if("withCredentials" in request) {
	    request.open('GET', url, true);
	    request.setRequestHeader("Accept", "application/json");
	    request.responseType = "json";
	    request.onload = handler;
	    request.send();
	}
    }
}

function handler_task_1()
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
	    $json_o = JSON.stringify($json_o);
	alert($json_o);

    } else {
	$show = '(' + this1.status.toString() + ') ' + name;
	alert($show);
    }
}
