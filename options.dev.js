$(function(){
  function logInit(){
    var html = "<table style='width: 100%;'>";
    if (localStorage["autobuy-order-log"] == undefined)
      return;
    var logs = JSON.parse(localStorage["autobuy-order-log"]);
    html += "<tr> <td>id</td> <td>email</td> <td>errorcode</td> <td>orderid</td> <td>msg</td> </tr>"
    for (var i = 0, len = logs.length; i < len; i++) {
      html += "<tr>" +
          "<td>" + logs[i].id + "</td>" +
          "<td>" + logs[i].email + "</td>" +
          "<td>" + logs[i].errorcode + "</td>" +
          "<td>" + logs[i].orderid + "</td>" +
          "<td>" + logs[i].msg + "</td>" +
          "<tr>";
    }
    html += "</table>";
    $(".log-list").html(html);
  }
  logInit();

  function getCur(name){

    if (localStorage["autobuy-current"] == undefined) {

      console.log("autobuy-current is undefined.");
      return;
    }

    var curT = JSON.parse(localStorage["autobuy-current"]);
    return curT[name];
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

  function init(){

    // Enabled
    if (localStorage["autobuy-enabled"] == "true")
      $(".autobuy-enabled").attr("checked", "checked");

    // FID
    if (localStorage["autobuy-fid"] !== undefined)
      $(".form-fid input[name='fid']").val(localStorage["autobuy-fid"]);

    // Register
    if (getCur("register") == "on")
      $(".autobuy-current input[name='register']").attr("checked", "checked");


    var list = ["email", "passwd", "keywords", "name", "asin",
    "address", "city", "state", "zip", "phone",
    "coupon", "shoppingCard",
    "price", "id", "time", "type",
    "cardName", "cardNumber", "cardMonth", "cardYear", "cardCurrency"];

    for (var i = 0, max = list.length; i < max; i = i + 1) {
        $(".autobuy-current input[name='" + list[i] + "']").val(getCur(list[i]));
    }
  }
  init();

  $(".btn-add").click(function(){
    var form = $("form").serializeArray();
    var obj = {};

    for (var i = 0, len = form.length; i < len; i++) {
      obj[form[i].name] = form[i].value;
    }
    localStorage["autobuy-current"] = JSON.stringify(obj);
    alert("更新成功");
  });

  $(".btn-load-mission").click(function(){

    var fid = $(".form-fid input[name='fid']").val();
    localStorage["autobuy-fid"] = fid;
    chrome.extension.sendRequest({"action": "initMission", "fid": fid}, function(){});
    $(".btn-load-mission").attr("disabled", "disabled");
    setTimeout(function(){
      location.reload();
    }, 2000);
  });

  $(".btn-notification-test").click(function(){
    var noti = new Notification("Test", {icon: "AutoBuy.png", body: "Test notification."});
    noti.onclick = function(){
      location.href = "http://www.baidu.com";
    };
  });

  $(".autobuy-enabled").click(function(){
    localStorage["autobuy-enabled"] = $(".autobuy-enabled").is(':checked');
  });

  $(".btn-cookies-clear").click(function(){
    clearCookies();
    alert("OK");
  });
});
