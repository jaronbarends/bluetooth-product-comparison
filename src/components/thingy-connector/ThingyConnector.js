/*
class for setting up connection with Thingy
*/

import {thingyEvent} from "../../js/util/thingy-event.js";

const eventNames = {
	'connect': `connect.thingyConnector`,
	'disconnect': `disconnect.thingyConnector`,
}

const cssClasses = {
	box: 'ty-connect-box',
	btnDisabled: 'btn--is-disabled',
}

const constants = {
	cssClasses,
	eventNames,
};

const connectBtn = document.getElementById(`connect-btn`);
const disconnectBtn = document.getElementById(`disconnect-btn`);

export default class ThingyConnector {

	constructor(thingy, options) {
		const defaults = {
			id: 'Thingy',
			elm: document.body,// element to append connect box to
		};
		const settings = Object.assign({}, defaults, options);
		if (!settings.name) {
			settings.name = settings.id;
		}

		this.thingy = thingy;
		this.id = settings.id;
		this.addConnectBox(thingy, settings);
		// this._addEventListeners();
		// this._initButtons();
	}


	/**
	* add connectbox to the page
	* @returns {undefined}
	*/
	addConnectBox(thingy, options) {
		const html = `<input class="ty-connect-btn" type="button" data-ty-connect-btn value="connect ${options.name}">
			<input class="ty-connect-btn ty-connect-btn--is-disabled" type="button" data-ty-disconnect-btn value="disconnect ${options.name}">`;

		const box = document.createElement(`div`);
		box.classList.add(cssClasses.box);
		box.innerHTML = html;

		const connectBtn = box.querySelector('[data-ty-connect-btn');
		const disconnectBtn = box.querySelector('[data-ty-disconnect-btn');

		connectBtn.addEventListener('click', async () => {
			this._start(thingy);
		});
		disconnectBtn.addEventListener('click', async () => {
			this._stop(thingy);
		});

		options.elm.appendChild(box);
	};


	/**
	* start the thingy
	* @returns {undefined}
	*/
	async _start(thingy) {
		try {
			await thingy.connect();
			thingyEvent.sendThingyEvent(eventNames.connect, {thingy});
		} catch (error) {
			console.error(error);
		}
	};
	
	
	/**
	* stop the thingy
	* @returns {undefined}
	*/
	async _stop(thingy) {
		try {
			await thingy.disconnect();
			thingyEvent.sendThingyEvent(eventNames.disconnect, {thingy});
		} catch(error) {
			console.error(error);
		}
	};


	/**
	* initialize the connect and disconnect buttons
	* @returns {undefined}
	*/
	_initButtons() {
		connectBtn.addEventListener('click', async () => {
			this._start(this.thingy);
		});
		disconnectBtn.addEventListener('click', async () => {
			this._stop(this.thingy);
		});
	};


	/**
	* handle connection being made
	* @returns {undefined}
	*/
	_connectHandler() {
		connectBtn.classList.add(cssClasses.btnDisabled);
		disconnectBtn.classList.remove(cssClasses.btnDisabled);
	};


	/**
	* handle connection being closed
	* @returns {undefined}
	*/
	_disconnectHandler() {
		connectBtn.classList.remove(cssClasses.btnDisabled);
		disconnectBtn.classList.add(cssClasses.btnDisabled);
	};


	/**
	* add listeners
	* @returns {undefined}
	*/
	_addEventListeners() {
		document.body.addEventListener(eventNames.connect, this._connectHandler);
		document.body.addEventListener(eventNames.disconnect, this._disconnectHandler);
	};

	
}