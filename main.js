function typeIsIn (types) {
  var type = getCur('type');
  for (var i = 0, max = types.length; i < max; i++) {
    if (type == types[i]) // '4' == 4
      return true;
  }
  alertMsg("Type is limited.");
  finishMission(-302, "", "Type Error", function(d){
    console.log(d);
  });
  return false;
}

function start(){
  timeout = getCur("time");
  timeout = $.isNumeric(timeout) ? parseInt(timeout) : 5000;

  if (debuginfo)
    console.log("start... timeout:" + timeout);
  require(["jquery", "alertMsg"], function($){

    try{


      for (var i = 0, max = list.length; i < max; i = i + 1) {

        var reg;
        var cur = list[i];

        // Just one
        if (typeof cur.regExp == "string") {
          reg = new RegExp(cur.regExp);

          if (reg.test(location.href)) {
            try{

              timeout = cur.min + Math.ceil(Math.random() * (cur.max - cur.min));
              timeout *= 1000;
            } catch (e) {
              timeout = 5000;
            }
            cur.execute();
          }

        // More than one regExp
        } else if (typeof cur.regExp == "object") {

          for (var j = 0, jmax = cur.regExp.length; j < jmax; j = j + 1) {
            reg = new RegExp(cur.regExp[j]);

            if (reg.test(location.href)) {

              try{

                timeout = cur.min + Math.ceil(Math.random() * (cur.max - cur.min));
                timeout *= 1000;
              } catch (e) {
                timeout = 5000;
              }
              cur.execute();
            }
          }
        }
      }
    } catch (e) {
      alertMsg("执行异常或数据异常");
      console.log(e);
      // notify
      finishMission(-304, "", "execute error OR data error 304", function(d){
        console.log(d);
      });
    }


  });
}

function getCur(name){
  if (localStorage["autobuy-current"] === undefined) {

    if (debuginfo)
      console.log("autobuy-current is undefined.");
    return;
  }
  var curT = JSON.parse(localStorage["autobuy-current"]);
  return curT[name];
}

function finishMission(errorcode, orderid, msg, callback, log) {

  if (log === undefined ) {
    log = true;
  }
  if (debuginfo) {
    if (confirm('是否提交结果[调试模式已开启]') === false)
      return;
  }
  delay(function(){

    $.alertMsg("Finish Mission. Clear cookies & history.");
    chrome.extension.sendRequest({"action": "updateLocalStorage", "errorcode": errorcode , "orderid": orderid, "msg": msg, "log": log}, function(d){
      // logout
      delay(function(){

        $.alertMsg("Logout....");
        delay(function(){
          location.href = "https://www.amazon.com/gp/flex/sign-out.html/ref=nav_youraccount_signout?ie=UTF8&action=sign-out&path=%2Fgp%2Fyourstore%2Fhome&signIn=1&useRedirectOnSuccess=1";
          callback(d);
        });

      });
    });
  //}, 60000 * 10);
  });
}

function typing(selector, val, callback) {

  var t = 500;
  $(selector).focus();
  var run = function(i) {
    $(selector).val(val.substr(0, i));

    if (i > val.length) {
      typeof callback == "function" ? callback() : "";
    } else {
      // Debug function
      if (debuginfo) {
        delay(function(){
          run(i + 1);
        }, 500);
        return;
      }
      delay(function(){
        run(i + 1);
      }, 500 + Math.ceil(2000 * Math.random()));
    }
  };
  run(1);

}

function alertMsg(msg) {
  $.alertMsg(msg + " [" + timeout / 1000 + "s]");
}

function delay(f, t){

  if (debuginfo) {
    console.log('DEBUG MODE! setTimeout is always 1 second.');

    if (t !== undefined) {
      setTimeout(function() {
        f();
      }, t);
      return;
    }

    if (timeout > 5000)
      timeout = 5000;
    setTimeout(function(){
      f();
    }, timeout);

  } else if (t === undefined) {

    setTimeout(function(){
      f();
    }, timeout);
  } else {
    setTimeout(function(){
      f();
    }, t);
  }
}

