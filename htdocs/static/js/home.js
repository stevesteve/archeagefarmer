
// VARIABLES

var timers = loadTimers();

var seeds = {};
for (var i = 0; i < context.seeds.length; i++) {
	seeds[context.seeds[i].id] = context.seeds[i];
};

// LISTENERS

$('#seed-filter').keyup(filterSeeds);
$('#add-timer').click(function (event) {
	addTimer($('#select-seed').val(),$('#textarea-notes').val());
});

// CODE
displayTimers();

setInterval(updateTimeLeft,1000);

// FUNCTIONS
function loadTimers () {
	if (localStorage.timers) {
		return JSON.parse(localStorage.timers);
	} else {
		return [];
	}
}

function saveTimers (timers) {
	localStorage.setItem('timers',JSON.stringify(timers));
}

function addTimer (seedId,notes) {
	if (!seedId) {
		return;
	}
	timers.push({
		'seed':seedId,
		'starttime':moment().toString(),
		'endtime':moment().add(seeds[seedId].growth_minutes,'m').toString(),
		'notes':notes?notes:''
	});
	saveTimers(timers);
	displayTimers();
}

function displayTimers () {

	var timer;
	var currentDom;
	var seed;
	var endtime;
	$('#timers').html('');
	for (var i = 0; i < timers.length; i++) {
		timer = timers[i];
		currentDom = $('.timer.template').clone();
		seed = seeds[timers[i].seed];
		endtime = moment(timer.endtime);
		
		currentDom.removeClass('template');
		currentDom.find('.name').html(seed.name);
		currentDom.find('.time-done > .date').html(endtime.format('DD.MM.YY'));
		currentDom.find('.time-done > .time').html(endtime.format('HH:mm'));
		currentDom.find('.notes').html(timer.notes);
		currentDom.find('.time-left').attr('data-endtime',timer.endtime);
		$('#timers').append(currentDom);
	};

	updateTimeLeft();
}

function updateTimeLeft () {
	var timeleft;
	var timestring;
	$('.timer>.time-left').each(function (index,element) {
		timeleft = Math.floor(moment($(this).attr('data-endtime')).diff(moment())/60000);
		if (timeleft<0) {
			timestring = 'ready';
		} else {
			// minutes
			timestring = (timeleft%60)>9||(timeleft%60)<0?
				(timeleft%60).toString() + 'm':
				'0'+(timeleft%60).toString() + 'm';
			// hours
			timeleft = Math.floor(timeleft/60);
			timestring = (timeleft).toString() + 'h ' + timestring;
		}
		$(this).html(timestring);
	});
}

function filterSeeds () {
	try {
		var filter = new RegExp($('#seed-filter').val(),'i');
	} catch (e) {
		return;
	}

	$('#select-seed').html('');
	var seed;
	for (var index in seeds) {
		seed = seeds[index];
		if (filter.test(seed.name)) {
			$('#select-seed').append(
				'<option value="'+seed.id+'">'+seed.name+'</option>'
				);
		}
	};

}

