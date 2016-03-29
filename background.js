
// Click icon's event
chrome.browserAction.onClicked.addListener(function() {

	chrome.tabs.create({url:"options.html"});
});

// Get localStorage's value by key
function getCur(name){
	if (localStorage["autobuy-current"] === undefined) {
			console.log("autobuy-current is undefined.");
		return "";
	}
	var curT = JSON.parse(localStorage["autobuy-current"]);
	return curT[name];
}

/**
If orderid is string(""), it appears that some error happened.
*/
function putTask(errorcode, orderid, callback) {

	var url = crxConfig["putTask"] + "/" + getCur("id") + "?errorcode=" + errorcode;
	if (errorcode === 0 && orderid !== "")
		url += "&order=" + orderid;

  var maxCount = 10;
  var count    = 0;
  var updateTask = function() {

    count++;

  	var xhr = new XMLHttpRequest();
  	xhr.open("PUT", url, true);
  	xhr.onreadystatechange = function() {
  		if (xhr.readyState === 4) {

        if (xhr.status === 200) {
    			if (typeof callback == "function")
    				callback(xhr.responseText, xhr);
        } else {
          if (count < maxCount) {
            console.log('req error, the ' + count + ' times');

            setTimeout(function(){
              updateTask();
            }, 1000)
          } else {
            new Notification("Put Task error.", {icon: "list.png", body: "Put Task Error after 10 times. URL:" + url});
            console.log('req error after 10 times.')
          }
        }
  		}
  	};
  	xhr.send();
  }
  updateTask();
}

function getURL(url, callback) {

  var maxCount  = 10;
  var count     = 0;

  var sendReq = function() {
    count++;
  	var xhr = new XMLHttpRequest();
  	xhr.open("GET", url, true);
  	xhr.onreadystatechange = function() {
  	  if (xhr.readyState == 4) {
        if (xhr.status === 200) {
  		    callback(xhr.responseText, xhr);
        }
        else {
          if (count < maxCount) {
            console.log('req error, the ' + count + ' times');
            setTimeout(function(){
              sendReq();
            }, 1000)

          }
          else {
            new Notification("Get Task error.", {icon: "list.png", body: "Get Task Error after 10 times. URL:" + url});
            console.log('req error after 10 times.')
          }
        }
  	  }
  	}
  	xhr.send();
  }
  sendReq();
}

// Get crx's config.
var crxConfig = null;
getURL(chrome.extension.getURL('/config.json'), function(d){
	crxConfig =  JSON.parse(d);

  if (crxConfig.debug === true) {
    console.log('Debug MODE. keep cookie.')
  } else {
    clearCookies();
  }
});

function updateMission(fid, callback){

  var log = localStorage["autobuy-order-log"];
  if (log === undefined) {
    log = [];
  } else {
    log = JSON.parse(log);
  }


	var sendReq = function() {
    getURL(crxConfig["getTask"] + fid, function(d){
  		var d = JSON.parse(d);
  		if (d.code == 0) {

  			// No more task need to execute.
  			if (d.data === null) {

  				// Disabled autobuy
  				localStorage["autobuy-enabled"] = "false";
  				console.log("Disabled autobuy-enabled.");

  				console.log("Data is null. " + JSON.stringify(d));
          console.log("Tasks were finished. Autobuy is disabled.");
  				new Notification("Tasks were finished.", {icon: "list.png", body: "Tasks were finished. Autobuy is disabled."});
  				return;
  			}

  			// Get First task.
  			d = d.data.data[0];
  			var dd = {};
  			dd.id		= d.id;
  			dd.time		= 5000;
  			dd.email	= d.email;
  			dd.passwd	= d.passwd;
  			dd.keywords = d.keywords;
  			dd.price	= d.price;
  			dd.name		= d.fullname;
  			dd.address	= d.address.address;
  			dd.city		= d.address.city;
  			dd.state	= d.address.state;
  			dd.zip		= d.address.zip;
  			dd.phone	= d.address.phone;
  			dd.coupon	= d.coupon;
  			dd.shoppingCard = d.shoppingcard;

        // if id is in log , skip this mission
        for (var i = 0, max = log.length; i < max; i++) {
          if (log[i].id == dd.id) {


            putTask(-305, dd.id, function(d){
              console.log('task [' + dd.id + '] is logged.');
            });

            sendReq();
            console.log('Mission ' + dd.id + ' is in log, skip this mission.');
            return;
          }
        }

  			if (d.creditcard !== undefined && d.creditcard !== null) {

  				dd.cardName		= d.creditcard.holder;
  				dd.cardNumber	= d.creditcard.codes;
  				dd.cardMonth	= d.creditcard.month;
  				dd.cardYear		= d.creditcard.year;
  				dd.cardCurrency = d.creditcard.currency;

  			} else {
  				dd.cardName		= "";
  				dd.cardNumber	= "";
  				dd.cardMonth	= "";
  				dd.cardYear		= "";
  			}

  			dd.asin = d.searchasin;
  			dd.register = d.register;
  			dd.type = d.type;

  			//console.log("Get task:" + JSON.stringify(d));
  			//console.log("Modify task:" + JSON.stringify(dd));
  			localStorage["autobuy-current"] = JSON.stringify(dd);

  		} else {
  			// Disable auto-buy.
  			localStorage["autobuy-enabled"] = "false";
  			console.log("Disabled autobuy-enabled.");
  			console.log("Get task ERROR!" + JSON.stringify(d));
  		}
  	});
  }
  sendReq();
}