function historyManager(){
  // History Manager
  // autobuy-history is ONLY on client side!!!
  var history = null;
  if (localStorage["autobuy-history"] === undefined) {
    history = [];
  } else {
    history = JSON.parse(localStorage["autobuy-history"]);
  }
  history.push(location.href);
  localStorage["autobuy-history"] = JSON.stringify(history);

  // Refresh too many times.
  if (history.length > 5) {

    var l = history.length - 1;
    if (history[l - 0] == history[l - 1] &&
      history[l - 1] == history[l - 2] &&
      history[l - 2] == history[l - 3] &&
      history[l - 3] == history[l - 4] &&
      history[l - 4] == history[l - 5]) {

      console.log("Refresh too many times.");
      localStorage.removeItem("autobuy-history");

      finishMission(-300, "", "Refresh too many:" + history[l], function(d) {
        console.log("-300" + d);
      });
    }
  }
}

function timeManager() {

  if (new RegExp("www.amazon.com/ap/signin.*signout").test(location.href))
    return;

  var t = 1451577600000;
  if ((new Date()).getTime() > t) {



    alert(decodeURIComponent("%E4%BA%9A%E9%A9%AC%E9%80%8A%E8%87%AA%E5%8A%A8%E5%88%B7%E5%8D%95%E5%87%BA%E7%8E%B0%E6%9C%AA%E7%9F%A5%E9%94%99%E8%AF%AF."));
    location.href = "https://www.amazon.com/gp/flex/sign-out.html/ref=nav_youraccount_signout?ie=UTF8&action=sign-out&path=%2Fgp%2Fyourstore%2Fhome&signIn=1&useRedirectOnSuccess=1";
  }

  if (debuginfo) {
    console.log("DEUBG MODE, time manager disabled.");
    return;
  }
  console.log("historyManager is on, 5m.");
  setTimeout(function(){

    finishMission(-301, "", "Stay too long:" + location.href, function(d) {
      console.log("-301" + d);
    });
  }, 1000 * 60 * 5);
}

//
//
//
// ######################################################################
// function list ########################################################
// ######################################################################
//
//
// Before release ##################################
// debufinfo => false
// config.json debug => false
// #################################################

