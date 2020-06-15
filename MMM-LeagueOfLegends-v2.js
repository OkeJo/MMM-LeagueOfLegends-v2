/* global Module */

/* Magic Mirror
 * Module: MMM-LeagueOfLegends-v2
 *
 * By OkeJo
 * MIT Licensed.
 */

Module.register("MMM-LeagueOfLegends-v2", {
	defaults: {
		updateInterval: 6000,
		encryptedSummonerId: "MqYhudzARMTl-qhePXLos_XUEhb3yAtg9nSo3NuHy8N5uzo",
		apiKey: "RGAPI-7ff429d8-b283-42af-98a8-0adb38cf7418",
		retryDelay: 5000
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function () {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData();
		setInterval(function () {
			self.updateDom();
		}, this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function () {
		var self = this;
		var cors_api_host = 'cors-anywhere.herokuapp.com';
		var urlApi = "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/";
		var cors_api_url = 'https://' + cors_api_host + '/' + urlApi + this.config.encryptedSummonerId + "?api_key=" + this.config.apiKey;
		var retry = true;

		var dataRequest = new XMLHttpRequest();
		dataRequest.open("GET", cors_api_url, true);
		dataRequest.onreadystatechange = function () {
			console.log(this.readyState);
			if (this.readyState === 4) {
				console.log(this.status);
				if (this.status === 200) {
					self.processData(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name, this.status);
					retry = false;
				} else {
					Log.error(self.name, "Could not load data.");
				}
				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		dataRequest.send();
	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function (delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad;
		var self = this;
		setTimeout(function () {
			self.getData();
		}, nextLoad);
	},

	getDom: function () {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		// If this.dataRequest is not empty
		if (this.dataRequest) {

			// Creating html table.
			let wrapper = document.createElement("table");
			// Setting class name for the table.
			wrapper.className = "bright xsmall";
			// Creating table rows with independent headings.
			let headerRow = document.createElement("tr");
			headerRow.className = "header-row";
			this.createTableCell(headerRow, this.translate("Summoner Name"), "summoner-header", "center");
			this.createTableCell(headerRow, this.translate("Queue Type"), "queue-rank-header", "center");
			this.createTableCell(headerRow, this.translate("Tier"), "tier-header", "center");
			this.createTableCell(headerRow, this.translate("Rank"), "rank-header", "center");
			this.createTableCell(headerRow, this.translate("LP"), "lp-header", "center");
			wrapper.appendChild(headerRow);
			// Creating table rows with the corresponging data.
			let row = document.createElement("tr");
			row.className = "stats-row";
			this.createTableCell(row, this.dataRequest[0].summonerName, "summoner", "left");
			this.createTableCell(row, this.dataRequest[0].queueType, "queue", "center");
			this.createTableCell(row, this.dataRequest[0].tier, "tier", "center");
			this.createTableCell(row, this.dataRequest[0].rank, "rank", "center");
			this.createTableCell(row, this.dataRequest[0].leaguePoints, "lp", "center");
			wrapper.appendChild(row);
			// Appending rows parent wrapper.
			// "Sending" the wrapper to the screen. 
			return wrapper;
		}

		// Data from helper
		if (this.dataNotification) {
			var wrapperDataNotification = document.createElement("div");
			// translations  + datanotification
			wrapperDataNotification.innerHTML = this.translate("UPDATE") + ": " + this.dataNotification.date;

			wrapper.appendChild(wrapperDataNotification);
		}
		return wrapper;
	},

	// Creates a table row cell.
	// @param row - The table row to add cell to.
	// @param text - The text to show.
	// @param align - Text align: 'left', 'center' or 'right'.
	createTableCell: function (row, text, className, align = "right") {

		let cell = document.createElement("td");
		cell.innerHTML = text;
		cell.className = className;

		cell.style.cssText = "text-align: " + align + ";";

		row.appendChild(cell);
	},

	getScripts: function () {
		return [];
	},

	getStyles: function () {
		return [
			"MMM-LeagueOfLegends-v2.css",
		];
	},

	// Load translations files
	getTranslations: function () {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/es.json"
		};
	},

	processData: function (data) {
		var self = this;
		this.dataRequest = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed); }
		this.loaded = true;

		// the data if load
		// send notification to helper
		this.sendSocketNotification("MMM-LeagueOfLegends-v2-NOTIFICATION_TEST", data);
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if (notification === "MMM-LeagueOfLegends-v2-NOTIFICATION_TEST") {
			// set dataNotification
			this.dataNotification = payload;
			this.updateDom();
		}
	},
});
