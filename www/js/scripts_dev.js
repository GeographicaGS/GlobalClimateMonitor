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
$(document).ready(function(){
    $("#survey_message").fancybox({
  'content': "Please, take 1 minute to complete our survey once you have finnished. You can do it by clicking on the icon button in the top left corner of the map.",
  'height' : 115,
  'width' : 240,
  'autoDimensions': false,
  'autoSize': false,
  'overlayShow': false
    });
    // One second delay
    setTimeout(function(){
        $("#survey_message").click();
    }, 500);
});
//Fin Survey

//Fin help
$(document).on("change", "#layer_switcher", function () {
    var sel = $(this).val();

    world_limits.setVisibility(false);
    osm.setVisibility(false);
    gmap.setVisibility(false);
    gsat.setVisibility(false);
    ghyb.setVisibility(false);
    gter.setVisibility(false);
	sta_t.setVisibility(false);
	sta_w.setVisibility(false);

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
        case "sta_t":
            sta_t.setVisibility(true);
            break;
		case "sta_w":
            sta_w.setVisibility(true);
            break;
    }

});

$(document).on("click", "#ctrl_sym", function () {

	var layers = map.getLayersBy("visibility", true);
	var activeLayer = null;
	for (var i=0, len=layers.length; i<len;i++) {
	   if (layers[i].isBaseLayer === false) {
		   activeLayer = layers[i];
	   }
	};
	var o_style= activeLayer.params ["STYLES"];
	var lname= activeLayer.params ["LAYERS"];

	
	
	if ($(this).hasClass("enable")) {
        $(this).removeClass("enable");
		activeLayer.mergeNewParams({styles : lname});
		activeLayer.redraw();
		var leyenda= "<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer="+lname+"&format=image/png&style="+lname+"&width=12&height=12'/>";
		updateleyenda(leyenda);
	}
	
	else {
		$(this).addClass("enable");
		var polystyle = lname + "_poly";
		activeLayer.mergeNewParams({styles : polystyle });
		var leyenda= "<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer="+lname+"&format=image/png&style="+polystyle+"&width=12&height=12'/>";
		activeLayer.redraw();
		updateleyenda(leyenda);
	}


});

$(document).on("change", "#dialog1, #dialog2, #dialog3, #dialog4", function () {

	var sym= $("#ctrl_sym").hasClass("enable");
	var layers = map.getLayersBy("visibility", true);
	var activeLayer = null;
	for (var i=0, len=layers.length; i<len;i++) {
	   if (layers[i].isBaseLayer === false) {
		   activeLayer = layers[i];
	   }
	};
	var o_style= activeLayer.params ["STYLES"];
	var lname= activeLayer.params ["LAYERS"];
	var longcadena=o_style.length;
	var last5= o_style.substring(longcadena, longcadena - 5);
	
	if (sym=== true && last5 =="_poly") {
		activeLayer.mergeNewParams({styles : o_style});
		activeLayer.redraw();
		var leyenda= "<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer="+lname+"&format=image/png&style="+o_style+"&width=12&height=12'/>";
		updateleyenda(leyenda);
	}
	
	else if (sym=== true && last5 !=="_poly") {
		var o_style = lname + "_poly";
		activeLayer.mergeNewParams({styles : o_style });
		var leyenda= "<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer="+lname+"&format=image/png&style="+o_style+"&width=12&height=12'/>";
		activeLayer.redraw();
		updateleyenda(leyenda);
	}
	else {
		var o_style = lname;
		activeLayer.mergeNewParams({styles : o_style });
		var leyenda= "<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer="+lname+"&format=image/png&style="+o_style+"&width=12&height=12'/>";
		activeLayer.redraw();
		updateleyenda(leyenda);
	}

});
;
function updateleyenda(leyenda) {
			var vmes = mes.value;
			var vagno = agno.value;
			var capa = indicador.value;
			var vagno2 = agno_a.value;
			var capa2 = annuals.value;
			var actdate = new Date();
			var actmonth = actdate.getMonth();
			var actyear = actdate.getFullYear();
if (Number(vagno) >= actyear && Number(vmes) > actmonth)  {
			leyenda0= "No layer";
			document.getElementById("leyendacapa").innerHTML=leyenda0;
}
else if (Number(vagno) >= 2013 && capa !== "Monthly precipitation" && capa !== "Monthly precipitation anomalies" && capa !== "Monthly precipitation anomalies p" && capa !== "Monthly temperature" && capa !== "Monthly temperature anomalies") {
			leyenda0= "No layer";
			document.getElementById("leyendacapa").innerHTML=leyenda0;
}

else if (Number(vagno2) >= 2013 && capa2 !== "Seasonality Index" && capa2 !== "Annual precipitation" && capa2 !== "Annual precipitation anomalies" && capa2 !== "Annual precipitation anomalies p" && capa2 !== "Annual mean temperature" && capa2 !== "Annual mean temperature anomalies") {
			leyenda0= "No layer";
			document.getElementById("leyendacapa").innerHTML=leyenda0;
}
else {
document.getElementById("leyendacapa").innerHTML=leyenda;
}
}

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
$(document).on("click", "#ctrl_change_viewer", function () {
    window.location.replace("http://globalclimatemonitor.org/index_wgs84.html");
});
/*$(document).on("click", "#ctrl_play", function () {
    window.open("http://globalclimatemonitor.org/sequence_normals.html");
});*/
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
					var style = params ["STYLES"];
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
					height = 2048/z;
					height2 = Math.round( height );				

					restoparams = '&format_options=leyendaEND:true;SUPEROVERLAY:false;AUTOFIT:true;KMPLACEMARK:false;KMSCORE:0;KMATTR:true;MODE:refresh&WIDTH=2048&HEIGHT=' + height2;
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wms?FORMAT=application/vnd.google-earth.kml+xml&REQUEST=GetMap&SRS=epsg:900913&STYLES=' + style;
					var url = urlroot + '&LAYERS='+ layers + '&CQL_FILTER=' + filter + '&BBOX=' + BBOX + restoparams;
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
					var style = params ["STYLES"];
					var longcadena=style.length;
					var last5= style.substring(longcadena, longcadena - 5);
					if (last5=="_poly") {
						var style2 = style;
					}
					else {
						var style2 = style + "_kml";
					};
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
					restoparams = '&format_options=SUPEROVERLAY:false;AUTOFIT:true;KMPLACEMARK:false;KMSCORE:0;KMATTR:true;MODE:refresh&WIDTH=1024&HEIGHT=' + height2;
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wms?FORMAT=application/vnd.google-earth.kml+xml&REQUEST=GetMap&SRS=epsg:900913&STYLES=&';
					var url = urlroot + 'LAYERS='+ layers + '&CQL_FILTER=' + filter + '&BBOX=' + BBOX + restoparams;
			window.open(url);
