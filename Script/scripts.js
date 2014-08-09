//GLOBAL
var inWelcomePage = true;
var inProjectPage = false;
var siteBusy = false;
var dontDoAnything = false;
var loadedMAP = {};
var loadQueue = [];

var centerIndex = null;
var leftIndex = null;
var rightIndex = null;

var projectIndex = null;

var easing = 'swing';


$(document).ready(function() {
    NProgress.configure({
        trickleRate: 0.08,
        trickleSpeed: 50
    });
    NProgress.delayedDone = function() {
        setTimeout(function() {
            NProgress.done();
        }, 200);
    }
    NProgress.start();

    if (window.location.hash.indexOf('#') >= 0) {
        var newVal = window.location.hash.split("#/")[1] || '';
        newVal = (newVal === 'projects') ? 'hardware' : newVal;
        var newVal = newVal.toUpperCase();

        dealWithHash(newVal);
    }

});

$(window).load(function() {
    //$.backstretch("http://dl.dropbox.com/u/515046/www/garfield-interior.jpg");
    $.backstretch("../Images/background-2.jpg");
    $(".fancybox").fancybox();
    NProgress.done();

    $(document).ajaxStart(function() {
        NProgress.start();
    });
    $(document).ajaxComplete(function(event, xhr, options) {
        NProgress.delayedDone();
    });
});


window.addEventListener("hashchange", function(hash) {

    if (inProjectPage) {
        closeProjectPage();
        dontDoAnything = true;
    }

    var newVal = hash.newURL.split("#/")[1] || 'home';
    var newVal = newVal.toUpperCase();

    if (siteBusy) {
        $("*").finish();
        siteBusy = false;
    }
    if (!dontDoAnything) {
        dealWithHash(newVal);
    } else {
        dontDoAnything = false;
        inProjectPage = false;
        window.history.forward();
    }
}, false);

function dealWithHash(hash) {

    if (inProjectPage) {
        closeProjectPage();
    }

    if (inWelcomePage) {
        homePageClick($('#banner #' + hash)[0]);
    } else {
        if (hash === 'HOME') {
            homePageClick(null);
        }
        navsFunction($('#banner #' + hash)[0]);
    }
}

function navsFunction(thisObj) {
    switchPage(thisObj);
}

function homePageClick(thisObj) {

    if (thisObj != null) {
        navsFunction(thisObj);
    }
    var value = (inWelcomePage) ? 0 : 100;
    var hidden = (inWelcomePage) ? "auto" : "hidden";
    $("#welcomeBlank").css("height", value + "%");
    $("#banner").css("top", value + "%");

    inWelcomePage = (inWelcomePage) ? false : true;
    centerIndex = (inWelcomePage) ? null : centerIndex;
}

function updateNavBar(thisObj) {

    //color the link orange
    $('a').css('color', 'inherit');
    $(thisObj).css('color', 'goldenrod');

    var left = $(thisObj).offset().left;
    var right = $(window).width() - left - $("#bannerInner").offset().left;

    var width = $(thisObj).outerWidth();

    var midPoint = right - (width / 2);
    var triangleWidth = $('#triangle').outerWidth();
    $("#triangle").css("right", midPoint - (triangleWidth / 2));
}


