/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
    $.ajax({
        type: "POST",
        data: JSON.stringify(param),
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        url: serviceUrl + '/GetStoreOfferList',
        success: function (jqXHR, textStatus, data) {
            //debugger;

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('error : ' + errorThrown);
        }
    });
   */

//#region init
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function () {
        app.receivedEvent('deviceready');

        // Mock device.platform property if not available
        if (!window.device) {
            window.device = { platform: 'Browser' };
        }

        handleExternalURLs();
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function handleExternalURLs() {
    // Handle click events for all external URLs
    if (device.platform.toUpperCase() === 'ANDROID') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            navigator.app.loadUrl(url, { openExternal: true });
            e.preventDefault();
        });
    }
    else if (device.platform.toUpperCase() === 'IOS') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            window.open(url, '_system');
            e.preventDefault();
        });
    }
    else {
        // Leave standard behaviour
    }
}
//#endregion


//#region initial variables
var v_dateFrom = new Date();
var v_dateTo = new Date();
var v_category_id = -1;
var v_product_id = -1;
var v_retailer_id = -1;
var v_country_id = -1;
var v_city_id = -1;

var v_category_name = null;
var v_product_name = null;
var v_retailer_name = null;
var v_country_name = null;
var v_city_name = null;

var currentOfferId = null;
var serviceUrl = "http://localhost:2497/MobileOfferFinderService.asmx";
//var serviceUrl = "http://mof2service.adigielite.net/MobileOfferFinderService.asmx";
var currentOfferDetail = null;
//#endregion


//#region offer list calender
function function_offerlist(event) {
    createCalender();
};

function OpenCalender() {
    showCalender('full');
};

function CloseCalender() {
    showCalender('mini');
};

function showCalender(mode) {
    var weeks = $("#mob-calender-d1").find(".data-dates");
    if (mode == 'full') {
        $(weeks).css('display', 'block');
    } else {
        //alert('mini');
        var d = new Date();
        var date = d.getDate();
        var month = d.getMonth();
        var year = d.getYear();
        var day = d.getDay();
        $(weeks).each(function (i, e) {
            var dayst = $(this).attr('data-date-start');
            var dayed = $(this).attr('data-date-end');
            if (dayst <= date && dayed >= date)
                $(e).css('display', 'block');
            else
                $(e).css('display', 'none');
        });
    }
};

function createCalender() {
    var d = new Date();
    $("#offerlist-header h1").html(d.toDateString());
    var weekDay = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    var date = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    var day = d.getDay();

    var newWeek = true;
    var j = 1;
    $("#mob-calender-d1").html('');
    for (var i = 0; i < 7; i++) {
        if (newWeek) {
            newWeek = false;
            var firstweek = $("#mob-calender-d1").append('<div class="mob-calender-w"></div>');
            $(firstweek).append('<div class="mob-calender-space">&nbsp;</div>');
        }
        if (i % 7 == 6 && newWeek == false) {
            newWeek = true;
        }
        $(firstweek).append('<div class="mob-calender-day">' + weekDay[(i) % 7] + '</div>');
    }

    newWeek = true;
    var startMonth = false;
    var sd = new Date(year, month + 1, 1);
    var sday = sd.getDay();
    var firstweek = null;
    //alert(sday);
    //alert(month);
    for (var i = 0; i < 35; i++) {

        var st = new Date(year, month, 1);
        var ed = new Date(year, month + 1, 1);
        ed.setDate(ed.getDate() - 1);

        if (ed.getDate() < j)
            break;

        var td = new Date(year, month, j);
        var tdate = td.getDate();
        var tmonth = td.getMonth();
        var tyear = td.getFullYear();
        var tday = td.getDay();
        //debugger;
        if ((i + 1) >= sday) {
            startMonth = true;
        }
        if (newWeek) {
            newWeek = false;
            $("#mob-calender-d1").append('<div   data-date-start="' + j + '" data-date-end="' + (j + 7) + '" class="mob-calender-w data-dates"></div>');
            firstweek = $("#mob-calender-d1").find(".data-dates").last();
            $(firstweek).append('<div class="mob-calender-space">&nbsp;</div>');
        }
        if (i % 7 == 6 && newWeek == false) {
            newWeek = true;
        }

        if (startMonth) {
            if (date == j) {
                $(firstweek).append('<div data-date="' + tyear + '-' + (tmonth + 1) + '-' + tdate + '" class="mob-calender-day"><div class="mob-calender-day-text mob-calender-today">' + j + '</div></div>');
            }
            else
                $(firstweek).append('<div data-date="' + tyear + '-' + (tmonth + 1) + '-' + tdate + '" class="mob-calender-day"><div class="mob-calender-day-text">' + j + '</div></div>');
            j++;
        }
        else
            $(firstweek).append('<div class="mob-calender-day">&nbsp;</div>');
    }
    buildCalenderClick();

};