*/
//KML placemark

					restoparams = '&format_options=leyendaEND:true;SUPEROVERLAY:false;AUTOFIT:true;KMPLACEMARK:false;KMSCORE:100;KMATTR:true;MODE:refresh&WIDTH=1024&HEIGHT=' + height2;
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wms?FORMAT=application/vnd.google-earth.kml+xml&REQUEST=GetMap&SRS=epsg:900913&STYLES=' + style2;
					var url = urlroot + '&LAYERS='+ layers + '&CQL_FILTER=' + filter + '&BBOX=' + BBOX + restoparams;
			window.open(url);

});
$(document).on("click", "#ctrl_get_gtif", function () {
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
					var style = params ["STYLES"];
					var extent = map.getExtent();
					var BBOX = extent.toBBOX();
					var BBOX2 = BBOX.split(",");
					var x1 = BBOX2 [0];
					var x2 = BBOX2 [2];
					var y1 = BBOX2 [1];
					var y2 = BBOX2 [3];
					if (x1 < -20037508.34) {x1 = -20037508.34};
					if (x2 > 20037508.34) {x2 = 20037508.34};
					if (y1 < -15538711.1) {y1 = -15538711.1};
					if (y2 > 15538711.1) {y2 = 15538711.1};	
					var BBOX3 =	x1 + "," + y1 + "," + x2 + "," + y2;
					var x = x2-x1;
					var y = y2-y1;
					z = x/y;
					height = 2048/z;
					height2 = Math.round( height );
					restoparams = '&STYLES=' + style + '&WIDTH=2048&HEIGHT=' + height2 + '&format_options=dpi:600';
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wms/?FORMAT=image/geotiff8&REQUEST=GetMap&SRS=epsg:900913&';
					var url = urlroot + 'LAYERS='+ layers + '&CQL_FILTER=' + filter + '&BBOX=' + BBOX3 + restoparams;
			window.open(url);
});
$(document).on("click", "#ctrl_get_jpeg", function () {
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
					var style = params ["STYLES"];
					var extent = map.getExtent();
					var BBOX = extent.toBBOX();
					var BBOX2 = BBOX.split(",");
					var x1 = BBOX2 [0];
					var x2 = BBOX2 [2];
					var y1 = BBOX2 [1];
					var y2 = BBOX2 [3];
					if (x1 < -20037508.34) {x1 = -20037508.34};
					if (x2 > 20037508.34) {x2 = 20037508.34};
					if (y1 < -15538711.1) {y1 = -15538711.1};
					if (y2 > 15538711.1) {y2 = 15538711.1};	
					var BBOX3 =	x1 + "," + y1 + "," + x2 + "," + y2;	
					var x = x2-x1;
					var y = y2-y1;
					z = x/y;
					height = 2048/z;
					height2 = Math.round( height );
					restoparams = '&STYLES=' + style + '&WIDTH=2048&HEIGHT=' + height2 + '&format_options=dpi:150;layout:deco_' + layers;
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wms/?FORMAT=image/jpeg&REQUEST=GetMap&SRS=epsg:900913&';
					var url = urlroot + '&LAYERS='+ layers + '&CQL_FILTER=' + filter + '&BBOX=' + BBOX3 + restoparams;
			window.open(url);
});

