
// CODE
var prefs = new Prefs();

// PREFERENCES
function Prefs() {
	this.init = function () {
		this.load();
	}

	this.get = function (option) {
		return this.data[option];
	}
	this.set = function (option,value) {
		this.data[option] = value;
		this.save();
	}
	this.save = function () {
		localStorage.setItem('prefs',JSON.stringify(this.data));
	}
	this.load = function () {
		if (localStorage.prefs) {
			this.data = JSON.parse(localStorage.prefs);
		} else {
			this.data = {};
		}
	}
	this.init();
}

// UTILS

