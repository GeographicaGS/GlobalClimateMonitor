$(function () {
var serie_t,tmpArray = new Array(115),agnoArray = new Array(115);
var lonlat = new OpenLayers.LonLat(-667674,4492867);//	var lonlat = map.getLonLatFromViewPortPx(e.xy).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
var lonlatD = lonlat.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
var lon = Math.round(lonlat.lon);
var lat = Math.round(lonlat.lat);
var getTmp = $.getJSON('/geoserver/gcm/wfs?service=wfs&version=1.0.0&SRS=EPSG:900913&request=GetFeature&typeNames=gcm:anomalias_pre_anual_espacial&CQL_FILTER=BBOX%28geom,-667674,4492867,-656820,4501581%29&WIDTH=1024&HEIGHT=672&outputFormat=json', function(serie_t) {
       
				$.each(serie_t.features, function (key, val) {
				  properties = val.properties;
				  agno = properties.agno;
				  pre = properties.anomalia_pre_anual;
				  ix = (agno-1901);
				  tmpArray.splice(ix,1,pre);
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
		    text: 'Anomalías de precipitación anuales con respecto al periodo 1961-1990 '
		},
		subtitle: {
		    text: 'Coordenada 6ºW, 37ºN'
		},
		xAxis: {
		    categories: agnoArray
		},
		yAxis: {
		    min: -500,
		    max: 500,
		    tickInterval: 50,
		    title: {
			text: 'anomalía (\xB0C)',
		    },
		    plotLines: [{
			value: 0,
			width: 1,
			color: '#808080'
		    }]
		},
		tooltip: {
		    valueSuffix: 'mm.'
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
            negativeColor: 'red',
            color: 'blue',
            type: 'column',
			lineWidth: 1.5,
            data: tmpArray,
			name: 'Anomalía de precipitación anual',
			showInLegend: false,
			id: 'primary',
			marker : {
                    enabled : false,
                    radius : 1
                }
        }]
	    });
	})
})