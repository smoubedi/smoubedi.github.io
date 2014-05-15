

//GLOBAL
var inWelcomePage = true;
var siteBusy = false;

var centerIndex=null;
var leftIndex=null;
var rightIndex=null;

$(window).load(function(){
    
    $(".navs").attr("onclick","navsFunction(this)");
    $('#HOME').attr("onclick", "homePageClick(null); navsFunction(this);")
    //navsFunction(document.getElementById("HOME"));
   
  
    
});



$( document ).on('click', 'span.close', function(event) {
        
    $( "#projectDetailsPage" ).animate({left: "100%"}, 700, function() {
        $( "#project-ajaxLoader" ).empty();
    });
    
});

$( document ).on('click', '.projectBar', function(event) {

    var target = $(event.target).closest('.projectBar');
    var nextPageURL = "./Projects/" + target.attr('title').split(' ').join('_') + '.html';
    
    $('#loading').css({display:'inherit'});
    $('#project-ajaxLoader').load(nextPageURL, function(garbage, status, xhr ) {
            if ( status == "error" ) {
                $('#loading').css({display:'none'});
                //HTTP 404 ERROR HERE :)
                alert("Sorry but there was an error: "+ xhr.status + " " + xhr.statusText);
            }
            else{
               $('img, video').load(function(){
                    $('#loading').css({display:'none'});
                    $( "#projectDetailsPage" ).animate({left: "0%"}, 700);
                });
            }
    });

    
    
    
});
    
    
    
    
function navsFunction(thisObj){
    
    if(!siteBusy){
        updateNavBar(thisObj);
        switchPage(thisObj);
    }
    
}


function homePageClick(thisObj){

    if(thisObj!=null){
        $("#" + thisObj.title.replace(" ","_")).click();
    }


	//$('img, video').load(function(){
		var value = (inWelcomePage)?0:100;
		var hidden = (inWelcomePage)?"auto":"hidden";
		//$("body").css("overflow", hidden );
		//$("#welcomeBlankInside").css("opacity",(value/100));
		//$(".welcomeButtons").css("display","none");
		$("#welcomeBlank").css("height",value + "%");
		$("#banner").css("top",value + "%");
		//$("#welcomeHolder").css("top",(-100 + value) + "%");
	
	
		inWelcomePage = (inWelcomePage)?false:true;
	    centerIndex = (inWelcomePage)?null:centerIndex;
	//});
}

function updateNavBar(thisObj){

    //color the link orange
    $('a').css('color', 'inherit');
    $(thisObj).css('color', 'rgb(209, 155, 0)');
    
    var left = $(thisObj).offset().left;
    var right = $(window).width() - left - $("#bannerInner").offset().left;
    
    var width = $(thisObj).outerWidth();
    
    var midPoint = right - (width/2); 
    var triangleWidth = $('#triangle').outerWidth();
    $("#triangle").css("right", midPoint-(triangleWidth/2) );    
}

function getNextPagePosition(thisObj){
    //if home, do soemmthing
    //
    if(thisObj.id != "HOME")
    {
        if(siteBusy){  return "BUSY";}
        else{
            
            var newIndex = $(thisObj).index();
            
            if(centerIndex==null){
                centerIndex = newIndex;
                return "centerPage";
            }
            
            if(newIndex > centerIndex)
            {
                if(rightIndex == newIndex)
                {
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

            if(newIndex < centerIndex)
            {
                if(leftIndex == newIndex)
                {
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
            
            if(newIndex == centerIndex)
            {
                return "BUSY";
                //just dont do anything
            }
        }
    }
    else{
        centerIndex=null;
    }
}

function switchPage(thisObj){
    
    var nextPageURL = "./" + thisObj.id + ".html";
    var nextPagePosition = getNextPagePosition(thisObj);
    
    switch (nextPagePosition) {
            
      case "rightPage":
                
        siteBusy = true;

        $('#'+nextPagePosition).load(nextPageURL, function(garbage, status, xhr  ) {
            if ( status == "error" ) {alert("Sorry but there was an error: "+ xhr.status + " " + xhr.statusText);}
            else{swapPages(nextPagePosition);}
        });
        break;
            
      case "leftPage":
            
        siteBusy = true;
            
        $('#'+nextPagePosition).load(nextPageURL, function(garbage, status, xhr ) {
            if ( status == "error" ) {alert("Sorry but there was an error: "+ xhr.status + " " + xhr.statusText);}
            else{swapPages(nextPagePosition);}
        });
        break;
            
      case "rightPage_NOLOAD":
            
        siteBusy = true;
        swapPagesNoLoad("rightPage");
        break;
            
      case "leftPage_NOLOAD":
            
        siteBusy = true;
        swapPagesNoLoad("leftPage");
        break;
            
      case "centerPage":
        $('#'+nextPagePosition).load(nextPageURL, function(garbage, status, xhr  ) {
            if ( status == "error" ) {alert("Sorry but there was an error: "+ xhr.status + " " + xhr.statusText);}}
        );
        break;
            
      case "BUSY":
        break;
            
    }    
}

function swapPages(nextPagePosition){
    
    $(".ajaxLoader").css("overflow","hidden");
    
    var nextPageDOM = document.getElementById(nextPagePosition);
    var origPageDOM = document.getElementById("centerPage");
    var unusedPageDOM = (nextPagePosition=="rightPage")?document.getElementById("leftPage"):document.getElementById("rightPage");

    var prevOffset = nextPageDOM.style.left;
    var prevPosition = nextPagePosition; 

    nextPageDOM.style.left = origPageDOM.style.left;
    origPageDOM.style.left = unusedPageDOM.style.left;

    var prevTransition = $(".ajaxLoader").css("transition");

    setTimeout(function() {  

        $(".ajaxLoader").css("transition","left 0s");

        unusedPageDOM.style.zIndex = "0";
        unusedPageDOM.style.left = prevOffset;
        unusedPageDOM.style.zIndex = "1";


        nextPageDOM.id = origPageDOM.id;
        origPageDOM.id = unusedPageDOM.id;
		unusedPageDOM.id = prevPosition;

        setTimeout(function() { 
            $(".ajaxLoader").css({"transition":prevTransition , "overflow":"auto"});
            siteBusy = false;
        },20);

    },700)   
}


function swapPagesNoLoad(nextPagePosition){
    
    $(".ajaxLoader").css("overflow","hidden");
    
    var nextPageDOM = document.getElementById(nextPagePosition);
    var origPageDOM = document.getElementById("centerPage");
    var unusedPageDOM = (nextPagePosition=="rightPage")?document.getElementById("leftPage"):document.getElementById("rightPage");

    var prevOffset = nextPageDOM.style.left;
    var prevPosition = nextPagePosition; 

    nextPageDOM.style.left = origPageDOM.style.left;
    origPageDOM.style.left = unusedPageDOM.style.left;

    var prevTransition = $(".ajaxLoader").css("transition");

    setTimeout(function() {  

        $(".ajaxLoader").css("transition","left 0s");

        unusedPageDOM.style.zIndex = "0";
        unusedPageDOM.style.left = prevOffset;
        unusedPageDOM.style.zIndex = "1";


        nextPageDOM.id = origPageDOM.id;
        origPageDOM.id = unusedPageDOM.id;
		unusedPageDOM.id = prevPosition;

        setTimeout(function() { 
            $(".ajaxLoader").css({"transition":prevTransition , "overflow":"auto"});
            siteBusy = false;
        },20);

    },700)   
}
