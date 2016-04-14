function drawSerieAnual(container,point){
var serie_t,tmpArray = new Array(115),agnoArray = new Array(115);
var lonlat = new OpenLayers.LonLat(point.lon,point.lat);//	var lonlat = map.getLonLatFromViewPortPx(e.xy).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
var lonlatD = lonlat.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
var lon = Math.round(lonlat.lon);
var lat = Math.round(lonlat.lat);
// var getTmp = $.getJSON('/geoserver/gcm/wfs?service=wfs&version=1.0.0&SRS=EPSG:900913&request=GetFeature&typeNames=gcm:temp_anual_espacial&CQL_FILTER=BBOX%28geom,-667674,4492867,-656820,4501581%29&WIDTH=1024&HEIGHT=672&outputFormat=json', function(serie_t) {
	var getTmp = $.getJSON('/geoserver/gcm/wfs?service=wfs&version=1.0.0&SRS=EPSG:900913&request=GetFeature&typeNames=gcm:temp_anual_espacial&CQL_FILTER=BBOX%28geom,'+point.lon+','+point.lat+','+point.lon+','+point.lat+'%29&WIDTH=1024&HEIGHT=672&outputFormat=json', function(serie_t) {
 
               
				$.each(serie_t.features, function (key, val) {
				  properties = val.properties;
				  agno = properties.agno;
				  temp = properties.temp_anual;
				  ix = (agno-1901);
				  tmpArray.splice(ix,1,temp);
				  agnoArray.splice(ix,1,agno)
				});
	});


$.when(getTmp).done(function() {
	
	chartObjects[$(container).closest('.chart_section').hasClass('first') ? 0:1] = new Highcharts.Chart({
		chart: {
			zoomType: 'xy',
			renderTo: container
		},
		title: {
		    text: 'Annual mean temperatures near ' + lon + ', ' + lat
		},
		// subtitle: {
		//     text: 'Globalclimatemonitor.org'
		// },
		xAxis: {
		    categories: agnoArray
		},
		yAxis: {
		    tickInterval: 0.5,
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
		series: [{
		    name: 'Annual mean temperature',
			color: '#FF0000',
		    data: tmpArray,
			lineWidth: 1,
			type : 'line',
			showInLegend: false,
			id: 'primary',
			marker : {
                    enabled : false,
                    radius : 1
                }
		},
		{
		name: 'Linear trend',
		linkedTo: 'primary',
		showInLegend: true,
		type: 'trendline',
		lineWidth: 2,
		dashStyle: 'dot',
		color: '#000000',
		algorithm: 'linear',
		marker : {
                    enabled : false,
                    radius : 2
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
}