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
});

$('#sidebar nav .resume').click(expandSidebar);
$('#sidebar header .expand_btn').click(expandSidebar);

$('#legend h3').click(function(e){
	e.preventDefault();
	$(this).parent().find('.content').eq(0).slideToggle();
});

function expandSidebar(e){
	e.preventDefault();
	$sidebar = $('#sidebar');
	if($sidebar.hasClass('contracted')){
		$sidebar.removeClass('contracted');
	}
}