function removeCookie(cookie) {
	var url = 	"http" + (cookie.secure ? "s" : "") + "://" + cookie.domain +
				cookie.path;
	chrome.cookies.remove({"url": url, "name": cookie.name});
}

function clearCookies() {

	chrome.history.deleteAll(function(){
		//console.log(a);
	});
	chrome.cookies.getAll({domain:"www.amazon.com"}, function(cookies) {
		for (var i in cookies) {
			removeCookie(cookies[i]);
		}
	});
	chrome.cookies.getAll({domain:".amazon.com"}, function(cookies) {
		for (var i in cookies) {
			removeCookie(cookies[i]);
		}
	});
	chrome.cookies.getAll({domain:".amazon-adsystem.com"}, function(cookies) {
		for (var i in cookies) {
			removeCookie(cookies[i]);
		}
	});
	chrome.cookies.getAll({domain:".doubleclick.net"}, function(cookies) {
		for (var i in cookies) {
			removeCookie(cookies[i]);
		}
	});
}


// Get options && update options
chrome.extension.onRequest.addListener( function(request, sender, sendResponse) {

	// Request get all localstorage
	if (request.action == "getLocalStorage" && request.name == "ALL") {

		var c = new Array();
		for (var i = 0, max = localStorage.length; i < max; i = i + 1) {
			var key = localStorage.key(i);
			c.push({"key":key, "value":localStorage[key]});
		}

		sendResponse(c);

	// Request get special localstorage
	} else 	if (request.action == "getLocalStorage") {
		sendResponse(localStorage[request.name]);

	// Request update localstorage
	} else if (request.action == "updateLocalStorage") {

		var noti = null;

		// Log current operate
    if (request.log !== false) {
  		var log = localStorage["autobuy-order-log"];
  		if (log === undefined) {
  			log = [];
  		} else {
  			log = JSON.parse(log);
  		}

  		log.push({
  			"id": getCur("id"),
  			"email": getCur("email"),
  			"errorcode": request.errorcode,
  			"orderid": request.orderid,
  			"msg": request.msg
  		});

		  localStorage["autobuy-order-log"] = JSON.stringify(log);

    }


		// Delete cookies.
		clearCookies();


    // Skip task
    if (request.log === false) {
      noti = new Notification(getCur("id"), {icon: "AutoBuy.png", body: "Skip current task. "});
      sendResponse({});

    // Misson complete with orderid.
    } else if (request.errorcode === 0) {

			if (request.orderid === "") {

        console.log("OK! Mission " + getCur("id") + " is OK. Wish list. ");
				noti = new Notification(getCur("id"), {icon: "AutoBuy.png", body: "OK! Mission " + getCur("id") + " is OK. Wish list. "});
			} else {

        console.log("OK! Mission " + getCur("id") + " end with orderid " + request.orderid + ".");
				noti = new Notification(getCur("id"), {icon: "AutoBuy.png", body: "OK! Mission " + getCur("id") + " end with orderid " + request.orderid + "."});
			}
			putTask(0, request.orderid, function(d){

				sendResponse(d);

				console.log(getCur("id") + " success." + d);
			});

		// Mission compelete with errorcode.
		} else {

      console.log("ERROR! Mission " + getCur("id") + " end with errorcode " + request.errorcode);
			noti = new Notification(request.errorcode, {icon: "AutoBuy.png", body: "ERROR! Mission " + getCur("id") + " end with errorcode " + request.errorcode});
			putTask(request.errorcode, "", function(d){

				sendResponse(d);

				console.log(getCur("id") + " error with " + request.errorcode + " ." + d);
			});
		}

		noti.onclick = function(){

			// Load new mission
			updateMission(localStorage["autobuy-fid"], function(d) {
				console.log("new Mission!!!" + d);
			});

			// Replace current page.
			var id;
			chrome.tabs.getSelected(function(d){
				id = d.id;

				chrome.tabs.create({url:"http://www.amazon.com"});
				chrome.tabs.remove(id);
			});
		}


	// Request update spectial localstorage
	} else 	if (request.action == "updateLocalStorageSimple") {
		var name = request.name;
		var value = request.value;

		localStorage[name] = value;

		sendResponse({"msg": "ok"});

	// Init Mission
	} else if (request.action == "initMission") {

		if (request.fid !== undefined) {
			updateMission(request.fid, function(d) {
				sendResponse(d);
			});
		} else {
			console.log("fid error.");
		}

	// Unkonwn Request
	} else {
		sendResponse("Unkown request");
	}
});
