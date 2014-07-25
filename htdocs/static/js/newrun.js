
var searchtimeout;

var modlist = [];
$('#modlist option').each(function (index,element) {
	modlist.push({
		'id':$(element).val(),
		'mod':$(element).html(),
	});
});

$('#modlist-filter').keyup(function (event) {
	clearTimeout(searchtimeout);
	searchtimeout = setTimeout(filterModlist,500);
});

function filterModlist () {
	var filter = $('#modlist-filter').val();
	$('#modlist').html('');
	var filterRe = new RegExp(filter.replace(' ','.*'),'i');
	for (var i = 0; i < modlist.length; i++) {
		if (filterRe.test(modlist[i].mod)) {
			$('#modlist').append(
				'<option value="'+modlist[i].id+'">'+modlist[i].mod+'</option>'
				);
		}
	};
}
