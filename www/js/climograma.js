$(function () {
var lonlat = new OpenLayers.LonLat(-667674,4492867);//	var lonlat = map.getLonLatFromViewPortPx(e.xy).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
var lonlatD = lonlat.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
var lon = Math.round(lonlat.lon);
var lat = Math.round(lonlat.lat);
var datos_p_norm,datos_t_norm,preArray = [],tmpArray = [];

var getPre = $.getJSON('/geoserver/gcm/wfs?service=wfs&version=1.0.0&SRS=EPSG:900913&request=GetFeature&typeNames=gcm:pre_normales_espacial&CQL_FILTER=BBOX%28geom,-667674,4492867,-656820,4501581%29AND%28period%20=%202000%20AND%20n_period%20=%2030%29&WIDTH=1024&HEIGHT=672&outputFormat=json', function(datos_p_norm) {
                
				$.each(datos_p_norm.features, function (key, val) {
				  properties = val.properties;
				  preArray.push(properties.pre_normal) 
				});
				preArray.splice(12, 4);
		
	});

var getTmp = $.getJSON('/geoserver/gcm/wfs?service=wfs&version=1.0.0&SRS=EPSG:900913&request=GetFeature&typeNames=gcm:temp_normales_espacial&CQL_FILTER=BBOX%28geom,-667674,4492867,-656820,4501581%29AND%28period%20=%202000%20AND%20n_period%20=%2030%29&WIDTH=1024&HEIGHT=672&outputFormat=json', function(datos_t_norm) {
                
				$.each(datos_t_norm.features, function (key, val) {
				  properties = val.properties;
				  tmpArray.push(properties.temp_normal) 
				});
				tmpArray.splice(12, 4);
	});


$.when(getPre, getTmp).done(function() {
	
	var chart = new Highcharts.Chart({
		colors: ["#7cb5ec", "#f23838"],
		chart: {
			zoomType: 'xy',
			renderTo: 'container'
		},
		title: {
		    text: 'Average Monthly Temperature and Rainfall near ' + lon + ', ' + lat,
		},
		subtitle: {
		    text: 'Globalclimatemonitor.org'
		},
		xAxis: [{
		    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
			'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		    crosshair: true
		}],
		yAxis: [{ // Primary yAxis
		    labels: {
			format: '{value} \xB0C',
			style: {
			    color: Highcharts.getOptions().colors[1]
			}
		    },
		    title: {
			text: 'Temperature (\xB0C)',
			style: {
			    color: Highcharts.getOptions().colors[1]
			}
		    }
		}, { // Secondary yAxis
		    title: {
			text: 'Rainfall (mm.)',
			style: {
			    color: Highcharts.getOptions().colors[0]
			}
		    },
		    labels: {
			format: '{value} mm',
			style: {
			    color: Highcharts.getOptions().colors[0]
			}
		    },
		    opposite: true
		}],
		tooltip: {
		    shared: true
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
		    name: 'Rainfall',
		    type: 'column',
		    yAxis: 1,
		    data: preArray,
		    tooltip: {
			valueSuffix: ' mm'
		    }

		}, {
		    name: 'Temperature',
		    type: 'spline',
		    data: tmpArray,
		    tooltip: {
			valueSuffix: ' \xB0C'
		    }
		}]
	    });
	})
})