function buildCalenderClick() {
    $(".mob-calender-day").click(function (e) {
        $(".mob-calender").find('.mob-calender-day-text').removeClass('mob-calender-today');
        $(this).find('.mob-calender-day-text').addClass('mob-calender-today');
        //debugger;
        v_dateFrom = parseDate($(this).attr('data-date'));
        v_dateTo = parseDate($(this).attr('data-date'));
        //debugger;
    });
};

//#endregion  


//#region offer list functions
$(document).on("pageinit", "#offerlist", function (e, data) {

    function_offerlist();

    try {
        mapInitialize();
    } catch (err) {
        console.log("pageinit - Exception : " + err);
    }

    //bring dynamic
    $("#ashowcal").click(function (e) {
        if ($(this).hasClass('ui-icon-day') == true) {
            CloseCalender();
            $(this).addClass('ui-icon-calendar');
            $(this).removeClass('ui-icon-day');
        } else {
            OpenCalender();
            $(this).addClass('ui-icon-day');
            $(this).removeClass('ui-icon-calendar');
        }
    });

    CloseCalender();
    $("#ashowcal").addClass('ui-icon-calendar');
    $("#ashowcal").removeClass('ui-icon-day');
});

$(document).on("pagebeforeshow", "#offerlist", function (e, data) {
    GetStoreOfferList();
});

$(document).on("pagebeforehide", "#offerlist", function (e, data) { });

function GetStoreOfferList() {

    //var serviceUrl = "http://localhost:2497/MobileOfferFinderService.asmx/GetStoreOfferList";

    currentOfferId = null;

    var param = {
        'StartDate': v_dateFrom,
        'EndDate': v_dateTo,
        'lat': defaultLatLng.k,
        'lng': defaultLatLng.D,
        'categoryId': v_category_id,
        'productId': v_product_id,
        'retailerId': v_retailer_id,
        'countryId': v_country_id,
        'cityId': v_city_id
    };
    //debugger;
    $.ajax({
        type: "POST",
        data: JSON.stringify(param),
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        url: serviceUrl + '/GetStoreOfferList',
        success: function (jqXHR, textStatus, data) {
            //debugger;
            $('#lstOffer li').slice(1).remove();
            $("#offer-tempate-item").css('display', 'none');
            var dataJson = $.parseJSON($.parseJSON(data.responseText).d);
            for (var i = 0; i < dataJson.length; i++) {
                var itemContainer = null;
                if (i == 0)
                    itemContainer = $("#offer-tempate-item");
                else {
                    itemContainer = $("#offer-tempate-item").clone();
                    $(itemContainer).attr('id', 'offer-tempate-item-' + i);
                }

                bindValue(itemContainer, dataJson[i]);
                if (i > 0)
                    $('#lstOffer').append(itemContainer);

                var display = $(itemContainer).css('display');
                $(itemContainer).css('display', 'block')
            }
            bindOfferMouseEvents();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('error : ' + errorThrown);
        }
    });


};

function bindOfferMouseEvents() {
    $("#lstOffer li").click(function (e) {
        $("#lstOffer li").find('.offer-sales-img-container').show();
        $("#lstOffer li").find('.offer-sales-img-container-select').hide();
        $("#lstOffer li").removeClass('offer-select-back');

        $(this).find('.offer-sales-img-container').toggle();
        $(this).find('.offer-sales-img-container-select').toggle();
        $(this).toggleClass('offer-select-back');

        var id = $(this).attr('data-id');
        var detail = $(this).attr('data-detail');
        var image = $(this).attr('data-image');
        //debugger;
        currentOfferDetail = { id: id, detail: detail, image: image };
    });


    $("#lstOffer a").on("click", function (event) {
        // Prevent the usual navigation behavior
        event.preventDefault();

        //debugger;
        // Alter the url according to the anchor's href attribute, and
        // store the data-foo attribute information with the url
        $.mobile.navigate($(this).attr("href"), {
            data: { detail: currentOfferDetail.detail, image: currentOfferDetail.image }
        });


    });
};

