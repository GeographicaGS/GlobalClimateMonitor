function desactivateAllTools(){
	if($("#ctrl_info_ctrl").hasClass('enable')){
		$("#ctrl_info_ctrl").trigger('click');
	}
	if($("#ctrl_zbox_ctrl").hasClass('enable')){
		$("#ctrl_zbox_ctrl").trigger('click');
	}
	if($("#ctrl_download").hasClass('active')){
		$("#ctrl_download").trigger('click');
	}
	if($("#ctrl_chart").hasClass('enable')){
		$("#ctrl_chart").trigger('click');
	}
}

var chartObjects = [];
// var current_chart_index = 0;

$(document).ready(function() {

	$('#ctrl_chart').click(function(event) {
		$('#ctrl_chart_options').toggleClass('enable');
		if($(this).hasClass('enable')){
			$(this).removeClass('enable');
		}else{
			desactivateAllTools();
			$(this).addClass('enable');
		}
	});

	$('#ctrl_chart_options .close').click(function(event) {
		$('#ctrl_chart').trigger('click');
	});

	$('#ctrl_chart_options .box').click(function(event) {
		// $('#ctrl_play').hide();
		// $('#ctrl_download').hide();
		// $('#ctrl_chart').hide();
		$('#close_chart_view').addClass('enable');
		$('#ctrl_chart').trigger('click');
		$('#chart_view').addClass('enable');
		$('#map').addClass('top');
		map.updateSize();
		map.events.register("click", map,clickToDrawChart);
	});

	$('#close_chart_view').click(function(event) {
		$('#close_chart_view').removeClass('enable');
		
		$('#chart_view .chart_view').children().remove();
		chartObjects = [];
		$('#chart_view .title').show();
		$('#chart_view .title').removeClass('compare');
		$('#chart_view .chart_section').removeClass('compare');
		$('#chart_view .chart_section.second').removeClass('enable');
		$('#chart_view .chartbuttons').removeClass('enable');
		$('#chart_view .compare_chart').removeClass('enable');

		$('#chart_view').removeClass('enable');
		$('#map').removeClass('top');
		map.updateSize();
		map.events.unregister("click", map,clickToDrawChart);
	});

	$('#chart_view .compare_chart').click(function(event) {
		$(this).removeClass('enable');
		$('.chart_section').addClass('compare');
		
		$.each(chartObjects, function(i, chartObject) {
		  chartObject.reflow();
		});
		
		$('.chart_section.second').addClass('enable');
		$('#chart_view .title').show();
		$('#chart_view .title').addClass('compare');
		// current_chart_index = 1;
	});


	$('#chart_view .chartbuttons button.close').click(function(event) {

		if($('#chart_view .chart_section.enable').length == 1){
			$('#close_chart_view').trigger('click');
			return null;
		}

		var chart_section = $(this).closest('.chart_section');
		$(this).closest('.chartbuttons').removeClass('enable');
		chart_section.removeClass('enable');
		$('.chart_section').removeClass('compare');

		var chart_section = $(this).closest('.chart_section');
		chart_section.find('.chart_view').children().remove();
		
		if(chart_section.hasClass('first')){
			chartObjects.splice(0, 1);
			$('#chart_view .chart_section.second').removeClass('second').addClass('first');
			chart_section.removeClass('first').addClass('second');

		}else{
			chartObjects.splice(1, 1);
		}

		$('#chart_view .compare_chart').addClass('enable');

		$.each(chartObjects, function(i, chartObject) {
		  chartObject.reflow();
		});
	});

	$('#chart_view .chartbuttons button.expand').click(function(){
		$('#overlay_chart').addClass('enable');
		drawClimograph($('.overlay_chart')[0],null,null)
	});

	$('#overlay_chart').click(function(event) {
		$(this).removeClass('enable');
		$('.overlay_chart').children().remove();
	});

});

function clickToDrawChart(e){
	var lonlat = map.getLonLatFromViewPortPx(e.xy).transform(
	   new OpenLayers.Projection("EPSG:900913"),
	   new OpenLayers.Projection("EPSG:4326")
 	);
 	var row = Math.floor(lonlat.lon / 0.5);
	var column = Math.floor(lonlat.lat / 0.5);
	row = row * 0.5;
	column = column * 0.5;

	lonlatTo = new OpenLayers.LonLat(row,column).transform(
       new OpenLayers.Projection("EPSG:4326"),
       new OpenLayers.Projection("EPSG:900913")
    );
    lonlatFrom = new OpenLayers.LonLat(row + 0.5, column + 0.5).transform(
       new OpenLayers.Projection("EPSG:4326"),
       new OpenLayers.Projection("EPSG:900913")
    );

    $('#chart_view .title').hide();

    var view;
    if($('.chart_section.second').hasClass('enable')){
    	view = $('.chart_section.second .chart_view')[0];
    	$('.chart_section.second .chartbuttons').addClass('enable');
    }else{
    	view = $('.chart_section.first .chart_view')[0];
    	$('#chart_view .compare_chart').addClass('enable')
    	$('.chart_section.first .chartbuttons').addClass('enable');
    }
    
    // !$('.chart_section.second').hasClass('enable') ? $('#chart_view .compare_chart').addClass('enable'):null;
	
	// $('#chart_view .chartbuttons[index="' + current_chart_index + '"]').addClass('enable');

    // var view = current_chart_index == 0 ? 'chart_view_1':'chart_view_2'
    
    drawClimograph(view,lonlatTo,lonlatFrom)
}