function switchPage(thisObj) {

    var nextPageURL = "./MainPages/" + thisObj.id + ".html";
    var nextPageName = thisObj.id;
    var nextPagePosition = getNextPagePosition(thisObj);


    switch (nextPagePosition) {

        case "rightPage":

            siteBusy = true;
            $('#loading').toggle();

            if (loadedMAP[nextPageName]) {
                $('#' + nextPagePosition).html(loadedMAP[nextPageName]);
                swapPages(nextPagePosition);
                updateNavBar(thisObj);
                break;
            }

            $('#' + nextPagePosition).load(nextPageURL, function(garbage, status, xhr) {
                $('#loading').toggle();
                if (status == "error") {
                    alert("Sorry but there was an error: " + xhr.status + " " + xhr.statusText);
                } else {

                    swapPages(nextPagePosition);
                    updateNavBar(thisObj);
                    loadedMAP[nextPageName] = xhr.responseText;
                }
            });
            break;

        case "leftPage":

            siteBusy = true;
            $('#loading').toggle();

            if (loadedMAP[nextPageName]) {
                $('#' + nextPagePosition).html(loadedMAP[nextPageName]);
                swapPages(nextPagePosition);
                updateNavBar(thisObj);
                break;
            }

            $('#' + nextPagePosition).load(nextPageURL, function(garbage, status, xhr) {
                $('#loading').toggle();
                if (status == "error") {
                    alert("Sorry but there was an error: " + xhr.status + " " + xhr.statusText);
                } else {
                    swapPages(nextPagePosition);
                    updateNavBar(thisObj);
                    loadedMAP[nextPageName] = xhr.responseText;
                }
            });
            break;

        case "rightPage_NOLOAD":

            siteBusy = true;
            swapPages("rightPage");
            updateNavBar(thisObj);
            break;

        case "leftPage_NOLOAD":

            siteBusy = true;
            swapPages("leftPage");
            updateNavBar(thisObj);
            break;

        case "centerPage":
            $('#loading').toggle();

            if (loadedMAP[nextPageName]) {
                $('#' + nextPagePosition).html(loadedMAP[nextPageName]);
                updateNavBar(thisObj);
                break;
            }

            $('#' + nextPagePosition).load(nextPageURL, function(garbage, status, xhr) {
                $('#loading').toggle();
                updateNavBar(thisObj);
                loadedMAP[nextPageName] = xhr.responseText;
                if (status == "error") {
                    alert("Sorry but there was an error: " + xhr.status + " " + xhr.statusText);
                }
            });
            break;

        case "BUSY":
            break;

    }
}

function getNextPagePosition(thisObj) {
    //if home, do soemmthing
    //
    if (thisObj.id != "HOME") {
        if (siteBusy) {
            return "BUSY";
        } else {

            var newIndex = $(thisObj).index();

            if (centerIndex == null) {
                centerIndex = newIndex;
                return "centerPage";
            }

            if (newIndex > centerIndex) {
                if (rightIndex == newIndex) {
                    rightIndex = leftIndex;
                    leftIndex = centerIndex;
                    centerIndex = newIndex;
                    return "rightPage_NOLOAD"
                }
                rightIndex = leftIndex;
                leftIndex = centerIndex;
                centerIndex = newIndex;
                return "rightPage";
            }

            if (newIndex < centerIndex) {
                if (leftIndex == newIndex) {
                    leftIndex = rightIndex;
                    rightIndex = centerIndex;
                    centerIndex = newIndex;
                    return "leftPage_NOLOAD"
                }
                leftIndex = rightIndex;
                rightIndex = centerIndex;
                centerIndex = newIndex;
                return "leftPage";
            }

            if (newIndex == centerIndex) {
                return "BUSY";
                //just dont do anything
            }
        }
    } else {
        centerIndex = null;
    }
}

function swapPages(nextPagePosition) {

    $(".ajaxLoader").css("overflow", "hidden");

    var nextPageDOM = document.getElementById(nextPagePosition);
    var origPageDOM = document.getElementById("centerPage");
    var unusedPageDOM = (nextPagePosition == "rightPage") ? document.getElementById("leftPage") : document.getElementById("rightPage");

    $(nextPageDOM).scrollTop(0);

    var prevOffset = nextPageDOM.style.left;
    var prevPosition = nextPagePosition;

    $(nextPageDOM).animate({
        left: $(origPageDOM).css('left')
    }, 700, easing);
    $(origPageDOM).animate({
        left: $(unusedPageDOM).css('left')
    }, 700, easing, function() {

        unusedPageDOM.style.zIndex = "0";
        unusedPageDOM.style.left = prevOffset;
        unusedPageDOM.style.zIndex = "1";

        nextPageDOM.id = origPageDOM.id;
        origPageDOM.id = unusedPageDOM.id;
        unusedPageDOM.id = prevPosition;

        $('#rightPage').css('left', 'calc(2/3 * 100%)')
        $('#centerPage').css('left', 'calc(1/3 * 100%)')
        $('#leftPage').css('left', '0%')

        $('.ajaxLoader').scrollTop();

        $(".ajaxLoader").css({
            "overflow": "auto"
        });
        siteBusy = false;

    });
}