function bindValue(item, dataJson) {
    $(item).attr('data-id', dataJson.ID);
    $(item).attr('data-detail', dataJson.DESC);
    $(item).attr('data-image', dataJson.IMAGE_LINK);

    $(item).find('.offer-sales-detail').attr('data-detail', dataJson.DESC);
    $(item).find('.offer-sales-detail').attr('data-image', dataJson.IMAGE_LINK);

    $(item).find('.offer-data-organization').html(dataJson.STORE_NAME);
    $(item).find('.offer-data-title').html(dataJson.TITLE);
    $(item).find('.offer-data-address').html(dataJson.STORE_ADDRESS);
    $(item).find('.offer-sales-text').html(dataJson.PER_SALES + '%');
    //debugger;
    $(item).find('.offer-img-container').css('background-image', "url('" + dataJson.THUMP_URL + "')");
    return item;
};
//#endregion


//#region detail

$(document).on("pagebeforeshow", "#detail", function (e, data) {
    //debugger;
    if (currentOfferDetail != null) {
        var detail = currentOfferDetail.detail;
        var image = currentOfferDetail.image;

        $("#detail").find("#details-main").css('background-image', "url('" + image + "')");
        $("#detail").find("#detailContainer").html("<p>" + detail + "</p>");
    }
});

$(document).on("pagebeforehide", "#detail", function () {
    currentOfferDetail = null;
});
//#endregion


//#region map page  
var map = null;
var center;
var markersArray = [];
var isLog = 1;
var defaultLatLng = null;
var directionsService = null;

function log() {

    if (isLog == 1 && window.console && window.console.log) {
        console.log.apply(this, arguments);
    }
}

$(document).on("pagebeforehide", "#map-page", function () {
    console.log('#map-page -> pagebeforehide -> success');

    try {
        clearOverlays();
        createMarker(center, "XXXXX");
        createMarker(new google.maps.LatLng(29.313191, 48.006735), "YYYY");
    } catch (err) {
        console.log("pagebeforehide - Exception : " + err);
    }
});

