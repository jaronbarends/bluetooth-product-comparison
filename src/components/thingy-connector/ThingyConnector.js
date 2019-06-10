/*
* class for setting up connection with a Thingy
* The Thingy itself doesn't send events upon connecting or disconnecting
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

export default class ThingyConnector {

	constructor(thingy, options) {
		const defaults = {
			id: 'Thingy',
			elm: document.body,// element to append connect box to
		};
		this.settings = Object.assign({}, defaults, options);
		if (!this.settings.name) {
			this.settings.name = this.settings.id;
		}

		this.thingy = thingy;
		this.id = this.settings.id;
		this.addConnectBox();
		this._addEventListeners();
		this._initButtons();
	}


	/**
	* add connectbox to the page
	* @returns {undefined}
	*/
	addConnectBox() {
		const html = `<input class="ty-connect-btn" type="button" data-ty-connect-btn value="connect ${this.settings.name}">
			<input class="ty-connect-btn ty-connect-btn--is-disabled" type="button" data-ty-disconnect-btn value="disconnect ${this.settings.name}">`;

		const box = document.createElement(`div`);
		box.classList.add(cssClasses.box);
		box.innerHTML = html;

		this.settings.elm.appendChild(box);
		this.connectBox = box;
	};


	/**
	* start the thingy
	* @returns {undefined}
	*/
	async _start(thingy) {
		try {
			await thingy.connect();
			const detail = {
				thingy,
				id: this.settings.id,
				name: this.settings.name,
			};
			thingyEvent.sendThingyEvent(eventNames.connect, detail);
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
			const detail = {
				thingy,
				id: this.settings.id,
				name: this.settings.name,
			};
			thingyEvent.sendThingyEvent(eventNames.disconnect, detail);
		} catch(error) {
			console.error(error);
		}
	};


	/**
	* initialize the connect and disconnect buttons
	* @returns {undefined}
	*/
	_initButtons() {
		this.connectBtn = this.connectBox.querySelector('[data-ty-connect-btn');
		this.disconnectBtn = this.connectBox.querySelector('[data-ty-disconnect-btn');

		this.connectBtn.addEventListener('click', async () => {
			this._start(this.thingy);
		});
		this.disconnectBtn.addEventListener('click', async () => {
			this._stop(this.thingy);
		});
	};


	/**
	* handle connection being made
	* @returns {undefined}
	*/
	_connectHandler(e) {
		if (e.detail.thingy === this.thingy) {
			// it's our Thingy 
			this.connectBtn.classList.add(cssClasses.btnDisabled);
			this.disconnectBtn.classList.remove(cssClasses.btnDisabled);
		} else {
			// it's another Thingy
			console.log(`other Thingy connected: ${e.detail.name}`);
		}
	};


	/**
	* handle connection being closed
	* @returns {undefined}
	*/
	_disconnectHandler(e) {
		console.log('disconnect:', e);
		if (e.detail.thingy === this.thingy) {
			// it's our Thingy 
			this.connectBtn.classList.remove(cssClasses.btnDisabled);
			this.disconnectBtn.classList.add(cssClasses.btnDisabled);
		} else {
			// it's another Thingy
			console.log(`other Thingy disconnected: ${e.detail.name}`);
		}
	};


	/**
	* add listeners
	* @returns {undefined}
	*/
	_addEventListeners() {
		document.body.addEventListener(eventNames.connect, e => this._connectHandler(e));
		document.body.addEventListener(eventNames.disconnect, e => this._disconnectHandler(e));
	};

	
}