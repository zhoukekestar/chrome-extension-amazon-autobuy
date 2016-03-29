
chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({url:"options.html"});
});

function getCur(name){
  if (localStorage["autobuy-current"] === undefined) {
      console.log("autobuy-current is undefined.");
    return "";
  }
  var curT = JSON.parse(localStorage["autobuy-current"]);
  return curT[name];
}

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
            setTimeout(function(){
              updateTask();
            }, 1000)
          } else {
            new Notification("Put Task error.", {icon: "list.png", body: url});
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
        } else {

          if (count < maxCount) {
            setTimeout(function(){
              sendReq();
            }, 1000)
          } else {

            new Notification("Get Task error.", {icon: "list.png", body: url});
          }
        }
      }
    }
    xhr.send();
  }
  sendReq();
}

var crxConfig = null;
getURL(chrome.extension.getURL('/config.json'), function(d){
  crxConfig =  JSON.parse(d);
  if (crxConfig.debug !== true) {
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

        if (d.data === null) {

          localStorage["autobuy-enabled"] = "false";
          new Notification("Tasks were finished.", {icon: "list.png", body: "Tasks were finished. Autobuy is disabled."});
          return;
        }

        d = d.data.data[0];
        var dd = {};
        dd.id   = d.id;
        dd.time   = 5000;
        dd.email  = d.email;
        dd.passwd = d.passwd;
        dd.keywords = d.keywords;
        dd.price  = d.price;
        dd.name   = d.fullname;
        dd.address  = d.address.address;
        dd.city   = d.address.city;
        dd.state  = d.address.state;
        dd.zip    = d.address.zip;
        dd.phone  = d.address.phone;
        dd.coupon = d.coupon;
        dd.shoppingCard = d.shoppingcard;

        for (var i = 0, max = log.length; i < max; i++) {
          if (log[i].id == dd.id) {
            putTask(-305, dd.id, function(d){});
            sendReq();
            return;
          }
        }

        if (d.creditcard !== undefined && d.creditcard !== null) {

          dd.cardName   = d.creditcard.holder;
          dd.cardNumber = d.creditcard.codes;
          dd.cardMonth  = d.creditcard.month;
          dd.cardYear   = d.creditcard.year;
          dd.cardCurrency = d.creditcard.currency;

        } else {
          dd.cardName   = "";
          dd.cardNumber = "";
          dd.cardMonth  = "";
          dd.cardYear   = "";
        }

        dd.asin = d.searchasin;
        dd.register = d.register;
        dd.type = d.type;

        localStorage["autobuy-current"] = JSON.stringify(dd);
      }
    });
  }
  sendReq();
}

function removeCookie(cookie) {
  var url =   "http://" + cookie.domain +
        cookie.path;
  chrome.cookies.remove({"url": url, "name": cookie.name});
}

function clearCookies() {

  chrome.history.deleteAll(function(){});

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

  if (request.action == "getLocalStorage" && request.name == "ALL") {

    var c = [];
    for (var i = 0, max = localStorage.length; i < max; i = i + 1) {
      var key = localStorage.key(i);
      c.push({"key":key, "value":localStorage[key]});
    }
    sendResponse(c);


  } else  if (request.action == "getLocalStorage") {
    sendResponse(localStorage[request.name]);


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
    clearCookies();

    if (request.log === false) {
      noti = new Notification(getCur("id"), {icon: "AutoBuy.png", body: "Skip"});
      sendResponse({});

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

      noti = new Notification(request.errorcode, {icon: "AutoBuy.png", body: "ERROR! Mission " + getCur("id") + " end with errorcode " + request.errorcode});
      putTask(request.errorcode, "", function(d){
        sendResponse(d);
      });
    }

    noti.onclick = function(){

      // Load new mission
      updateMission(localStorage["autobuy-fid"], function(d) {});

      var id;
      chrome.tabs.getSelected(function(d){
        id = d.id;

        chrome.tabs.create({url:"http://www.amazon.com"});
        chrome.tabs.remove(id);
      });
    }

  } else  if (request.action == "updateLocalStorageSimple") {
    var name = request.name;
    var value = request.value;

    localStorage[name] = value;

    sendResponse({"msg": "ok"});

  } else if (request.action == "initMission") {

    if (request.fid !== undefined) {
      updateMission(request.fid, function(d) {
        sendResponse(d);
      });
    }

  } else {
    sendResponse("Unkown request");
  }
});