$(document).on("pagebeforeshow", "#map-page", function () {
    //debugger;
    if (currentOfferDetail != null) {
        var storeLocation = null;
        var param = { offerId: currentOfferDetail.id };

        $.ajax({
            type: "POST",
            data: JSON.stringify(param),
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            url: serviceUrl + '/GetStore',
            success: function (jqXHR, textStatus, data) {
                //debugger;
                var dataJson = $.parseJSON($.parseJSON(data.responseText).d);
                //debugger;
                defaultLatLng = new google.maps.LatLng(dataJson.LATITUDE, dataJson.LONGTIUDE);
                center = defaultLatLng;
                map.setCenter(defaultLatLng);
                
                var directionsRequest = {
                    origin: getDefaultLatLng(),
                    destination: defaultLatLng,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC
                }; 

                var storeLocation = { "markers": [{ "latitude": dataJson.LATITUDE, "longitude": dataJson.LONGTIUDE, "title": dataJson.NAME, "content": dataJson.ADDRESS1 + "," + dataJson.ADDRESS2 + "," + dataJson.ADDRESS3 }] };
                try {
                    //var jsonData = $.parseJSON('{"markers":[ { "latitude":29.48395, "longitude":47.80586, "title":"Kuwait City", "content":"Kuwait City" }, { "latitude":29.34040, "longitude":47.64381, "title":"Al Jahra", "content":"Al Jahra" }, { "latitude":29.09589, "longitude":48.03795, "title":"Al Ahmadi", "content":"Al Ahmadi" }, { "latitude":29.32962, "longitude":48.03795, "title":"Jabriya", "content":"Jabriya" }, { "latitude":29.34518, "longitude":47.96379, "title":"Kaifan", "content":"Kaifan" } ]}');
                    $.each(storeLocation.markers, function (i, marker) {
                        createMarker(new google.maps.LatLng(marker.latitude, marker.longitude), marker.content);
                    });

                    var markerYou = new google.maps.Marker({
                        position: getDefaultLatLng(),
                        map: map,
                        title: "You"
                    });
                    markersArray.push(markerYou);

                   // directionsDisplay.setMap(null);

                    directionsService.route(
                       directionsRequest,
                       function (response, status) {
                           if (status == google.maps.DirectionsStatus.OK) {
                               new google.maps.DirectionsRenderer({
                                   map: map,
                                   directions: response
                               });
                           }
                           else
                               alert("Unable to retrieve your route<br />");
                       }
                       );

                    //directionsDisplay.setMap(map);

                } catch (err) {
                    console.log("pagebeforeshow - Exception : " + err);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error : ' + textStatus);
            }
        });

        console.log('#map-page -> pagebeforeshow -> success');

    }
});


$(document).on("pageinit", "#map-page", function () {
    console.log('#map-page -> pageinit -> success');

    try {
        mapInitialize();
    } catch (err) {
        console.log("pageinit - Exception : " + err);
    }


    console.log('#map-page -> pageinit - END');
});

function mapInitialize() {

    directionsService = new google.maps.DirectionsService( );

    if (map == null) {
        if (defaultLatLng == null)
            defaultLatLng = getDefaultLatLng();
        //defaultLatLng = new google.maps.LatLng(29.3697, 47.9783);
        center = defaultLatLng;

        var myOptions = {
            zoom: 13,
            center: defaultLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
    }
}

function addMarker(location) {
    marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markersArray.push(marker);
}

// Removes the overlays from the map, but keeps them in the array
function clearOverlays() {
    if (markersArray) {
        for (i in markersArray) {
            markersArray[i].setMap(null);
        }
    }
}

// Shows any overlays currently in the array
function showOverlays() {
    if (markersArray) {
        for (i in markersArray) {
            markersArray[i].setMap(map);
        }
    }
}

// Deletes all markers in the array by removing references to them
function deleteOverlays() {
    if (markersArray) {
        for (i in markersArray) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
    }
}

function createMarker(latlng, info) {

    var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h3 id="firstHeading" class="firstHeading">Store Info</h3>' +
        '<div id="bodyContent">' +
        '<p><b>Address : </b>' + info + '</p>' +
        '</div>' +
        '</div>';

    // Add an overlay to the map of current lat/lng
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: "Store!"
    });

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    google.maps.event.addListenerOnce(map, 'idle', function () {
        google.maps.event.trigger(map, 'resize');
        map.setCenter(center);
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
    });
    markersArray.push(marker);
}

function getDefaultLatLng() {
    var defaultLatLng = new google.maps.LatLng(25.2040945, 55.3152896);  // Default to Dubai, CA when no geolocation support
    if (navigator.geolocation) {
        function success(pos) {
            // Location found, show map with these coordinates
            //drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            defaultLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        }
        function fail(error) {
            //drawMap(defaultLatLng);  // Failed to find location, show default map
        }
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, { maximumAge: 500000, enableHighAccuracy: true, timeout: 6000 });
    }
    return defaultLatLng;
}

$(document).on("mobileinit", function () {
    //$.mobile.ajaxEnabled = false;
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.phonegapNavigationEnabled = true;
    //$.mobile.transitionFallbacks.slideout = "none"
});

app.initialize();
//#endregion


//#region Search 
$(document).on("pagebeforeshow", "#search", function (e, data) {
    bindSearchData();
});

$(document).on("pagebeforehide", "#search", function () {

});


$(document).on("pageinit", "#search", function () {
    buildClear();
    BindCalender();
    BuildAutoCompile("#lstCategory", serviceUrl + '/GetCategory');
    BuildAutoCompile("#lstProduct", serviceUrl + '/GetProduct');
    BuildAutoCompile("#lstRetailer", serviceUrl + '/GetRetailer');
    BuildAutoCompile("#lstCountry", serviceUrl + '/GetCountry');
    BuildAutoCompile("#lstCity", serviceUrl + '/GetCity');
});

function BindCalender() {

    $('#txtDateFrom').bind('change', function (e) {
        e.stopImmediatePropagation();
        var date = $(this).val();
        v_dateFrom = parseDate(date);
    });

    $('#txtDateTo').bind('change', function (e) {
        e.stopImmediatePropagation();
        var date = $(this).val();
        v_dateTo = parseDate(date);
    });

};

function parseDate(input) {
    var parts = input.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]); // Note: months are 0-based
};

