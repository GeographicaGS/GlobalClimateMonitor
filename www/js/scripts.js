/**
Author: Alberto Asuero - Raúl Yeguas 
Company: Geographica - www.geographica.gs
*/
$('#sidebar nav h2').click(function(e){
	e.preventDefault();
	$('nav ul li.expanded').removeClass('expanded').children('.controls').eq(0).slideUp();
	$(this).parent().addClass('expanded');
});

$('header a').click(function(e){
	e.preventDefault();
	var $resume = $('#sidebar .resume');
	var $selectedLi = $('#sidebar nav li.expanded');
	
	if($selectedLi.length > 0){
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

$('#legend h3').click(function(e){
	e.preventDefault();
	//$(this).parent().find('.content').eq(0).slideToggle();
	if ($(this).hasClass("contracted")){
		$(this).removeClass("contracted");
	}
	else{
		$(this).addClass("contracted");	
	}
	$(this).parent().find('.content,.slider').slideToggle();
});

function expandSidebar(e){
	e.preventDefault();
	$sidebar = $('#sidebar');
	if($sidebar.hasClass('contracted')){
		$sidebar.removeClass('contracted');
	}

	resizeMe();
}


function resizeMe(){
	var w = $(window).width()- $("#sidebar").width() - 2;
	$("#map").width(w);
	$("#map").height($(window).height()).css("left",$("#sidebar").width() + "px");
	if (map){
		map.updateSize();
	}
}

$(window).resize(resizeMe);

$(document).on( "click", ".close_fancy",function(){
	$.fancybox.close();
});

$(document).on("change", "#layer_switcher",function(){
	var sel = $(this).val();

	osm.setVisibility(false);
	gmap.setVisibility(false);
	gsat.setVisibility(false);
	ghyb.setVisibility(false);
	gter.setVisibility(false);

	switch (sel)
	{
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

$(document).on("click","#ctrl_info_ctrl",function(){
	if ($(this).hasClass("enable")){
		$(this).removeClass("enable");
		info.deactivate();
	}
	else{
		$(this).addClass("enable");
		info.activate();
	}
});

