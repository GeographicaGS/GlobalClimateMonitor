$(function () {
var serie_t,tmpArray = new Array(115),agnoArray = new Array(115);
var lonlat = new OpenLayers.LonLat(12133824,12932243);//	var lonlat = map.getLonLatFromViewPortPx(e.xy).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
var lonlatD = lonlat.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
var lon = Math.round(lonlat.lon);
var lat = Math.round(lonlat.lat);
var getTmp = $.getJSON('/geoserver/gcm/wfs?service=wfs&version=1.0.0&SRS=EPSG:900913&request=GetFeature&typeNames=gcm:anomalias_temp_anual_espacial&CQL_FILTER=BBOX%28geom,12133824,12932243,12189484,13150878%29&WIDTH=1024&HEIGHT=672&outputFormat=json', function(serie_t) {
       
				$.each(serie_t.features, function (key, val) {
				  properties = val.properties;
				  agno = properties.agno;
				  temp = properties.anomalia_temp_anual;
				  ix = (agno-1901);
				  tmpArray.splice(ix,1,temp);
				  agnoArray.splice(ix,1,agno)
				});
	});


$.when(getTmp).done(function() {
	
	var chart = new Highcharts.Chart({
		chart: {
			zoomType: 'xy',
			renderTo: 'container',
		},
		title: {
		    text: 'Annual Temperature anomalies near ' + lon + ', ' + lat
		},
		subtitle: {
		    text: 'Globalclimatemonitor.org'
		},
		xAxis: {
		    categories: agnoArray
		},
		yAxis: {
		    tickInterval: 0.5,
		    title: {
			text: 'anomaly (\xB0C)',
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
        plotOptions: {
            series: {
				borderWidth: 0,
                pointPadding: -0.2,
				maxPointWidth: 20
            }
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
            threshold: 0,
            negativeColor: 'blue',
            color: 'red',
            type: 'column',
			lineWidth: 1.5,
            data: tmpArray,
			name: 'Annual mean temperature',
			showInLegend: false,
			id: 'primary',
			marker : {
                    enabled : false,
                    radius : 1
                }
        },
		{
		name: '10-years SMA',
		linkedTo: 'primary',
		showInLegend: true,
		type: 'trendline',
		lineWidth: 2.5,
		color: '#000000',
		algorithm: 'SMA',
		periods: 10,
		marker : {
                    enabled : false,
                    radius : 2
		}
        }]
	    });
	})
})