function buildClear() {
    $("#aClearAll").click(function (i, e) {
        //debugger;
        ClearData("#lstCategory");
        ClearData("#lstProduct");
        ClearData("#lstRetailer");
        ClearData("#lstCountry");
        ClearData("#lstCity");

        $('#txtDateFrom').val('');
        $('#txtDateTo').val('');

        v_dateFrom = new Date(1990, 0, 1);
        v_dateTo = new Date(1990, 0, 1);

        v_category_id = -1;
        v_category_name = null;
        v_product_id = -1;
        v_product_name = null;
        v_retailer_id = -1;
        v_retailer_name = null;
        v_country_id = -1;
        v_country_name = null;
        v_city_id = -1;
        v_city_name = null;
    });
};

function bindSearchData() {
    if (v_category_id != -1) {
        SetData("#lstCategory", v_category_id, v_category_name)
    }

    if (v_product_id != -1) {
        SetData("#lstProduct", v_product_id, v_product_name)
    }

    if (v_retailer_id != -1) {
        SetData("#lstRetailer", v_retailer_id, v_retailer_name)
    }

    if (v_country_id != -1) {
        SetData("#lstCountry", v_country_id, v_country_name)
    }

    if (v_city_id != -1) {
        SetData("#lstCity", v_city_id, v_city_name)
    }

    var stdDate = new Date(1990, 0, 1);
    if (v_dateFrom != stdDate) {
        var tdate = v_dateFrom.getDate();
        var tmonth = v_dateFrom.getMonth();
        var tyear = v_dateFrom.getFullYear();
        $('#txtDateFrom').val(tyear + "-" + pad((tmonth + 1), 2) + "-" + pad(tdate, 2));
    }

    if (v_dateTo != stdDate) {
        $('#txtDateTo').val(v_dateTo);
    }

};

function SetData(listSelector, id, text) {
    var form = $(listSelector).prev("form");
    var input = $(form).find("input");

    $(input).attr('data-Id', id);
    $(input).val(text);
};

function ClearData(listSelector) {
    var form = $(listSelector).prev("form");
    var input = $(form).find("input");

    $(input).attr('data-Id', -1);
    $(input).val('');
};

function BuildAutoCompile(listSelector, serviceFullName) {
    $(listSelector).on("filterablebeforefilter", function (e, data) {
        var $ul = $(this),
            $input = $(data.input),
            value = $input.val(),
            html = "";
        $ul.html("");
        if (value && value.length > 1) {
            $ul.html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>");
            $ul.listview("refresh");

            var findStr = $input.val();
            var param = {
                'find': findStr
            };

            $.ajax({
                type: "POST",
                data: JSON.stringify(param),
                crossDomain: true,
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                url: serviceFullName,
                success: function (jqXHR, textStatus, data) {

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('error : ' + textStatus);
                }
            }).then(function (response) {
                var dataJson = $.parseJSON(response.d);
                $.each(dataJson, function (i, val) {
                    html += "<li data-id='" + val.Key + "' >" + val.Value + "</li>";
                });
                $ul.html(html);
                $ul.listview("refresh");
                $ul.trigger("updatelayout");
            });

        }
    });

    $(listSelector).on('click', 'li', function () {
        //var form = $(listSelector).prev("form");
        //var input = $(form).find("input");
        //$(input).attr('data-Id', $(this).attr('data-Id'));
        //$(input).val($(this).text());

        SetData(listSelector, $(this).attr('data-Id'), $(this).text());
        $(listSelector).find('li').hide()



        if (listSelector == "#lstCategory") {
            v_category_id = parseInt($(this).attr('data-Id'));
            v_category_name = $(this).text();
        } else if (listSelector == "#lstProduct") {
            v_product_id = parseInt($(this).attr('data-Id'));
            v_product_name = $(this).text();
        } else if (listSelector == "#lstRetailer") {
            v_retailer_id = parseInt($(this).attr('data-Id'));
            v_retailer_name = $(this).text();
        } else if (listSelector == "#lstCountry") {
            v_country_id = parseInt($(this).attr('data-Id'));
            v_country_name = $(this).text();
        } else if (listSelector == "#lstCity") {
            v_city_id = parseInt($(this).attr('data-Id'));
            v_city_name = $(this).text();
        }
    });
};

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}
//#endregion