$(document).on('click', 'span.close', function(event) {
    closeProjectPage();
});

function showProjectPage() {
    $('#loading').css({
        display: 'none'
    });
    $("#projectDetailsPage").animate({
        left: "0%"
    }, 700);
};

function closeProjectPage() {

    //window.location.href = window.location.href.replace('/project', '');

    $("#projectDetailsPage").finish().animate({
        left: "100%"
    }, 700, function() {
        inProjectPage = false;
        projectIndex = null;
    });
};

$(document).on('click', '.projectBar', function(event) {

    var target = $(event.target).closest('.projectBar');
    var nextPageURL = "./Projects/" + target.attr('title').split(' ').join('_') + '/project.html';

    //window.location.href = '#/' + window.location.href.split('#/')[1] + '/project';

    inProjectPage = true;
    projectIndex = target.index();

    $('#loading').css({
        display: 'inherit'
    });
    $('#project-ajaxLoader').load(nextPageURL, function(garbage, status, xhr) {
        if (status == "error") {
            $('#loading').css({
                display: 'none'
            });
            //HTTP 404 ERROR HERE :)
            alert("Sorry but there was an error: " + xhr.status + " " + xhr.statusText);
        } else {
            $('img, video').load(function() {
                showProjectPage();
            });
        }
    });
});


// SIDE NAV BUTTONS

$('#at4-share').hover(function() {
    $('#at4-sccc').css('opacity', 1);
});
$(document).on('click', '.at4-arrow', function(event) {

    var target = $(event.target);
    if (event.target.title == 'Hide') {

        $('#at4-soc').css('left', 'initial');
        $('.atss-left').animate({
            left: '-50px'
        }, 300, function() {

            $('#at4-share').removeClass('slideInLeft at4-show').addClass('slideOutLeft at4-hide');
            $('.atss-left').css('left', '0');
        });
    } else {

        $('#at4-soc').animate({
            left: '-15px'
        }, 200);
        $('#at4-share').removeClass('slideOutLeft at4-hide').addClass('slideInLeft at4-show');
        // $('#at4-soc').css({display : "none!important",opacity: "0!important"});
    }
});


// KEY PRESS EVENTS
/*
$(document).keydown(function(e) {

    if (!inWelcomePage && !inProjectPage) { //in main page

        var navs = $('.navs');

        if (e.keyCode == 37) { // left
            var index = centerIndex - 1;

            if (navs[index]) {
                navs[index].click();
            }
        } else if (e.keyCode == 39) { // right
            var index = centerIndex + 1;

            if (navs[index]) {
                navs[index].click();
            }
        } else if (e.keyCode == 40) { //down

            if (projectIndex == null) {
                var nextProj = $('#centerPage .projectBar')[0];
                if (nextProj) {
                    nextProj.click()
                }
            }
        } else if (e.keyCode == 38) { //up

            if (projectIndex == null) {
                var bars = $('#centerPage .projectBar');
                if (bars && bars.length > 0) {
                    bars[bars.length - 1].click();
                }
            }
        }
    } else if (inWelcomePage && !inProjectPage) { // in welcome page

        if (e.keyCode == 39) {

            $('.welcomeButtons')[0].click();
        }
    } else if (!inWelcomePage && inProjectPage) { //in project page

        if (e.keyCode == 39) { //down

            if (1 / projectIndex) {
                var nextProj = $('#centerPage .projectBar')[projectIndex + 1];

                if (nextProj) {
                    nextProj.click();
                } else {
                    closeProjectPage();
                }
            }

        } else if (e.keyCode == 37) { //up

            if (1 / projectIndex) {
                var nextProj = $('#centerPage .projectBar')[projectIndex - 1];

                if (nextProj) {
                    nextProj.click();
                } else {
                    closeProjectPage();
                }
            }
        }
    }
    //EXIT COMMANDS
    if (e.keyCode == 8 || e.keyCode == 27 || e.keyCode == 35 || e.keyCode == 36) {
        e.preventDefault();

        if (inWelcomePage) {
            window.history.back();
        }
        if (inProjectPage) {
            closeProjectPage();
        }
        if (!inProjectPage && !inWelcomePage) {
            $('.navs')[0].click();
        }

    }
});
*/
