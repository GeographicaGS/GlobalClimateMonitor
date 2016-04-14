function drawSerieTemp(container,point){
// Calculamos primero la longitud del array, segun la sere temporal que se pida
// Habra que hacerlo cuando se pueda extraer agno, mes de un select
// En este caso seria algo asi como longitud array anual = ango_fin-agno_inicio +1. Longitud array mensual = (ango_fin-agno_inicio +1) * 12
// Declaramos las variables. tmpArray = new Array(Longitud array mensual), mesArray = new Array(Longitud array mensual)
var serie_t,tmpArray = new Array(1381),mesArray = new Array(1381);
var lonlat = new OpenLayers.LonLat(point.lon,point.lat);//	var lonlat = map.getLonLatFromViewPortPx(e.xy).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
var lonlatD = lonlat.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
var lon = Math.round(lonlat.lon);
var lat = Math.round(lonlat.lat);
// var getTmp = $.getJSON('/geoserver/gcm/wfs?service=wfs&version=1.0.0&SRS=EPSG:900913&request=GetFeature&typeNames=gcm:temp_mensual_espacial&CQL_FILTER=BBOX%28geom,-667674,4492867,-656820,4501581%29&WIDTH=1024&HEIGHT=672&outputFormat=json', function(serie_t) {
	var getTmp = $.getJSON('/geoserver/gcm/wfs?service=wfs&version=1.0.0&SRS=EPSG:900913&request=GetFeature&typeNames=gcm:temp_mensual_espacial&CQL_FILTER=BBOX%28geom,'+point.lon+','+point.lat+','+point.lon+','+point.lat+'%29&WIDTH=1024&HEIGHT=672&outputFormat=json', function(serie_t) {
 
               
				$.each(serie_t.features, function (key, val) {
				  properties = val.properties;
				  agno = properties.agno;
				  mes = properties.mes;
				  temp = properties.temp_mes;
				  ix = ((agno-1901)*12) + (mes-1);
				  if (mes==1){
				  mes_name = 'Jan ' + agno}
				  else if (mes==2){
				  mes_name = 'Feb ' + agno}
				  else if (mes==3){
				  mes_name = 'Mar ' + agno}
				  else if (mes==4){
				  mes_name = 'Apr ' + agno}
				  else if (mes==5){
				  mes_name = 'May ' + agno}
				  else if (mes==6){
				  mes_name = 'Jun ' + agno}
				  else if (mes==7){
				  mes_name = 'Jul ' + agno}
				  else if (mes==8){
				  mes_name = 'Aug ' + agno}
				  else if (mes==9){
				  mes_name = 'Sep ' + agno}
				  else if (mes==10){
				  mes_name = 'Oct ' + agno}
				  else if (mes==11){
				  mes_name = 'Nov ' + agno}
				  else if (mes==12){
				  mes_name = 'Dec ' + agno}
				  tmpArray.splice(ix,1,temp);
				  mesArray.splice(ix,1,mes_name)
				});
	});


$.when(getTmp).done(function() {
	
	chartObjects[$(container).closest('.chart_section').hasClass('first') ? 0:1] = new Highcharts.Chart({
		chart: {
			zoomType: 'xy',
			renderTo: container
		},
		title: {
		    text: 'Monthly Temperature series near ' + lon + ', ' + lat
		},
		// subtitle: {
		//     text: 'Globalclimatemonitor.org'
		// },
		xAxis: {
		    categories: mesArray
		},
		yAxis: {
		    title: {
			text: 'Temperature (\xB0C)'
		    },
		    plotLines: [{
			value: 0,
			width: 1,
			color: '#808080'
		    }]
		},
		tooltip: {
		    valueSuffix: '\xB0C'
		},
		legend: {
		    layout: 'vertical',
		    align: 'left',
		    x: 85,
		    verticalAlign: 'top',
		    y: 65,
		    floating: true,
		    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
		},
		series: [{
		    name: 'Temperature',
			color: '#5A0016',
		    data: tmpArray,
			lineWidth: 1,
			type : 'line',
			id: 'primary'
		}, 
		{
		name: 'Linear Trendline',
		linkedTo: 'primary',
		showInLegend: true,
		enableMouseTracking: false,
		type: 'trendline',
		lineWidth: 1,
		color: '#000000',
		algorithm: 'linear'
        }]
	    });
	})
}