function hide (objid) {
    obj=document.getElementById(objid);
    obj.setAttributeNS(null,"opacity","0");
}

function show (objid) {
    obj=document.getElementById(objid);
    obj.setAttributeNS(null,"opacity","1");
}

function do_onstartup () {
   httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
	alert('Error: Cannot create an XMLHTTP instance');
	return false;
    }

    httpRequest.onreadystatechange = onclick_r_onready;
    httpRequest.open('GET', 'on_startup.xml');
    httpRequest.send();
}

function onclick_r(objid){
    rectangle_id = objid.slice(1,2);

    httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
	alert('Error: Cannot create an XMLHTTP instance');
	return false;
    }

    httpRequest.onreadystatechange = onclick_r_onready;
    httpRequest.open('GET', 'user_input_' + rectangle_id + '.xml');
    httpRequest.send();
}

function onclick_r_onready () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {

	  var xmldoc = httpRequest.responseXML;
	  var rectangles = xmldoc.getElementsByTagName('r');

	  for (i = 0; i < rectangles.length; i++)
	      {
		  val = rectangles[i].childNodes[0].nodeValue;
		  if (val == "X") {
		      hide ("c" + i);
		      show ("x" + i);
		  } else if (val == "O") {
		      hide ("x" + i);
		      show ("c" + i);
		  } else {
		      hide ("x" + i);
		      hide ("c" + i);
		  }
	      }
      } else {
        alert('tic-tac-toe: There was a problem with the request.');
      }
    }
}