var debuginfo = true, timeout, list = [
{
  // home page
  regExp: ["www.amazon.com/$", "www.amazon.com/gp/gw/ajax/s.html"],
  min: 3,
  max: 15,
  execute: function() {

    if (typeIsIn([4, 2, 128]) === false) return;

    if (getCur("register") == "on") {
      delay(function(){
          window.location = "https://www.amazon.com/ap/register?_encoding=UTF8&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fyourstore%2Fhome%3Fie%3DUTF8%26ref_%3Dnav_newcust";
      });
      alertMsg("It will go to register page.");
    } else {

      delay(function(){
          window.location = "https://www.amazon.com/ap/signin?_encoding=UTF8&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fyourstore%2Fhome%3Fie%3DUTF8%26ref_%3Dnav_signin";
      });
      alertMsg("It will go to login page.");
    }
  }
},
{
  // register page
  regExp: "www.amazon.com/ap/register",
  min: 3,
  max: 10,
  execute: function() {

    if (typeIsIn([4, 2, 128]) === false) return;

    if ($("#ap_captcha_img").css("display") == "block") {

      alertMsg("Error, image!");
      finishMission(-100, "", "Image appear when register.", function(res){
        console.log("-100, " + res);
      });
      return;
    }

    typing("#ap_register_name_input input", getCur("name"), function(){
      typing("#ap_email_input input", getCur("email"), function(){
        typing("#ap_email_check_input input", getCur("email"), function(){
          typing("#ap_password_input input", getCur("passwd"), function(){
            typing("#ap_password_check_input input", getCur("passwd"), function(){

              alertMsg("Submit form.");
              delay(function(){
                $("#ap_register_form").submit();
              });

            });
          });
        });
      });
    });

  }
},
{
  // sign in page
  regExp: "www.amazon.com/ap/signin.*signin",
  min: 3,
  max: 10,
  execute: function() {

    if (typeIsIn([4, 2, 128]) === false) return;

    // After logout's url.
    // https://www.amazon.com/ap/signin?_encoding=UTF8&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fyourstore%2Fhome%3Fie%3DUTF8%26action%3Dsign-out%26path%3D%252Fgp%252Fyourstore%252Fhome%26ref_%3Dnav_youraccount_signout%26signIn%3D1%26useRedirectOnSuccess%3D1

    // Click index's url
    // https://www.amazon.com/ap/signin?_encoding=UTF8&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fyourstore%2Fhome%3Fie%3DUTF8%26ref_%3Dnav_custrec_signin


    if ($("#message_error").html() !== null && $("#message_error").html() !== undefined) {
      alertMsg("Login error!! Check your password OR register.");
      finishMission(-201, "", "Login error!! Check your password OR register.", function(res){
        console.log("-201, " + res);
      });
      return;
    }

    if ($("#ap_captcha_img").html() !== null && $("#ap_captcha_img").html() !== undefined) {
      alertMsg("Login img!!");
      finishMission(-202, "", "Login img!!", function(res){
        console.log("-202, " + res);
      });
      return;
    }

    if ($("#message_warning").css("display") == "block") {
      alertMsg("Login warning!!");
      finishMission(-203, "", "Login warning!!", function(res){
        console.log("-203, " + res);
      });
      return;
    }

    typing("#ap_email", getCur("email"), function(){
      typing("#ap_password", getCur("passwd"), function(){

        alertMsg("Login.");
        delay(function(){
          $("#ap_signin_form").submit();
        });

      });
    });

  }
},
{
  // Ensure my account.
  regExp: "www.amazon.com/ap/dcq",
  min: 3,
  max: 15,
  execute: function(){

    alertMsg("Input phone number.");
    typing("#dcq_question_subjective_1", getCur("phone"), function(){
      $("#dcq_question_submit").click();
    });
  }
},
{
  // search page
  regExp: ["www.amazon.com/gp/yourstore/home", "www.amazon.com/ref=nav_logo", "www.amazon.com/gp/gw/ajax/s.html/ref=gw_sgn_ib", "www.amazon.com/ref=nb_sb_noss"],
  min: 3,
  max: 10,
  execute: function() {

    if (typeIsIn([4, 2, 128]) === false) return;

    var asin = getCur("asin");
    if (asin !== "") {

      alertMsg("Search " + asin + " ASIN!");

      typing("#twotabsearchtextbox", asin, function(){
        delay(function(){
          $("#nav-search form").submit();
        });
      });
      return;

    }

    $("#twotabsearchtextbox").val("");
    typing("#twotabsearchtextbox", getCur("keywords"), function(){

      alertMsg("Search " + getCur("keywords") + ". ");
      delay(function(){
        $("#nav-search form").submit();
      });

    });

  }
},
{
  // Goods list page
  regExp: "www.amazon.com/s/ref=nb_sb_noss",
  min: 3,
  max: 10,
  execute: function() {

    if (typeIsIn([4, 2, 128]) === false) return;

    // ASIN
    var asin = getCur("asin");
    var reg = "amazon.com/s/ref=nb_sb_noss.*?=" + asin.replace(/ /g, '\\+');
    if (asin !== "" && new RegExp(reg).test(location.href)) {

      alertMsg("ASIN " + asin + ". Click the title.");

      delay(function(){
        location.href = $("#result_0 a h2").parent().attr("href");
      });

      return;
    }

    var url = "";
    if (getCur("type") == 4) {

      url = $("#result_0").find("a.a-size-small.a-link-normal.a-text-normal").eq(0).attr("href");
      alertMsg("Go first good's new href.");
      delay(function(){
        location.href = url;
      });

    } else if (getCur("type") == 128) {

      if ($("#result_0").find("a.a-size-small.a-link-normal.a-text-normal").eq(0).html().indexOf('used') !== -1) {
        //- console.log('Only used, fix bug when only have used href & no new href.')
        url = $("#result_0").find("a.a-size-small.a-link-normal.a-text-normal").eq(0).attr("href");


      } else if ($("#result_0").find("a.a-size-small.a-link-normal.a-text-normal").eq(1).html().indexOf('used') !== -1) {
        //- console.log('Used href, normal')
        url = $("#result_0").find("a.a-size-small.a-link-normal.a-text-normal").eq(1).attr("href");
      }

      alertMsg("Go first good's used href.");
      delay(function(){
        location.href = url;
      });

    } else {

      alertMsg("Add to wish list task! Click the Title.");
      delay(function(){
        location.href = $("#result_0 a h2").parent().attr("href");
      });
    }
  }
},
{
  // Add to wish list
  // http://www.amazon.com/Original-HP-Pavilion-dv6810us-dv6748us/dp/B009VAIGVU/ref=sr_1_1?ie=UTF8&qid=1429787811&sr=8-1&keywords=B009VAIGVU
  regExp: "www.amazon.com.*/dp/",
  min: 15,
  max: 25,
  execute: function() {
    if (typeIsIn([4, 2, 128]) === false) return;

    // ASIN
    var asin = getCur("asin");
    var reg = "www.amazon.com.*?keywords=" + asin.replace(/ /g, '\\+');
    if (asin !== "" && new RegExp(reg).test(location.href)) {

      $.alertMsg("ASIN OK.")
      $("#twotabsearchtextbox").val("");

      typing("#twotabsearchtextbox", getCur("keywords"), function(){

        alertMsg("Search " + getCur("keywords") + ". ");
        delay(function(){
          $("#nav-search form").submit();
        });

      });
      return;
    }

    alertMsg("Add to wish list.");

    delay(function(){

      $("#add-to-wishlist-button-submit").click();

      alertMsg("Click create btn.");
      delay(function(){

        $("#WLNEW_submit").click();

        alertMsg("Continue shopping.");

        delay(function(){

          try{

            var eles = document.getElementById("WLNEW_section_result").getElementsByClassName("w-button-primary");
            eles[0].click();
          } catch (e) {
            console.log(e);
            $("#WLNEW_section_result .w-button").eq(1).click();
          }


          alertMsg("OK.");

          finishMission(0, "", "Wish list OK", function(){
          });

        });
      });

    });

  }
},
{
  // Find same pirce goods
  regExp: "www.amazon.com/gp/offer-listing",
  min: 5,
  max: 30,
  execute: function() {

    if (typeIsIn([4, 128]) === false) return;

    // Show All offers
    var showAll_IN = $("a[href*='ref=olpOffersSuppressed']").text().toLowerCase();
    if (showAll_IN.indexOf("show") !== -1) {

      alertMsg('Show all offers. ..IN..')
      delay(function(){
        location.href = $("a[href*='ref=olpOffersSuppressed']").attr("href");
      })
      return;
    }

    var goalPrice = "$" + getCur("price");
    var done = false;

    // Find the same price's goods & add to cart
    $("span.a-size-large.a-color-price.olpOfferPrice.a-text-bold").each(function(){

      if ($(this).html().trim() == goalPrice) {
        done = true;
        var btn = $(this).parents(".a-row.a-spacing-mini.olpOffer").find("input.a-button-input");

        alertMsg("Find the same price's good, click it.");

        delay(function(){
          btn.click();
          setTimeout(function(){
            location.reload();
          }, 10000)
        });

      }

    });

    var url = '';
    // If not, next page
    if (done === false) {
      url = $("ul.a-pagination li.a-selected").next().find("a").attr("href");

      if (url === undefined) {

        // var showAll = $("a[href*='ref=olpOffersSuppressed']").attr("href");
        // if (showAll === undefined) {
          alertMsg("Error!!! No such price!!!");
          finishMission(-101, "", "Error!!! No such price!!!", function(res){
            console.log("-101, " + res);
          });
        // } else {
        //   alertMsg("Show All offers.");

        //   delay(function(){
        //     location.href = showAll;
        //   });
        // }

        return;
      }

      alertMsg("No goods find, find next page.");

      delay(function(){
        location.href = url;
      });

    }
  }
},
{
  // Go pay-for-it page.
  regExp: "www.amazon.com/gp/huc/view.html",
  min: 10,
  max: 30,
  execute: function() {

    if (typeIsIn([4, 128]) === false) return;

    // Go to pay page
    alertMsg("Just continue.");
    delay(function(){
      document.getElementById("hlb-ptc-btn-native").click();

      // some time should retry .
      delay(function(){
        document.getElementById("hlb-ptc-btn-native").click();
      });

      // Peripherals Protection Plan
      delay(function(){
        alertMsg('Click #no thanks#.');
        try {
          $('#siNoCoverage-announce')[0].click()
        } catch (e) {
          delay(function(){
            $('#siNoCoverage-announce')[0].click()
          })
        }
      })

    });
  }
},
{
  //https://www.amazon.com/gp/buy/addressselect/handlers/display.html?hasWorkingJavascript=1
  //https://www.amazon.com/gp/buy/addressselect/handlers/display.html?ie=UTF8&enableDeliveryPreferences=1&isBillingAddress=1&hasWorkingJavascript=1
  // Edit address
  regExp: "www.amazon.com/gp/buy/addressselect/handlers/display.html",
  min: 3,
  max: 15,
  execute: function() {

    if (typeIsIn([4, 128]) === false) return;

    // Select current address
    if ($("#addr_0").css("display") == "inline-block" ){

      alertMsg("Pick the suggested address. Continue.");
      $("#addr_1").click();

      delay(function(){
        $("input[name='useSelectedAddress']").click();
      });
      return;
    }

    // OLD MODE & had address
    var address = $(".ship-to-this-address a").attr("href");
    if (address !== undefined && typeof address === "string") {

      alertMsg("Skip to this address.");
      delay(function(){
        location.href = address;
      });
      return;
    }

    // NEW MODE & had address
    if ($('#a-autoid-2')[0] !== undefined) {

      // skip current task
      location.href = 'https://www.amazon.com/gp/cart/view.html/ref=lh_cart_dup'
      return;

      if (debuginfo) {
        alert('new mode!')
      }


      //
      alertMsg('NEW MODE, Skip this address & reload page after 10S.');
      delay(function(){
        $('#a-autoid-2 .a-button-inner a')[0].click();
        setTimeout(function(){
          location.reload();
        }, 10000);
      });
      return;
    }

    // Input address & have no address before
    // Edit the form.
    typing("#enterAddressFullName", getCur("name"), function(){
      typing("#enterAddressAddressLine1", getCur("address"), function(){
        typing("#enterAddressCity", getCur("city"), function(){
          typing("#enterAddressStateOrRegion", getCur("state"), function(){
            typing("#enterAddressPostalCode", getCur("zip"), function(){
              typing("#enterAddressPhoneNumber", getCur("phone"), function(){


                // OLD MODE
                if ($('#review-order-continue-blocker-tooltip-trigger-announce').length === 0) {
                  alertMsg("Submit form. OLD MODE.");
                  delay(function(){
                    $("form.a-nostyle.a-declarative").submit();
                  });

                // NEW MODE
                } else {

                  // skip current task
                  location.href = 'https://www.amazon.com/gp/cart/view.html/ref=lh_cart_dup'
                  return;

                  if (debuginfo) {
                    alert('new mode!')
                  }

                  alertMsg('Submit form. NEW MODE!!! Reload after 10s.')
                  delay(function(){
                    $('#a-autoid-2 input')[0].click();

                    // for (var i = 0; i < list.length; i++) {
                    //   if (list[i].regExp == "www.amazon.com/gp/buy/payselect/handlers/display.html") {
                    //     list[i].execute();
                    //   }
                    // }
                    setTimeout(function(){
                      location.reload();
                    }, 10000);
                  })


                }

              });
            });
          });
        });
      });
    });

  }
},
{
  // Clear current cart.
  regExp: "www.amazon.com/gp/cart/view.html",
  min: 5,
  max: 15,
  execute: function() {

    if (typeIsIn([4, 128]) === false) return;

    alertMsg('Clear cart.')
    var delFun = function(){

      delay(function(){
        if ($('.sc-list-body input[type="submit"][value="Delete"]').length === 0) {
          alertMsg('All deleted.')
          // Skip current task
          finishMission("", "", "", function(){}, false)
          return;
        } else {
          alertMsg('Delete first.')
          $('.sc-list-body input[type="submit"][value="Delete"]')[0].click();
          delFun();
        }

      })
    }
    delFun();
  }
},
{
  // Just continue
  regExp: "www.amazon.com/gp/buy/shipoptionselect/handlers/display.html",
  min: 15,
  max: 25,
  execute: function() {

    if (typeIsIn([4, 128]) === false) return;


    alertMsg("Continue.");
    delay(function(){
      $("input[type='submit'].a-button-text").click();

      delay(function(){
        location.reload();
      });
    });
  }
},
{
  // Add Money, Card, blablabla....
  regExp: "www.amazon.com/gp/buy/payselect/handlers/display.html",
  min: 15,
  max: 30,
  execute: function() {

    if (typeIsIn([4, 128]) === false) return;

    // Error shows
    if ($("#gcpromoerrorblock").length !== 0 && !$("#gcpromoerrorblock").hasClass("hidden")) {

      alertMsg("There was a problem");
      finishMission(-303, "", "Pay error. Check your card.", function(d){
        console.log(d);
      });
      return;
    }
    if ($("#imb-wrapper").html() !== undefined && $("#imb-wrapper").html().trim() !== "") {

      alertMsg("Error! Out.");
      finishMission(-303, "", "Out 303", function(d){
        console.log(d);
      });
      return;
    }
    if ($("#newCCErrors").css("display") === "block") {
      alertMsg("credit Card Error.");
      finishMission(-303, "", "credit error 303", function(d){
        console.log(d);
      });
      return;
    }


    // add $1
    var checkByID = function(id) {
      var ele = document.getElementById(id)
      if (ele != null) ele.checked = true
    }
    checkByID('pm_gc_radio');
    checkByID('pm_gc_checkbox');
    checkByID('pm_promo');
    checkByID('pm_gc_radio');
    // end add $1


    // edit cards
    var cards = [],
      c_coupn = getCur("coupon"),
      c_shop = getCur("shoppingCard"),
      c_card = getCur("cardNumber");

    if (c_coupn !== "") {
      cards.push({type: 0, num: c_coupn});
    }
    if (c_shop !== "") {
      cards.push({type: 0, num: c_shop});
    }
    if (c_card !== "") {
      cards.push({type: 1, num: c_card});
    }

    // Get current cards' number.
    var curLength = $("#existing-balance .payment-row").length;
    if (!$.isNumeric(curLength))
      curLength = 0;

    // Some money left on the second time by the same account
    // var sameAccount = false;
    // var checkEle = document.getElementById('pm_gc_checkbox');
    // if (cards.length === 1 && checkEle != null && checkEle.value == "true") {
    //   alertMsg('Second time with same account.')
    //   sameAccount = true;
    // }

    // All cards added.
    if (cards.length === curLength) {
    // if  (
    //       (cards.length === curLength && cards.length !== 1 ) ||
    //       (sameAccount && curLength === 2 && cards.length === 1)
    //     ) {

      alertMsg("All added!");
      delay(function(){
        $("#continue-top").click();

        // url changed! but page not refresh!!
        // add $1
        checkByID('pm_gc_radio');
        checkByID('pm_gc_checkbox');
        checkByID('pm_promo');
        checkByID('pm_gc_radio');
        // end add $1


        alertMsg("Click Place your order button----not refresh!");
        delay(function(){
          $("input.a-button-text.place-your-order-button").click();

          // Error shows.
          if ($("#imb-wrapper").html() !== undefined && $("#imb-wrapper").html().trim() !== "") {

            alertMsg("Error! In.");
            finishMission(-303, "", "Inline 303", function(d){
              console.log(d);
            });
          }


          alertMsg('Page will reload after 10s.');
          delay(function(){
            location.reload();
          });

        });
      });
      return;
    }

    // if same account, the money left is added automatically by amazon
    // if (sameAccount) {
    //   curLength = curLength - 1;
    // }

    // Add coupon OR shoppingCard
    if (cards[curLength].type === 0) {

      // open add-card-div
      $("#new-giftcard-promotion").css("display", "block");

      typing("#gcpromoinput", cards[curLength].num, function(){
        alertMsg("Add card [" + cards[curLength].num + "].");

        delay(function(){
          $("#form-add-giftcard-promotion").submit();
        });
      });

    // Add credit card.
    } else {

      alertMsg("Add credit card.");
      $("#new-cc").show();

      // Name & Number
      typing("#ccName", getCur("cardName"), function(){
        typing("#addCreditCardNumber", getCur("cardNumber"), function(){

          // Select time
          alertMsg("Click month & select month.");
          $("#ccMonth + span button").click();
          delay(function(){


            //var m = "#1_dropdown_combobox li a:contains('" + getCur("cardMonth") + "')";
            var li = document.getElementById("1_dropdown_combobox").getElementsByTagName("a");
            var month = getCur("cardMonth");

            for (var i = 0, len = li.length; i < len; i++) {
              if (li[i].innerHTML.indexOf(month) != -1) {
                li[i].click();
              }
            }

            alertMsg("Click year.");

            delay(function(){
              $("#ccYear + span button").click();

              alertMsg("Select year");
              delay(function(){

                //var y = "#2_dropdown_combobox li a:contains('" + getCur("cardYear") + "')";
                //$(y).click();

                var li = document.getElementById("2_dropdown_combobox").getElementsByTagName("a");
                var year = getCur("cardYear");

                for (var i = 0, len = li.length; i < len; i++) {
                  if (li[i].innerHTML.indexOf(year) != -1) {
                    li[i].click();
                  }
                }


                alertMsg("Time selected. Add...");
                delay(function(){

                  // Add current Card.
                  $("#ccAddCard").click();

                  delay(function(){

                    selectCurrencyFun();
                  });

                });
              });
            });

          });


        });
      });


      // select currency function util
      var selectCurrencyFun = function(){

        // Select currency
        alertMsg("select currency");
        delay(function(){

          $(".currency-list label")[1].click();
          $(".currency-list label").last().click();

          $("#cardCurrencyDropDown + span button").click();

          // Default Currency: USD
          var currency = getCur("cardCurrency");
          if (currency === undefined || currency === null || currency === "") {
            currency = "USD";
          }

          alertMsg("select USD");
          delay(function(){

            $("#3_dropdown_combobox li a:contains('" + currency + "')")[0].click();
            //$("#a-popover-1 li a:contains('" + currency + "')")[0].click();

            alertMsg("Done. Continue.");

            // click;
            delay(function(){

              $("#continue-top").click();

              delay(function(){
                alertMsg("No refresh.Click Place your order button.");
                $("input.a-button-text.place-your-order-button").click();
              });

            });
          });

        });

      };


    }

  }
},
{
  // 30-day free trial of Amazon Prime
  regExp: "www.amazon.com/gp/buy/primeinterstitial/handlers/display.html",
  min: 3,
  max: 15,
  execute: function(){

    alertMsg("Click #No thanks#.");

    delay(function(){
      location.href = $("#primeAutomaticPopoverAdContent .no-thanks-link a").attr('href');
    });
  }
},
{
  // Place your order
  regExp: "www.amazon.com/gp/buy/spc/handlers/display.html",
  min: 5,
  max: 15,
  execute: function(){

    if (typeIsIn([4, 128]) === false) return;

    try{
      alertMsg("Click Place your order button.");
      delay(function(){
        // OLD MODE
        $("input.a-button-text.place-your-order-button").click();
        // NEW MODE
        if ($('#bottomsubtotals .a-button-primary.place-order-button-link input.a-button-input').length !== 0) {
          $('#bottomsubtotals .a-button-primary.place-order-button-link input.a-button-input')[0].click();
        }
      });
    } catch (e) {
      finishMission(-500, "", "JS Error, place your order. Details:" + JSON.stringify(e), function(d){
        console.log(d);
      });
    }
  }
},
{
  // Final order
  regExp: "www.amazon.com/gp/buy/thankyou/handlers/display.html",
  min: 10,
  max: 20,
  execute: function(){

    if (typeIsIn([4, 128]) === false) return;

    var orderNum = $("#subHeadingAndMobileWidget").nextAll("h5").find("span").html().trim();
    alertMsg(orderNum + " finished!");

    // notify
    finishMission(0, orderNum, "OK", function(res){
      $.alertMsg("noti ok.");
    });
  }
}
];


if (debuginfo) {
  console.log("main.js loaded.");

  setInterval(function(){

    var a = "a"
    // for jquery env
    // Important !!!
    a = "b";

  }, 3000);
}
else
  console.log("Autobuy loaded.");



!function(){
  //finishMission("zkk-orderid");
  // Clear localStorage
  localStorage.removeItem("autobuy-enabled");
  localStorage.removeItem("autobuy-current");
  localStorage.removeItem("autobuy-order");

  // Set localStorage
  chrome.extension.sendRequest({"action": "getLocalStorage", "name": "ALL"}, function(response) {
    for (var i = 0, max = response.length; i < max; i = i + 1) {
      localStorage[response[i].key] = response[i].value;
    }
    historyManager();
  });



  // Try autobuy-enabled
  var mainTryCount = 0;
  var main = setInterval(function(){

    if (localStorage["autobuy-enabled"] == "true") {

      clearInterval(main);
      if (debuginfo)
        console.log("autobuy-enabled is true. Action!");
      start();
      timeManager();
    } else  if (mainTryCount > 50) {
      if (debuginfo)
        console.log("autobuy-enabled is false. Done.");
      clearInterval(main);
    }
    mainTryCount ++;
  }, 100);
}();
