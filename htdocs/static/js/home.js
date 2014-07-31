
// CONSTANTS
var climate_growth_multi = 0.7;

// VARIABLES

var timers;
var timerIndex = {};
var timerIdCounter = 1;
var seeds = {};
for (var i = 0; i < context.seeds.length; i++) {
	seeds[context.seeds[i].id] = context.seeds[i];
};

// CODE
loadTimers();
displayTimers();

setInterval(updateTimeLeft,3000);

$('.radio-climate[value='+prefs.get('lastClimate')+']').addClass('active');

// LISTENERS

$('#seed-filter').on('keyup',filterSeeds);
$('#add-timer').on('click',function (event) {
	addTimer($('#select-seed').val(),$('#textarea-notes').val());
});

$('#timers').on('click','.delete-timer',function (event) {
	event.preventDefault();
	removeTimer($(this).parents('.timer').attr('data-id'));
});
$('#timers').on('click','.edit-timer',function (event) {
	showEditForm($(this).parents('.timer').attr('data-id'));
});
$('#timers').on('click','.grow-timer',function (event) {
	growTimer($(this).parents('.timer').attr('data-id'));
});
$('#timers').on('click','.harvest-timer',function (event) {
	harvestTimer($(this).parents('.timer').attr('data-id'));
});
$('#timers').on('click','.restart-timer',function (event) {
	restartTimer($(this).parents('.timer').attr('data-id'));
});

$('#timers').on('click','.time-left-edit-submit',function (event) {
	var id = $(this).parents('.timer').attr('data-id');
	var timerDom = $('#timer-'+id);
	var timer = timerIndex[id];

	var days = parseInt(timerDom.find('.time-left-edit .days').val());
	var hours = parseInt(timerDom.find('.time-left-edit .hours').val());
	var minutes = parseInt(timerDom.find('.time-left-edit .minutes').val());
	days = isNaN(days)?0:days;
	hours = isNaN(hours)?0:hours;
	minutes = isNaN(minutes)?0:minutes;

	minutes = (days*24 + parseInt(hours))*60 + parseInt(minutes);

	timer.endtime = moment().add(minutes,'m').toISOString();

	saveTimers();
	displayTimers();
});
$('#timers').on('click','.time-left-edit-discard',function (event) {
	var id = $(this).parents('.timer').attr('data-id');
	var timerDom = $('#timer-'+id);

	timerDom.find('.time-left').removeClass('no-display');
	timerDom.find('.notes').removeClass('no-display');

	timerDom.find('.time-left-edit').addClass('no-display');
});

$('.radio-climate').on('click',function (event) {
	$('.radio-climate').removeClass('active');
	$(this).addClass('active');
	prefs.set('lastClimate',$(this).val());
});

// FUNCTIONS
function loadTimers () {
	if (localStorage.timers) {
		timers = JSON.parse(localStorage.timers);
		for (var i = 0; i < timers.length; i++) {
			timers[i].id = timerIdCounter++;
			timerIndex[timers[i].id] = timers[i];
		};
	} else {
		timers = [];
	}
	sortTimers();
}

function saveTimers () {
	sortTimers();
	localStorage.setItem('timers',JSON.stringify(timers));
}

function addTimer (seedId,notes) {
	if (!seedId) {
		return;
	}
	var idealClimate = $('.radio-climate.active').val()==seeds[seedId].climate;
	var actualGrowthMinutes = idealClimate ?
		seeds[seedId].growth_minutes*climate_growth_multi :
		seeds[seedId].growth_minutes;

	var timer = {
		'id':timerIdCounter++,
		'seed':seedId,
		'endtime':moment().add(actualGrowthMinutes,'m').toISOString(),
		'notes':notes?notes:'',
		'idealClimate':idealClimate,
		'grown':false,
	};
	timers.push(timer);
	timerIndex[timer.id] = timer;

	saveTimers();
	displayTimers();
}
function removeTimer (id) {
	for (var i = 0; i < timers.length; i++) {
		if (timers[i].id==id) {
			timers.splice(i,1);
			saveTimers();
			displayTimers();
			break;
		}
	};
}
function growTimer (id) {
	var timer = timerIndex[id];
	timer.endtime = moment().toISOString();
	saveTimers();
	displayTimers();
}
function harvestTimer (id) {
	var timer = timerIndex[id];
	var minutes = seeds[timer.seed].harvest_minutes;
	if (timer.idealClimate) {
		minutes *= climate_growth_multi;
	}
	timer.endtime = moment().add(minutes,'m').toISOString()
	timer.grown = false;
	saveTimers();
	displayTimers();
}
function restartTimer (id) {
	var timer = timerIndex[id];
	var minutes = seeds[timer.seed].growth_minutes;
	if (timer.idealClimate) {
		minutes *= climate_growth_multi;
	}
	timer.endtime = moment().add(minutes,'m').toISOString();

	saveTimers();
	displayTimers();
}

function showEditForm (id) {
	var timerDom = $('#timer-'+id);

	timerDom.find('.time-left').addClass('no-display');
	timerDom.find('.notes').addClass('no-display');

	timerDom.find('.time-left-edit').removeClass('no-display');
}

function sortTimers () {
	timers.sort(function (a, b) {
		return moment(a.endtime) - moment(b.endtime);
	});
	return timers;
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
		currentDom.attr('id','timer-'+timer.id);
		currentDom.find('.name').html(seed.name);
		var datediv = currentDom.find('.time-done > .date');
		datediv.html(endtime.format('DD.MM.YY'));
		if (moment().isSame(endtime,'d')) {
			datediv.addClass('today');
		}
		currentDom.find('.time-done > .time').html(endtime.format('HH:mm'));
		var notesHTML = timer.notes.replace('\n','<br>');
		if (timer.idealClimate) {
			notesHTML = 'Is in ideal climate<br>' + notesHTML;
		}
		currentDom.find('.notes').html(notesHTML);
		currentDom.find('.time-left').attr('data-endtime',timer.endtime);

		currentDom.attr('data-id',timer.id);

		$('#timers').append(currentDom);
	};

	updateTimeLeft();
}

function updateTimeLeft () {
	var timeleft;
	var timestring;
	var id;
	var timer;
	var seed;
	$('#timers .timer>.time-left').each(function (index,element) {

		timerDom = $(this).parents('.timer');
		id = timerDom.attr('data-id');
		timer = timerIndex[id];
		console.log(timer);
		seed = seeds[timer.seed];

		timeleft = Math.floor(moment($(this).attr('data-endtime')).diff(moment())/60000);
		if (timeleft<0) {
			timestring = 'ready';
			timer.grown = true;
		} else {
			// minutes
			timestring = (timeleft%60)>9||(timeleft%60)<0?
				(timeleft%60).toString() + 'm':
				'0'+(timeleft%60).toString() + 'm';
			// hours
			timeleft = Math.floor(timeleft/60);
			timestring = (timeleft).toString() + 'h ' + timestring;
		}
		if (timer.grown) {
			if (seed.harvest_minutes) {
				timerDom.find('.harvest-timer').removeClass('no-display');
			}
			timerDom.find('.restart-timer').removeClass('no-display');
		} else {
			timerDom.find('.grow-timer').removeClass('no-display');
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

