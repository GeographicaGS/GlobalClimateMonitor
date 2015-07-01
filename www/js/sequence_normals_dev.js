/**
 Author: Jose Ignacio Alvarez Francoso 
 Company: University of Sevilla.
 */
var n,img,month,variable;
var loadSequence = function(){
$('#container').empty();
var months = [];
 months[1] = 'January';
 months[2] = 'February';
 months[3] = 'March';
 months[4] = 'April';
 months[5] = 'May';
 months[6] = 'June';
 months[7] = 'July';
 months[8] = 'August';
 months[9] = 'September';
 months[10] = 'October';
 months[11] = 'November';
 months[12] = 'December';

 var month = $("#month").val();
 var MonthName = months[month];
 var period = $( "#period" ).val();
 var period_text = String(Number(period) - 29) + '-' + period;
 var variable = $( "#variable" ).val();
 var variable_p = variable + '_' + period


for (var i = month, n = 1; i < 13; i++, n++) {
    var img = document.createElement('img');
    img.src = '../images/gcm/' + variable_p + "_" + i + '.png';
	zind = String(13 - i);
	img.style.zIndex = zind;
    container.appendChild(img);
	document.getElementById('loadmessage').innerHTML = 'Loading data...please wait. Images loaded:' + String(n-1);
	momento.innerHTML = MonthName.substring(0,3) + '-Dec' + '/' + period_text;

}
document.getElementById('loadmessage').innerHTML = 'Loaded data. Images loaded:' + String(n-1);;
}

var runSequence = function(){

	var animacion =	$('#container img').each(function(i) {
		var count = $('#container img').length;
		if (i==count-1){
		return false;
		}
		var period = $( "#period" ).val();
		var period_text = String(Number(period) - 29) + '-' + period;
		var MonthName = $("#month").val();	
		momento.innerHTML = MonthName + '/' + period_text;
//		var speed = Number($("input[type=range]").val());
		$(this).css('z-index', 12 - i);
		$(this).delay((i++) * 500 ).fadeTo(1000, 0);
		
	});

}
var updateLegend = function() {
	var layname = $( "#variable" ).val();
//	var img = document.createElement('img');
//    img.src = '/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer='+layname+'&format=image/png&style=&width=12&height=12';
	$( "#leyendacapa img" ).replaceWith( "<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer="+layname+"&format=image/png&style=&width=12&height=12'/>" );
}
$('#start_a').on('click', function(){
    loadSequence(); 
	runSequence();
	updateLegend();
});
$('#resume_a').on('click', function(){
	runSequence();
});
$('#stop_a').on('click', function () {
    $('#container img').clearQueue();
	$('#container img').stop();
});
$('#variable').on('change', function(){
    loadSequence(); 
	updateLegend();
});
$('#month, #period').on('change', function(){
    loadSequence(); 
});
//scripts
/**
 Author: Alberto Asuero - Raúl Yeguas 
 Company: Geographica - www.geographica.gs
 */
$('#sidebar nav h2').not('#about-and-contact h2').click(function (e) {
    e.preventDefault();
    $('nav ul li.expanded').removeClass('expanded').children('.controls').eq(0).slideUp();
    $(this).parent().addClass('expanded');
});

$('header a').click(function (e) {
    e.preventDefault();
    var $resume = $('#sidebar .resume');
    var $selectedLi = $('#sidebar nav li.expanded');

    if ($selectedLi.length > 0) {
        $resume.html('<span class="category">' + $selectedLi.children('h2').eq(0).html() + '</span>');
        var $selects = $selectedLi.find('select');
        $resume.append('<span class="criteria">' + $selects.eq(0).val() + '</span>');
        $resume.append(' ' + $selects.eq(1).val() + ' ' + $selects.eq(2).val());
    }

    $('#sidebar').toggleClass('contracted');
    resizeMe();
});

$('#sidebar nav .resume').click(expandSidebar);
$('#sidebar header .expand_btn').click(expandSidebar);

$('#legend2 h3').click(function (e) {
    e.preventDefault();
    //$(this).parent().find('.content').eq(0).slideToggle();
    if ($(this).hasClass("contracted")) {
        $(this).removeClass("contracted");
    }
    else {
        $(this).addClass("contracted");
    }
    $(this).parent().find('.content,.slider').slideToggle();
});

function expandSidebar(e) {
    e.preventDefault();
    $sidebar = $('#sidebar');
    if ($sidebar.hasClass('contracted')) {
        $sidebar.removeClass('contracted');
    }

    resizeMe();
}


$(document).on("click", ".close_fancy", function () {
    $.fancybox.close();
});



$(document).on("click", "#about-and-contact", function () {
    $.get("about/about.html", function (html) {
        $.fancybox({
            'content': html, 
            'height' : 700,
            'autoDimensions':false,
            'autoSize':false
        });
    });
});

$(document).on("click", "#news", function () {
    window.open("http://grupo.us.es/climatemonitor/news");
});
$(document).on("click", "#report", function () {
    window.open("http://www.ncdc.noaa.gov/sotc/global");
});