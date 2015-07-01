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

$('#legend h3').click(function (e) {
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


function resizeMe() {
    var w = $(window).width() - $("#sidebar").width() - 2;
    $("#map").width(w);
    $("#map").height($(window).height()).css("left", $("#sidebar").width() + "px");
    if (map) {
        map.updateSize();
    }
}

$(window).resize(resizeMe);

$(document).on("click", ".close_fancy", function () {
    $.fancybox.close();
});

//Mensaje Survey
$(document).ready(function() {
/**
 * jQuery Delay - A delay function
 * Copyright (c) 2009 Clint Helfers - chelfers(at)gmail(dot)com |
http://blindsignals.com
 * Dual licensed under MIT and GPL.
 * Date: 7/01/2009
 * @author Clint Helfers
 * @version 1.0.0
 *
 * http://blindsignals.com/index.php/2009/07/jquery-delay/
 */

$.fn.delay = function( time, name ) {
  return this.queue( ( name || "fx" ), function() {
  var self = this;
  setTimeout(function() { $.dequeue(self); } , time );
});
};
// ***************************
// howto courtesy of JFK
  $('a.fancydelay').fancybox({
  'content': "Please, take 1 minute to complete our survey once you have finnished. You can do it by clicking on the icon button in the top left corner of the map.",
  'height' : 115,
  'width' : 240,
  'autoDimensions': false,
  'autoSize': false,
  'overlayShow': false,
// set delay in milliseconds so 5000=5 secs
// 'callbackOnStart': function(){$("#fancy_outer").delay(5000);}
 });
});
//Fin mensaje survey


$(document).on("change", "#layer_switcher", function () {
    var sel = $(this).val();

    world_limits.setVisibility(false);
    osm.setVisibility(false);
/*    gmap.setVisibility(false);
    gsat.setVisibility(false);
    ghyb.setVisibility(false);
    gter.setVisibility(false);
*/
    switch (sel)
    {
        case "world_limits":
            world_limits.setVisibility(true);
            break;
        case "osm":
            osm.setVisibility(true);
            break;
        case "gmap":
            gmap.setVisibility(true);
            break;
        case "gsat":
            gsat.setVisibility(true);
            break;
        case "ghyb":
            ghyb.setVisibility(true);
            break;
        case "gter":
            gter.setVisibility(true);
            break;
    }

});

$(document).on("click", "#ctrl_info_ctrl", function () {
	if ($(this).hasClass("enable")) {
        $(this).removeClass("enable");
        info.deactivate();
    }
    else {
        $(this).addClass("enable");
        info.activate();
		zoombox.deactivate();
		$("#ctrl_zbox_ctrl").removeClass("enable");
    }
});
$(document).on("click", "#ctrl_zbox_ctrl", function () {
	if ($(this).hasClass("enable")) {
        $(this).removeClass("enable");
        zoombox.deactivate();
    }
    else {
        $(this).addClass("enable");
        zoombox.activate();
		info.deactivate();
		$("#ctrl_info_ctrl").removeClass("enable");
    }
});

$(document).on("click", "#ctrl_info_capa_ctrl", function () {
    $.get("layers_info/" + $("li.expanded select[layer]").val().toLowerCase().replace(/ /g, "_") + ".html", function (html) {
        $.fancybox(html);
    });
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
$(document).on("click", "#ctrl_change_viewer2", function () {
    window.location.replace("http://globalclimatemonitor.org/index.html");
});
$(document).on("click", "#ctrl_play", function () {
    $.get("sequence_normals.html", function (html) {
        $.fancybox({
            'content': html, 
            'height' : 700,
			'width' : 1200,
            'autoDimensions':false,
            'autoSize':false
        });
    });
});
$(document).on("click", "#ctrl_survey", function () {
    window.open("https://www.surveymonkey.com/s/X3SV5B9");
});
$(document).on("click", "#news", function () {
    window.open("http://grupo.us.es/climatemonitor/news");
});
$(document).on("click", "#report", function () {
    window.open("http://www.ncdc.noaa.gov/sotc/global");
});
$('#tools h3').click(function (e) {
		e.preventDefault();
		//$(this).parent().find('.content').eq(0).slideToggle();
		if ($(this).hasClass("contracted")) {
			$(this).removeClass("contracted");
		}
		else {
			$(this).addClass("contracted");
		}
		$(this).parent().find('.content').slideToggle("fast");
});
$(document).on("click", "#ctrl_get_kml", function () {
					var capa = indicador.value;
					var vlayer = map.getLayersByName(capa)[0];
					var capa_a = annuals.value;
					var vlayer_a = map.getLayersByName(capa_a)[0];		
					var annualsvis = vlayer_a.getVisibility();
					var capa_n = normals.value;
					var vlayer_n = map.getLayersByName(capa_n)[0];		
					var normalsvis = vlayer_n.getVisibility();					
					var capa_t = v_trends.value;
					var vlayer_t = map.getLayersByName(capa_t)[0];		
					var trendsvis = vlayer_t.getVisibility();	
					
					var vmes_n = mes_n.value;
					var vperiod_n = period_n.value;
					var	vmes = mes.value;
					var vagno = agno.value
					var vagno_a = agno_a.value;
					var vtrend = v_trends.value;
					var ptrend = period_t.value;
					var filter;
					
					if (annualsvis === true) {
						kmllayer = vlayer_a;
					}
					else if (normalsvis === true){
						kmllayer = vlayer_n;
					}
					else if (trendsvis === true) {
						kmllayer = vlayer_t;
					}
					else {
						kmllayer = vlayer;
						filter = "CQL_FILTER=" +"mes = "+ vmes + "AND" + " agno = "+ vagno;
					}
					var params = kmllayer.params;
					layers = params["LAYERS"];
					filter = params["CQL_FILTER"];
					style = params ["STYLES"];
					extent = map.getExtent();
					BBOX = extent.toBBOX();
					var BBOX2 = BBOX.split(",");
					var x1 = BBOX2 [0];
					var x2 = BBOX2 [2];
					var y1 = BBOX2 [1];
					var y2 = BBOX2 [3];
					var x = x2-x1;
					var y = y2-y1;
					z = x/y;
					height = 2048/z;
					height2 = Math.round( height );				


					restoparams = '&format_options=LEGEND:true;SUPEROVERLAY:false;AUTOFIT:true;KMPLACEMARK:false;KMSCORE:0;KMATTR:true;MODE:refresh&STYLES=' + style + '&WIDTH=2048&HEIGHT=' + height2;
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wms?FORMAT=application/vnd.google-earth.kml+xml&REQUEST=GetMap&SRS=epsg:4326&';
					var url = urlroot + 'LAYERS='+ layers + '&CQL_FILTER=' + filter + '&BBOX=' + BBOX + restoparams;
			window.open(url);


});
$(document).on("click", "#ctrl_get_kml_p", function () {
					var layersv = map.getLayersBy("visibility", true);
					var activeLayer = null;
					for (var i=0, len=layersv.length; i<len;i++) {
					   if (layersv[i].isBaseLayer === false) {
						   activeLayer = layersv[i];
					   }
					};					
					var params = activeLayer.params;
					var layers = params["LAYERS"];
					var filter = params["CQL_FILTER"];
					var longcadena=layers.length;
					var layers2 = layers.substring(0,longcadena - 4);
					var style = layers2 + "_poly";
					var extent = map.getExtent();
					var BBOX = extent.toBBOX();
					var BBOX2 = BBOX.split(",");
					var x1 = BBOX2 [0];
					var x2 = BBOX2 [2];
					var y1 = BBOX2 [1];
					var y2 = BBOX2 [3];
					var x = x2-x1;
					var y = y2-y1;
					var z = x/y;
					var height = 1024/z;
					var height2 = Math.round( height );					

//KML raster
/*
					restoparams = '&format_options=SUPEROVERLAY:false;AUTOFIT:true;KMPLACEMARK:false;KMSCORE:0;KMATTR:true;MODE:refresh&STYLES=' + style + '&WIDTH=1024&HEIGHT=' + height2;
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wms?FORMAT=application/vnd.google-earth.kml+xml&REQUEST=GetMap&SRS=epsg:4326&';
					var url = urlroot + 'LAYERS='+ layers + '&CQL_FILTER=' + filter + '&BBOX=' + BBOX + restoparams;
			window.open(url);
*/
//KML placemark
					restoparams = '&format_options=LEGEND:true;SUPEROVERLAY:false;AUTOFIT:true;KMPLACEMARK:false;KMSCORE:100;KMATTR:true;MODE:refresh&WIDTH=1024&HEIGHT=' + height2;
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wms?FORMAT=application/vnd.google-earth.kml+xml&REQUEST=GetMap&SRS=epsg:4326&STYLES=' + style + '&' ;
					var url = urlroot + 'LAYERS='+ layers2 + '&CQL_FILTER=' + filter + '&BBOX=' + BBOX + restoparams;
			window.open(url);

});
$(document).on("click", "#ctrl_get_gtif", function () {
					var capa = indicador.value;
					var vlayer = map.getLayersByName(capa)[0];
					var capa_a = annuals.value;
					var vlayer_a = map.getLayersByName(capa_a)[0];		
					var annualsvis = vlayer_a.getVisibility();
					var capa_n = normals.value;
					var vlayer_n = map.getLayersByName(capa_n)[0];		
					var normalsvis = vlayer_n.getVisibility();					
					var capa_t = v_trends.value;
					var vlayer_t = map.getLayersByName(capa_t)[0];		
					var trendsvis = vlayer_t.getVisibility();	
					
					var vmes_n = mes_n.value;
					var vperiod_n = period_n.value;
					var	vmes = mes.value;
					var vagno = agno.value
					var vagno_a = agno_a.value;
					var vtrend = v_trends.value;
					var ptrend = period_t.value;
					var filter;
					
					if (annualsvis === true) {
						kmllayer = vlayer_a;
					}
					else if (normalsvis === true){
						kmllayer = vlayer_n;
					}
					else if (trendsvis === true) {
						kmllayer = vlayer_t;
					}
					else {
						kmllayer = vlayer;
						filter = "CQL_FILTER=" +"mes = "+ vmes + "AND" + " agno = "+ vagno;
					}
					var params = kmllayer.params;
					layers = params["LAYERS"];
					filter = params["CQL_FILTER"];
					style = params ["STYLES"];
					extent = map.getExtent();
					BBOX = extent.toBBOX();
					var BBOX2 = BBOX.split(",");
					var x1 = BBOX2 [0];
					var x2 = BBOX2 [2];
					var y1 = BBOX2 [1];
					var y2 = BBOX2 [3];
					if (x1 < -180) {x1 = -180};
					if (x2 > 180) {x2 = 180};
					if (y1 < -90) {y1 = -90};
					if (y2 > 90) {y2 = 90};	
					var BBOX3 =	x1 + "," + y1 + "," + x2 + "," + y2;
					var x = x2-x1;
					var y = y2-y1;
					z = x/y;
					height = 1024/z;
					height2 = Math.round( height );
					restoparams = '&STYLES=' + style + '&WIDTH=1024&HEIGHT=' + height2 + '&format_options=dpi:600';
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wms/?FORMAT=image/geotiff8&REQUEST=GetMap&SRS=epsg:4326&';
					var url = urlroot + 'LAYERS='+ layers + '&CQL_FILTER=' + filter + '&BBOX=' + BBOX3 + restoparams;
			window.open(url);
});
$(document).on("click", "#ctrl_get_jpeg", function () {
					var capa = indicador.value;
					var vlayer = map.getLayersByName(capa)[0];
					var capa_a = annuals.value;
					var vlayer_a = map.getLayersByName(capa_a)[0];		
					var annualsvis = vlayer_a.getVisibility();
					var capa_n = normals.value;
					var vlayer_n = map.getLayersByName(capa_n)[0];		
					var normalsvis = vlayer_n.getVisibility();					
					var capa_t = v_trends.value;
					var vlayer_t = map.getLayersByName(capa_t)[0];		
					var trendsvis = vlayer_t.getVisibility();	
					
					var vmes_n = mes_n.value;
					var vperiod_n = period_n.value;
					var	vmes = mes.value;
					var vagno = agno.value
					var vagno_a = agno_a.value;
					var vtrend = v_trends.value;
					var ptrend = period_t.value;
					var filter;
					
					if (annualsvis === true) {
						kmllayer = vlayer_a;
					}
					else if (normalsvis === true){
						kmllayer = vlayer_n;
					}
					else if (trendsvis === true) {
						kmllayer = vlayer_t;
					}
					else {
						kmllayer = vlayer;
						filter = "CQL_FILTER=" +"mes = "+ vmes + "AND" + " agno = "+ vagno;
					}
					var params = kmllayer.params;
					
					layers = params["LAYERS"];
					filter = params["CQL_FILTER"];
					style = params ["STYLES"];
					extent = map.getExtent();
					BBOX = extent.toBBOX();
					var BBOX2 = BBOX.split(",");
					var x1 = BBOX2 [0];
					var x2 = BBOX2 [2];
					var y1 = BBOX2 [1];
					var y2 = BBOX2 [3];
					if (x1 < -180) {x1 = -180};
					if (x2 > 180) {x2 = 180};
					if (y1 < -90) {y1 = -90};
					if (y2 > 90) {y2 = 90};	
					var BBOX3 =	x1 + "," + y1 + "," + x2 + "," + y2;	
					var x = x2-x1;
					var y = y2-y1;
					z = x/y;
					height = 2048/z;
					height2 = Math.round( height );
					restoparams = '&STYLES=' + style + '&WIDTH=2048&HEIGHT=' + height2 + '&format_options=dpi:150;layout:deco_' + layers;
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wms/?FORMAT=image/jpeg&REQUEST=GetMap&SRS=epsg:4326&';
					var url = urlroot + 'LAYERS='+ layers + '&CQL_FILTER=' + filter + '&BBOX=' + BBOX3 + restoparams;
			window.open(url);
});
$(document).on("click", "#ctrl_get_csv", function () {
					var capa = indicador.value;
					var vlayer = map.getLayersByName(capa)[0];
					var capa_a = annuals.value;
					var vlayer_a = map.getLayersByName(capa_a)[0];		
					var annualsvis = vlayer_a.getVisibility();
					var capa_n = normals.value;
					var vlayer_n = map.getLayersByName(capa_n)[0];		
					var normalsvis = vlayer_n.getVisibility();					
					var capa_t = v_trends.value;
					var vlayer_t = map.getLayersByName(capa_t)[0];		
					var trendsvis = vlayer_t.getVisibility();	
					
					var vmes_n = mes_n.value;
					var vperiod_n = period_n.value;
					var	vmes = mes.value;
					var vagno = agno.value
					var vagno_a = agno_a.value;
					var vtrend = v_trends.value;
					var ptrend = period_t.value;
					var filter;
					
					if (annualsvis === true) {
						kmllayer = vlayer_a;
						filter = "agno="+ vagno;
					}
					else if (normalsvis === true){
						kmllayer = vlayer_n;
						filter = "mes=" + vmes_n + "%20AND%20period=" + vperiod_n + "%20AND%20n_period = 30";
					}
					else if (trendsvis === true) {
						kmllayer = vlayer_t;
						filter = "cod_variable=" + vtrend + "%20AND%20period=" + ptrend;
					}
					else {
						kmllayer = vlayer;
						filter = "mes="+ vmes + "%20AND%20" + "agno="+ vagno;
					}
					var params = kmllayer.params;
					layers = params["LAYERS"];
					style = params ["STYLES"];
					extent = map.getExtent();
					BBOX = extent.toBBOX();
					var BBOX2 = BBOX.split(",");
					var x1 = BBOX2 [0];
					var x2 = BBOX2 [2];
					var y1 = BBOX2 [1];
					var y2 = BBOX2 [3];
					var filter2 = 'BBOX%28geom' + ',' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + '%29AND%28' + filter + '%29';		
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wfs?service=wfs&version=1.0.0&request=GetFeature&typeNames=gcm:';
					var url = urlroot + layers + '&CQL_FILTER=' + filter2 + '&outputFormat=csv';
			window.open(url);
});
$(document).on("click", "#ctrl_get_shp", function () {
					var capa = indicador.value;
					var vlayer = map.getLayersByName(capa)[0];
					var capa_a = annuals.value;
					var vlayer_a = map.getLayersByName(capa_a)[0];		
					var annualsvis = vlayer_a.getVisibility();
					var capa_n = normals.value;
					var vlayer_n = map.getLayersByName(capa_n)[0];		
					var normalsvis = vlayer_n.getVisibility();					
					var capa_t = v_trends.value;
					var vlayer_t = map.getLayersByName(capa_t)[0];		
					var trendsvis = vlayer_t.getVisibility();	
					
					var vmes_n = mes_n.value;
					var vperiod_n = period_n.value;
					var	vmes = mes.value;
					var vagno = agno.value
					var vagno_a = agno_a.value;
					var vtrend = v_trends.value;
					var ptrend = period_t.value;
					var filter;
					
					if (annualsvis === true) {
						kmllayer = vlayer_a;
						filter = "agno="+ vagno;
					}
					else if (normalsvis === true){
						kmllayer = vlayer_n;
						filter = "mes=" + vmes_n + "%20AND%20period=" + vperiod_n + "%20AND%20n_period = 30";
					}
					else if (trendsvis === true) {
						kmllayer = vlayer_t;
						filter = "cod_variable=" + vtrend + "%20AND%20period=" + ptrend;
					}
					else {
						kmllayer = vlayer;
						filter = "mes="+ vmes + "%20AND%20" + "agno="+ vagno;
					}
					var params = kmllayer.params;
					layers = params["LAYERS"];
					style = params ["STYLES"];
					extent = map.getExtent();
					BBOX = extent.toBBOX();
					var BBOX2 = BBOX.split(",");
					var x1 = BBOX2 [0];
					var x2 = BBOX2 [2];
					var y1 = BBOX2 [1];
					var y2 = BBOX2 [3];
					var filter2 = 'BBOX%28geom' + ',' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + '%29AND%28' + filter + '%29';					
					var x = x2-x1;
					var y = y2-y1;
					z = x/y;
					height = 1024/z;
					height2 = Math.round( height );				
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wfs?service=wfs&version=1.0.0&SRS=EPSG:4326&request=GetFeature&typeNames=gcm:';
					var url = urlroot + layers + '&CQL_FILTER=' + filter2 + '&WIDTH=1024&HEIGHT=' + height2 +'&outputFormat=SHAPE-ZIP' + '&format_options=filename:gcm_download.zip';
			window.open(url);
});