var map, gmap, gsat, ghyb, gter, osm, prem, anomp, anompp, pren, tempm, anomt, tempn, tempmin, anomtmin, tempminn, tempmax, anomtmax, tempmaxn, etp, anometp, anometpp, etpn, seai, prea, tempa, etpa, etpaa, preaa, tempaa, tempmina, tempmaxa, tempminaa, tempmaxaa, world_limits, trends, info, zoombox, vmes, vagno, vmes_n, filter, filter_n, filter_t, filter_a, filterParams, svalue, pureCoverage, control, trans, vlayer, popups = {}, ley_trends1, ley_trends2;
function init() {
	resizeMe();
    OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
	//set up projections
	// World Geodetic System 1984 projection
	var WGS84 = new OpenLayers.Projection("EPSG:4326");   
	// WGS84 Google Mercator projection
	var WGS84_google_mercator = new OpenLayers.Projection("EPSG:900913");
	var extent = new OpenLayers.Bounds(-180,-90,180,90).transform(WGS84, WGS84_google_mercator);
	map = new OpenLayers.Map({
        div: "map",
		restrictedExtent: extent,
		resolutions: [39135.7584765625, 19567.87923828125, 9783.939619140625,4891.9698095703125,2445.9849047851562,1222.9924523925781,611.4962261962891,305.74811309814453],
        projection: "EPSG:900913",
		displayProjection: WGS84,
		units: "m",
		allOverlays: true

    });
	
	var mp= new OpenLayers.Control.MousePosition({
					prefix: '<a target="_blank" ' +
					'href="http://spatialreference.org/ref/epsg/4326/">' +
					'</a> <strong>Coordinates</strong> WGS84: ',
					separator: ' | ',
					numDigits: 2,
					emptyString: 'Cursor is not over the map'
					}
				);
	var nav=new OpenLayers.Control.Navigation({dragPanOptions: {enableKinetic: true}});
	var zoomio = new OpenLayers.Control.Zoom({title:"Change zoom level"});
	map.addControl(zoomio);

	map.addControl(mp);
	map.addControl(nav);
	map.addControl(new OpenLayers.Control.Attribution());
    //var switcherControl = new OpenLayers.Control.LayerSwitcher();
	//map.addControl(switcherControl);
	var scale = new OpenLayers.Control.Scale();
	map.addControl(scale);
	// Cogemos una referencia al ‘div’ del panel
	var divInfo = OpenLayers.Util.getElement('divinfo');

	// DEPRECATED
	// Creamos el panel de botones pasandole la referencia del ‘div’
	//var panel = new OpenLayers.Control.Panel({ 'div' : divInfo });	
	// var botonInfo = new OpenLayers.Control.Button({
	// 				displayClass: 'binfo', 
	// 				type: OpenLayers.Control.TYPE_TOGGLE,
	// 				title: 'Click over a point to get info',
	// 				eventListeners: {
	// 					'activate': function(){info.activate()}, 
	// 					'deactivate': function(){info.deactivate()}}
	// 				});
	// var botonInfo2 = new OpenLayers.Control.Button({
	// 				displayClass: 'binfo2', 
	// 				type: OpenLayers.Control.TYPE_BUTTON,
	// 				title: 'Click to get layer data info',
	// 				trigger: function() {
	// 					var urlst= 'http://www.globalclimatemonitor.org/ind.html'
	// 					window.open(urlst);
	// 				}
	// });
	// Añadimos los botones al panel
	//panel.addControls([botonInfo]);
// Añadimos el panel al mapa
	//map.addControl(panel);
    // If tile matrix identifiers differ from zoom levels (0, 1, 2, ...)
    // then they must be explicitly provided.
    var matrixIds = new Array(10);
    for (var i=0; i<10; ++i) {
        matrixIds[i] = "EPSG:900913:" + i;
    };
    // Create Google Mercator layers
    gmap = new OpenLayers.Layer.Google("Google Streets",
                  {
                      type: google.maps.MapTypeId.ROADMAP,
                      sphericalMercator: true,
					  numZoomLevels: 10,
					  visibility: false,
                  });
    gsat = new OpenLayers.Layer.Google("Google Satellite",
                  {
                      type: google.maps.MapTypeId.SATELLITE,
                      sphericalMercator: true,
					  numZoomLevels: 10,
					  visibility: false,
					
                  });
    ghyb = new OpenLayers.Layer.Google("Google Hybrid",
                  {
                      type: google.maps.MapTypeId.HYBRID,
                      sphericalMercator: true,
					  numZoomLevels: 10,
					  visibility: false,
                  });
    gter = new OpenLayers.Layer.Google("Google Terrain",
                  {
                      type: google.maps.MapTypeId.TERRAIN,
                      sphericalMercator: true,
					  numZoomLevels: 10,
					  visibility: false,
                  });
    osm = new OpenLayers.Layer.OSM("Mapnik", "",
				  {
					  isBaseLayer: false, 
					  sphericalMercator: true, 
					  zoomOffset: 2,
					  visibility: false
				  });
    sta_t = new OpenLayers.Layer.Stamen("toner-lite",
                  {
					  isBaseLayer: false, 
					  sphericalMercator: true,
					  numZoomLevels: 10,
					  zoomOffset: 2,
					  visibility: false,
					  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
                  });	
    sta_w = new OpenLayers.Layer.Stamen("watercolor",
                  {
					  isBaseLayer: false, 
					  sphericalMercator: true,
					  numZoomLevels: 10,
					  zoomOffset: 2,
					  visibility: false,
					  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
                  });
    world_limits = new OpenLayers.Layer.WMS("White background with limits", "http://zidane.fgh.us.es:8080/geoserver/world/wms?", 
				  
				  {
					  layers: 'WB', 
					  transparent: true, 
					  format: "image/png"
				  }, 
				  {
					  isBaseLayer: true, 
					  displayInLayerSwitcher: false, 
					  visibility: true, 
					  singleTile: false,
					  attribution:"http://www.mappinghacks.com"
				  });
	
/*	world_limits = new OpenLayers.Layer.WMTS(
				{ 	  
					name: "White background with limits",
					url: "http://zidane.fgh.us.es:8080/geoserver/gwc/service/wmts",
					layer: "world:WB",
					matrixSet: "EPSG:900913",
					matrixIds: matrixIds,
					style: "default",	
					format: "image/png",
					opacity: 1,
					isBaseLayer: true,
					visibility: false,
					attribution:"http://www.mappinghacks.com/"
				});
*/
	prem = new OpenLayers.Layer.WMS("Monthly precipitation", "/geoserver/gcm/wms?", {layers: 'pre_mensual_espacial', transparent: true, format: "image/png", styles: "pre_mensual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	anomp = new OpenLayers.Layer.WMS("Monthly precipitation anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_pre_espacial', transparent: true, format: "image/png", styles: "anomalias_pre_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	anompp = new OpenLayers.Layer.WMS("Monthly precipitation anomalies p", "/geoserver/gcm/wms?", {layers: 'anomalias_pre_porcentaje_espacial', transparent: true, format: "image/png", styles: "anomalias_pre_porcentaje_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	pren = new OpenLayers.Layer.WMS("Monthly precipitation normals", "/geoserver/gcm/wms?", {layers: 'pre_normales_espacial', transparent: true, format: "image/png", styles: "pre_normales_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	tempm = new OpenLayers.Layer.WMS("Monthly temperature", "/geoserver/gcm/wms?", {layers: 'temp_mensual_espacial', transparent: true, format: "image/png", styles: "temp_mensual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	anomt = new OpenLayers.Layer.WMS("Monthly temperature anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_temp_espacial', transparent: true, format: "image/png", styles: "anomalias_temp_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	tempn = new OpenLayers.Layer.WMS("Monthly temperature normals", "/geoserver/gcm/wms?", {layers: 'temp_normales_espacial', transparent: true, format: "image/png", styles: "temp_normales_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	seai = new OpenLayers.Layer.WMS("Seasonality Index", "/geoserver/gcm/wms?", {layers: 'seasonality_index_espacial', transparent: true, format: "image/png", styles: "seasonality_index_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	tempmin = new OpenLayers.Layer.WMS("Monthly minimum temperature", "/geoserver/gcm/wms?", {layers: 'temp_min_mensual_espacial', transparent: true, format: "image/png", styles: "temp_min_mensual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	anomtmin = new OpenLayers.Layer.WMS("Monthly minimum temperature anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_temp_min_espacial', transparent: true, format: "image/png", styles: "anomalias_temp_min_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	tempminn = new OpenLayers.Layer.WMS("Monthly minimum temperature normals", "/geoserver/gcm/wms?", {layers: 'temp_min_normales_espacial', transparent: true, format: "image/png", styles: "temp_min_normales_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	tempmax = new OpenLayers.Layer.WMS("Monthly maximum temperature", "/geoserver/gcm/wms?", {layers: 'temp_max_mensual_espacial', transparent: true, format: "image/png", styles: "temp_max_mensual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	anomtmax = new OpenLayers.Layer.WMS("Monthly maximum temperature anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_temp_max_espacial', transparent: true, format: "image/png", styles: "anomalias_temp_max_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	tempmaxn = new OpenLayers.Layer.WMS("Monthly maximum temperature normals", "/geoserver/gcm/wms?", {layers: 'temp_max_normales_espacial', transparent: true, format: "image/png", styles: "temp_max_normales_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	etp = new OpenLayers.Layer.WMS("Monthly etp", "/geoserver/gcm/wms?", {layers: 'etp_mensual_espacial', transparent: true, format: "image/png", styles: "etp_mensual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	anometp = new OpenLayers.Layer.WMS("Monthly etp anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_etp_espacial', transparent: true, format: "image/png", styles: "anomalias_etp_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	anometpp = new OpenLayers.Layer.WMS("Monthly etp anomalies p", "/geoserver/gcm/wms?", {layers: 'anomalias_etp_porcentaje_espacial', transparent: true, format: "image/png", styles: "anomalias_etp_porcentaje_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	etpn = new OpenLayers.Layer.WMS("Monthly etp normals", "/geoserver/gcm/wms?", {layers: 'etp_normales_espacial', transparent: true, format: "image/png", styles: "etp_normales_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	prea = new OpenLayers.Layer.WMS("Annual precipitation", "/geoserver/gcm/wms?", {layers: 'pre_anual_espacial', transparent: true, format: "image/png", styles: "pre_anual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	tempa = new OpenLayers.Layer.WMS("Annual mean temperature", "/geoserver/gcm/wms?", {layers: 'temp_anual_espacial', transparent: true, format: "image/png", styles: "temp_anual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	tempmina = new OpenLayers.Layer.WMS("Annual minimum temperature", "/geoserver/gcm/wms?", {layers: 'temp_min_anual_espacial', transparent: true, format: "image/png", styles: "temp_min_anual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	tempmaxa = new OpenLayers.Layer.WMS("Annual maximum temperature", "/geoserver/gcm/wms?", {layers: 'temp_max_anual_espacial', transparent: true, format: "image/png", styles: "temp_max_anual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	etpa = new OpenLayers.Layer.WMS("Annual etp", "/geoserver/gcm/wms?", {layers: 'etp_anual_espacial', transparent: true, format: "image/png", styles: "etp_anual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	preaa = new OpenLayers.Layer.WMS("Annual precipitation anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_pre_anual_espacial', transparent: true, format: "image/png", styles: "anomalias_pre_anual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	tempaa = new OpenLayers.Layer.WMS("Annual mean temperature anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_temp_anual_espacial', transparent: true, format: "image/png", styles: "anomalias_temp_anual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	etpaa = new OpenLayers.Layer.WMS("Annual etp anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_etp_anual_espacial', transparent: true, format: "image/png", styles: "anomalias_etp_anual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	tempminaa = new OpenLayers.Layer.WMS("Annual minimum temperature anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_temp_min_anual_espacial', transparent: true, format: "image/png", styles: "anomalias_temp_min_anual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	tempmaxaa = new OpenLayers.Layer.WMS("Annual maximum temperature anomalies", "/geoserver/gcm/wms?", {layers: 'anomalias_temp_max_anual_espacial', transparent: true, format: "image/png", styles: "anomalias_temp_max_anual_espacial"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, opacity: 1, singleTile: false, ratio: 1});
	trends1 = new OpenLayers.Layer.WMS("trends_1", "/geoserver/gcm/wms?", {layers: 'trends_anual_espacial_1', transparent: true, format: "image/png", styles: "trends_anual_espacial_1"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1});
	trends2 = new OpenLayers.Layer.WMS("trends_2", "/geoserver/gcm/wms?", {layers: 'trends_anual_espacial_2', transparent: true, format: "image/png", styles: "trends_anual_espacial_2"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1});
	trends3 = new OpenLayers.Layer.WMS("trends_3", "/geoserver/gcm/wms?", {layers: 'trends_anual_espacial_3', transparent: true, format: "image/png", styles: "trends_anual_espacial_3"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1});
	trends4 = new OpenLayers.Layer.WMS("trends_4", "/geoserver/gcm/wms?", {layers: 'trends_anual_espacial_4', transparent: true, format: "image/png", styles: "trends_anual_espacial_4"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1});
	trends5 = new OpenLayers.Layer.WMS("trends_5", "/geoserver/gcm/wms?", {layers: 'trends_anual_espacial_5', transparent: true, format: "image/png", styles: "trends_anual_espacial_5"}, {isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, singleTile: false, ratio: 1});
	
	/*	indst = new OpenLayers.Layer.WMTS({
        name: "Number of stations of influence",
        url: "/geoserver/gwc/service/wmts",
        layer: "litoral:st1901_11",
        matrixSet: "EPSG:900913",
        matrixIds: matrixIds,
        format: "image/png",
        style: "N_stations",
        opacity: 1,
        isBaseLayer: false,
		displayInLayerSwitcher: false,
		visibility: false,
		leg2:"<img src='legends/st1901_11.png'/>"
    });*/



//Filtro cql antes de info

	
	
//info

        info = new OpenLayers.Control.WMSGetFeatureInfo({
            url: '/geoserver/gcm/wms?', 
            title: 'Identify features by clicking',
			//hover: true,
            queryVisible: true,
			maxFeatures: 1,
			layers: [prem,anomp,anompp,pren,tempm,anomt,tempn,tempmin,anomtmin,tempminn,tempmax,anomtmax,tempmaxn,etp,anometp,anometpp,etpn,seai,prea,tempa,etpa,tempmina,tempmaxa,preaa,tempaa,etpaa,tempmaxaa,tempminaa,trends1,trends2,trends3,trends4,trends5],
            eventListeners: {
                beforegetfeatureinfo: function(event) {					
					var capa_a = annuals.value;
					var vlayer_a = map.getLayersByName(capa_a)[0];		
					var annualsvis = vlayer_a.getVisibility();
					var capa_n = normals.value;
					var vlayer_n = map.getLayersByName(capa_n)[0];		
					var normalsvis = vlayer_n.getVisibility();					
					var capa_t = "trends_" + v_trends.value;
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
						filter = " agno = "+ vagno_a;
					}
					else if (normalsvis === true){
						filter = "mes = "+ vmes_n + " AND period = " + vperiod_n + " AND n_period = 30"
					}
					else if (trendsvis === true) {
						filter = " cod_variable = "+ vtrend  + " AND period = " + ptrend;
					}
					else {
						filter = "mes = "+ vmes + " AND" + " agno = "+ vagno;
					}
					this.vendorParams = { cql_filter: filter }; 
                }, 
				getfeatureinfo: function(event) {
					$.fancybox(event.text,{
						"closeBtn" : false,
						/*helpers:  {
							overlay : null
						}*/
					});
					
                    // map.addPopup(new OpenLayers.Popup.FramedCloud(
                    //     "chicken", 
                    //     map.getLonLatFromPixel(event.xy),
                    //     new OpenLayers.Size(400,300), //size
                    //     event.text,//content HTML
                    //     null, //anchor
                    //     true //closeBox
                    // ));
                
				}
            }
        });
        map.addControl(info);
		zoombox = new OpenLayers.Control.ZoomBox();
		map.addControl(zoombox);
		fullex = new OpenLayers.Control.ZoomToMaxExtent({title:"Zoom to full extent"});
		map.addControl(fullex);
		var navHistory = new OpenLayers.Control.NavigationHistory({title:"Navigation history"});
		map.addControl(navHistory);
		var element = document.getElementById("tools1");
		var navHistoryPanel = new OpenLayers.Control.Panel({div: element});
		navHistoryPanel.addControls([navHistory.previous,navHistory.next,fullex]);
		map.addControl(navHistoryPanel);

//fin info

    map.addLayers([world_limits, osm, gsat, gmap, ghyb, gter, sta_t, sta_w, prem, anomp, anompp, pren, tempm, tempmin, anomt, anomtmin, tempn, tempminn, tempmax, anomtmax, tempmaxn, etp, anometp, anometpp, etpn, seai, prea, tempa, tempmina, tempmaxa, etpa, preaa, tempaa, etpaa, tempmaxaa, tempminaa, trends1, trends2, trends3, trends4, trends5]);
	map.setCenter(new OpenLayers.LonLat(10, 40).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject()), 0);
    // create WMTS GetFeatureInfo control
    
}  

			function UpdateFilterfirst() {
                if(pureCoverage)
                  return;
				var capa = indicador.value
				var vlayer = map.getLayersByName(capa)[0];
				var lname= vlayer.params ["LAYERS"];
				var leyenda= "<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer="+lname+"&format=image/png&style="+lname+"&width=12&height=12'/>";
				var vmes = mes.value;
				var vagno = agno.value;
				var filter = "mes = "+ vmes + " AND" + " agno = "+ vagno;
                // by default, reset all filters
                var filterParams = {
                    cql_filter: null,
                };
                if (OpenLayers.String.trim(filter) != "") {
                        filterParams["cql_filter"] = filter;
                };
				
                // merge the new filter definitions			
                vlayer.mergeNewParams(filterParams);
				vlayer.setVisibility(true);
				updateleyenda(leyenda);
				
				
         	}
			function UpdateFilter() {
			browserIsIE = typeof document.documentMode == "number" || new Function("return/*@cc_on!@*/!1")();
			if(browserIsIE === true)
			{	
			window.document.execCommand('Stop');
			}
			else
			{
			window.stop();
			}
                if(pureCoverage)
                  return;
				var oldind;
					if (indicador.oldvalue === undefined) {
					oldind = indicador.value;
					}
					else {
					oldind = indicador.oldvalue;
					}
				var capa_n = normals.value;
				var capa = indicador.value;
				var capa_a = annuals.value;
				var capa_t = "trends_" + v_trends.value;
				var vlayer = map.getLayersByName(capa)[0];
				var lname= vlayer.params ["LAYERS"];
				var leyenda= "<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer="+lname+"&format=image/png&style="+lname+"&width=12&height=12'/>";
				var vlayerold = map.getLayersByName(oldind)[0];
				var vlayer_n = map.getLayersByName(capa_n)[0];
				var vlayer_a = map.getLayersByName(capa_a)[0];
				var vlayer_t = map.getLayersByName(capa_t)[0];					
				var vmes = mes.value;
				var vagno = agno.value;
				var filter = "mes = "+ vmes + " AND" + " agno = "+ vagno;
				
				// by default, reset all filters
                var filterParams = {
                    cql_filter: null,
                };
                if (OpenLayers.String.trim(filter) != "") {
                        filterParams["cql_filter"] = filter;
                };
				// merge the new filter definitions
                vlayer.mergeNewParams(filterParams);
				vlayerold.setVisibility(false);
				vlayer_a.setVisibility(false);
				vlayer_n.setVisibility(false);
				vlayer.setVisibility(true);
				vlayer_t.setVisibility(false);
				updateleyenda(leyenda);
         	}
			function UpdateFilter_a() {
			browserIsIE = typeof document.documentMode == "number" || new Function("return/*@cc_on!@*/!1")();
			if(browserIsIE === true)
			{	
			window.document.execCommand('Stop');
			}
			else
			{
			window.stop();
			}
                if(pureCoverage)
                  return;
				var old_a;
					if (annuals.oldvalue === undefined) {
					old_a = annuals.value;
					}
					else {
					old_a = annuals.oldvalue;
					}
				var capa_n = normals.value;
				var capa = indicador.value;
				var capa_a = annuals.value;
				var capa_t = "trends_" + v_trends.value;
				var vlayer = map.getLayersByName(capa)[0];
				var vlayer_n = map.getLayersByName(capa_n)[0];
				var vlayer_a = map.getLayersByName(capa_a)[0];
				var vlayerold_a = map.getLayersByName(old_a)[0];
				var vlayer_t = map.getLayersByName(capa_t)[0];					
				var vagno = agno_a.value;
				var lname= vlayer_a.params ["LAYERS"];
				var leyenda= "<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer="+lname+"&format=image/png&style="+lname+"&width=12&height=12'/>";
				var filter = "agno = "+ vagno;
				//sin datos

                // by default, reset all filters
                var filterParams = {
                    cql_filter: null,
                };
                if (OpenLayers.String.trim(filter) != "") {
                        filterParams["cql_filter"] = filter;
                };
                // merge the new filter definitions
                vlayer_a.mergeNewParams(filterParams);
				vlayerold_a.setVisibility(false);
				vlayer.setVisibility(false);
				vlayer_n.setVisibility(false);
				vlayer_a.setVisibility(true);
				vlayer_t.setVisibility(false);
				updateleyenda(leyenda);
         	}
			function UpdateFilter_n() {
			browserIsIE = typeof document.documentMode == "number" || new Function("return/*@cc_on!@*/!1")();
			if(browserIsIE === true)
			{	
			window.document.execCommand('Stop');
			}
			else
			{
			window.stop();
			}
                if(pureCoverage)
                  return;
				var old_n;
					if (normals.oldvalue === undefined) {
					old_n = normals.value;
					}
					else {
					old_n = normals.oldvalue;
					}
				var capa_n = normals.value;
				var capa = indicador.value;
				var capa_a = annuals.value;
				var capa_t = "trends_" + v_trends.value;
				var vmes_n = mes_n.value;
				var vperiod_n = period_n.value;
				var vlayer_n = map.getLayersByName(capa_n)[0];
				var vlayerold_n = map.getLayersByName(old_n)[0];
				var vlayer = map.getLayersByName(capa)[0];
				var vlayer_a = map.getLayersByName(capa_a)[0];
				var vlayer_t = map.getLayersByName(capa_t)[0];
				var lname= vlayer_n.params ["LAYERS"];
				var leyenda= "<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer="+lname+"&format=image/png&style="+lname+"&width=12&height=12'/>";
				var filter_n = "mes = " + vmes_n + " AND period = " + vperiod_n + " AND n_period = 30";
                // by default, reset all filters
                var filterParams = {
                    cql_filter: null,
                };
                if (OpenLayers.String.trim(filter_n) != "") {
                        filterParams["cql_filter"] = filter_n;
                }
                // merge the new filter definitions
				vlayer_n.mergeNewParams(filterParams);
				vlayerold_n.setVisibility(false);
				vlayer.setVisibility(false);
				vlayer_a.setVisibility(false);
				vlayer_n.setVisibility(true);
				vlayer_t.setVisibility(false);
				updateleyenda(leyenda);
         	}
			
			function UpdateFilter_t() {
			browserIsIE = typeof document.documentMode == "number" || new Function("return/*@cc_on!@*/!1")();
			if(browserIsIE === true)
			{	
			window.document.execCommand('Stop');
			}
			else
			{
			window.stop();
			}
                if(pureCoverage)
                  return;
				var old_t;
					if (v_trends.oldvalue === undefined) {
					old_t = "trends_" + v_trends.value; 
					}
					else {
					old_t = "trends_" + v_trends.oldvalue;
					}
				var ptrend = period_t.value;
				var vtrend = v_trends.value;
				var capa_n = normals.value;
				var capa_t = "trends_" + v_trends.value;
				var capa = indicador.value;
				var capa_a = annuals.value;
				var vmes_n = mes_n.value;
				var vperiod_n = period_n.value;
				var vlayer_t = map.getLayersByName(capa_t)[0];
				var vlayer_n = map.getLayersByName(capa_n)[0];
				var vlayer = map.getLayersByName(capa)[0];
				var vlayer_a = map.getLayersByName(capa_a)[0];
				var vlayerold_t = map.getLayersByName(old_t)[0];
				var lname= vlayer_t.params ["LAYERS"];
				var leyenda= "<img src='/geoserver/gcm/wms?service=WMS&version=1.3.0&request=getlegendgraphic&layer="+lname+"&format=image/png&style="+lname+"&width=12&height=12'/>";
				var filter_t = "cod_variable = " + vtrend + " AND period = " + ptrend;
                // by default, reset all filters
                var filterParams = {
                    cql_filter: null,
                };
                if (OpenLayers.String.trim(filter_t) != "") {
                        filterParams["cql_filter"] = filter_t;
                };
                // merge the new filter definitions
				vlayer_t.mergeNewParams(filterParams);
				vlayer_t.mergeNewParams({styles : "trends_anual_espacial_" + v_trends.value });
				vlayer.setVisibility(false);
				vlayer_a.setVisibility(false);
				vlayer_n.setVisibility(false);
				vlayerold_t.setVisibility(false);
				vlayer_t.setVisibility(true);
				updateleyenda(leyenda);
         	}			

			function testLayer() {
			var vmes = mes.value;
			var vagno = agno.value;
			var capa = indicador.value;
			var actdate = new Date();
			var actmonth = actdate.getMonth();
			var actyear = actdate.getFullYear();
			if (Number(vagno) >= actyear && Number(vmes) > actmonth) {
				alert ("Please, select a proper year/month.");
			}
			else if (Number(vagno) >= 2013 && capa !== "Monthly precipitation" && capa !== "Monthly precipitation anomalies" && capa !== "Monthly precipitation anomalies p" && capa !== "Monthly temperature" && capa !== "Monthly temperature anomalies") {
			alert ("There is no data for selected layer/month/year.\n------------------------------\nPlease, modify your selection.\n------------------------------\nFrom January 2012, only layers of monthly rainfall,mean temperature and their anomalies are available.");
				};
			}
			
			function testLayer_a() {
			var vmes = mes.value;
			var vagno2 = agno_a.value;
			var capa2 = annuals.value;
			var actdate = new Date();
			var actmonth = actdate.getMonth();
			var actyear = actdate.getFullYear();
			if (Number(vagno2) >= 2013 && capa2 !== "Seasonality Index" && capa2 !== "Annual precipitation" && capa2 !== "Annual precipitation anomalies" && capa2 !== "Annual precipitation anomalies p" && capa2 !== "Annual mean temperature" && capa2 !== "Annual mean temperature anomalies") {
			alert ("There is no data for selected year.\n------------------------------\nPlease, modify your selection.\n------------------------------\nFrom January 2012, only layers of annual rainfall, temperature and their anomalies are available for this year.");
				};
			}
		
		function updateTransparency(value) {
			var tvalue = (1-(value/100))*100;
			var capa_n = normals.value;
			var vlayer_n = map.getLayersByName(capa_n)[0];
			var capa_a = annuals.value;
			var vlayer_a = map.getLayersByName(capa_a)[0];	
			var capa_t = "trends_" + v_trends.value;
			var vlayer_t = map.getLayersByName(capa_t)[0];
			var capa = indicador.value;
			var vlayer = map.getLayersByName(capa)[0];
			vlayer.setOpacity(tvalue / 100);
			vlayer_n.setOpacity(tvalue / 100);
			vlayer_a.setOpacity(tvalue / 100);
			vlayer_t.setOpacity(tvalue / 100);
		}


		