$(document).on("click", "#ctrl_get_csv", function () {
					var layersv = map.getLayersBy("visibility", true);
					var activeLayer = null;
					for (var i=0, len=layersv.length; i<len;i++) {
					   if (layersv[i].isBaseLayer === false) {
						   activeLayer = layersv[i];
					   }
					};					
					var params = activeLayer.params;
					var layers = params["LAYERS"] + "_old";
					var filter = params["CQL_FILTER"];
					var extent = map.getExtent();
					var extent2 = extent.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
					var BBOX = extent2.toBBOX();
					var BBOX2 = BBOX.split(",");
					var x1 = BBOX2 [0];
					var x2 = BBOX2 [2];
					var y1 = BBOX2 [1];
					var y2 = BBOX2 [3];
					var filter2 = 'BBOX%28geom' + ',' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + '%29AND%28' + filter + '%29';			
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wfs?service=wfs&version=1.0.0&request=GetFeature&typeNames=gcm:';
					var url = urlroot + layers + '&CQL_FILTER=' + filter2 +'&outputFormat=csv';
			window.open(url);
});

//Prueba excel
$(document).on("click", "#ctrl_get_xls", function () {
					var layersv = map.getLayersBy("visibility", true);
					var activeLayer = null;
					for (var i=0, len=layersv.length; i<len;i++) {
					   if (layersv[i].isBaseLayer === false) {
						   activeLayer = layersv[i];
					   }
					};					
					var params = activeLayer.params;
					var layers = params["LAYERS"] + "_old";
					var filter = params["CQL_FILTER"];
					var extent = map.getExtent();
					var extent2 = extent.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
					var BBOX = extent2.toBBOX();
					var BBOX2 = BBOX.split(",");
					var x1 = BBOX2 [0];
					var x2 = BBOX2 [2];
					var y1 = BBOX2 [1];
					var y2 = BBOX2 [3];
					var filter2 = 'BBOX%28geom' + ',' + x1 + ',' + y1 + ',' + x2 + ',' + y2 + '%29AND%28' + filter + '%29';			
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wfs?service=wfs&version=1.0.0&SRS=EPSG:4326&request=GetFeature&typeName=gcm:';
					var url = urlroot + layers + '&CQL_FILTER=' + filter2 +'&outputFormat=excel2007';
			window.open(url);
});
$(document).on("click", "#ctrl_get_shp", function () {
					var layersv = map.getLayersBy("visibility", true);
					var activeLayer = null;
					for (var i=0, len=layersv.length; i<len;i++) {
					   if (layersv[i].isBaseLayer === false) {
						   activeLayer = layersv[i];
					   }
					};
					var params = activeLayer.params;
					var layers;
					var BBOX;
					var extent = map.getExtent();
					var o_style= activeLayer.params ["STYLES"];
					var longcadena=o_style.length;
					var last5= o_style.substring(longcadena, longcadena - 5);					
					if (last5 =="_poly") {
						layers = params["LAYERS"];
						BBOX = extent.toBBOX();						
					}
					else {
						layers = params["LAYERS"] + "_old";
						var extent2 = extent.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
						BBOX = extent2.toBBOX();
					}					
					var filter = params["CQL_FILTER"];				
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
					var urlroot = 'http://www.globalclimatemonitor.org/geoserver/gcm/wfs?service=wfs&version=1.0.0&SRS=EPSG:900913&request=GetFeature&typeNames=gcm:';
					var url = urlroot + layers + '&CQL_FILTER=' + filter2 + '&WIDTH=1024&HEIGHT=' + height2 +'&outputFormat=SHAPE-ZIP' + '&format_options=filename:gcm_download.zip';
			window.open(url);
});