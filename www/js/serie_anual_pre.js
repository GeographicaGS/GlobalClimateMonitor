$(function () {
var serie_t,preArray = new Array(115),agnoArray = new Array(115);
var lonlat = new OpenLayers.LonLat(-667674,4492867);//	var lonlat = map.getLonLatFromViewPortPx(e.xy).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
var lonlatD = lonlat.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
var lon = Math.round(lonlat.lon);
var lat = Math.round(lonlat.lat);
var getTmp = $.getJSON('/geoserver/gcm/wfs?service=wfs&version=1.0.0&SRS=EPSG:900913&request=GetFeature&typeNames=gcm:pre_anual_espacial&CQL_FILTER=BBOX%28geom,-667674,4492867,-656820,4501581%29&WIDTH=1024&HEIGHT=672&outputFormat=json', function(serie_t) {
 
               
				$.each(serie_t.features, function (key, val) {
				  properties = val.properties;
				  agno = properties.agno;
				  pre = properties.pre_anual;
				  ix = (agno-1901);
				  preArray.splice(ix,1,pre);
				  agnoArray.splice(ix,1,agno)
				});
	});


$.when(getTmp).done(function() {
	
	var chart = new Highcharts.Chart({
		chart: {
			zoomType: 'xy',
			renderTo: 'container'
		},
		title: {
		    text: 'Annual rainfall near ' + lon + ', ' + lat
		},
		subtitle: {
		    text: 'Globalclimatemonitor.org'
		},
		xAxis: {
		    categories: agnoArray
		},
		yAxis: {
		    tickInterval: 100,
		    title: {
			text: 'Precipitation (mm.)'
		    },
		    plotLines: [{
			value: 0,
			width: 1,
			color: '#808080'
		    }]
		},
		tooltip: {
		    valueSuffix: 'C'
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
        plotOptions: {
                areaspline: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
        },
		series: [{
		    name: 'Annual precipitation',
		    data: preArray,
			type : 'areaspline',
			showInLegend: false,
			id: 'primary',
			marker : {
                    enabled : false,
                    radius : 1
                }
		}
		]
	  });
	})
})