/* 
class for checking changes in orientation and pickup/rest state of thingy

Requires ThingyConnector.js to be present in the page
*/
import {thingyEvent} from '../../js/util/thingy-event.js';

export default class ThingyOrientationWatcher {
	constructor(thingy) {
		this.thingy = thingy;

		this.roll = null;
		this.pitch = null;
		this.yaw = null;
		this.prevRoll = null;
		this.prevPitch = null;
		this.prevYaw = null;
		this.relativeYaw = null;
		this.yawCorrection = 0;
		
		this.states = {
			UNKNOWN: 'unknown',
			IDLE: 'idle',
			ACTIVE: 'active'
		};
		this.timestamp = null,
		this.state = this.states.UNKNOWN;// confirmed state
		this.lastStates = [];
		this.validationCount = 5;// number of equal states to validate change
		this.isInitiated = false;
		this.checkTimer = null;
		this.checkInterval = 100;
		this.threshold = 0.25;// threshold for change

		this._addEventListeners();
	}


	/**
	* show listener for euler orientation changes
	* @returns {undefined}
	*/
	async _initEulerOrientation() {
		if (!this.isInitiated) {
			this.thingy.addEventListener('eulerorientation', (e) => {
				this._updateOrientation(e.detail);
			});
		}
		this.thingy.eulerorientation.start();
		this.isInitiated = true;
		this._startChecking();
	};



	/**
	* handle connection being made
	* @returns {undefined}
	*/
	_connectHandler(e) {
		if (e.detail.thingy === this.thingy) {
			this.thingyId = e.detail.id;
			this.thingyName = e.detail.name;

			this._initEulerOrientation();
			// this._initCalibrationButton();
		}
	};


	/**
	* handle connection being closed
	* @returns {undefined}
	*/
	_disconnectHandler(e) {
		if (e.detail.thingy === this.thingy) {
			this.thingy.eulerorientation.stop();
		}
	};


	/**
	* 
	* @returns {undefined}
	*/
	_addEventListeners() {
		document.body.addEventListener('connect.thingyConnector', e => this._connectHandler(e));
		document.body.addEventListener('disconnect.thingyConnector', e => this._disconnectHandler(e));
	};


	/**
	* start checking for state changes
	* @returns {undefined}
	*/
	_startChecking() {
		this.timer = setTimeout(() => this._checkOrientation(), this.checkInterval);
	};


	/**
	* check if orientation has changed
	* @returns {undefined}
	*/
	_checkOrientation() {
		let newState  = this.states.UNKNOWN;

		// we can only determine if state is idle or active when both current and previous values are known
		if (this.roll !== null && this.pitch !== null && this.yaw !== null && this.prevRoll !== null && this.prevPitch !== null && this.prevYaw !== null) {
			if (
				Math.abs(this.roll - this.prevRoll) >= this.threshold ||
				Math.abs(this.pitch - this.prevPitch) >= this.threshold ||
				Math.abs(this.yaw - this.prevYaw) >= this.threshold
			) {
				newState = this.states.ACTIVE;
			} else {
				newState = this.states.IDLE;
			}

		}

		this.prevRoll = this.roll;
		this.prevPitch = this.pitch;
		this.prevYaw = this.yaw;

		// check for inaccurate readings:
		// push new state into lastStates array; if there are enough of same type,
		// and they're different from current confirmed state, change state
		const changeValidated = this._validateState(newState);

		// when state has changed, update state and send event
		if (newState !== this.state && changeValidated) {
			this.state = newState;
			const detail = {
				thingy: this.thingy,
				id: this.thingyId,
				name: this.thingyName,
				state: this.state
			};
			thingyEvent.sendThingyEvent('pickupstatechange', detail);
		}

		this._startChecking();
	};


	/**
	* euler readings are not always very trustworthy
	* push new state into lastStates array; if there are enough of same type,
	* and they're different from current confirmed state, change state
	* @returns {undefined}
	*/
	_validateState(newState) {
		this.lastStates.push(newState);
		let changeValidated = true;
		if (this.lastStates.length > this.validationCount) {
			this.lastStates.shift();
			this.lastStates.forEach((state) => {
				if (state !== newState) {
					changeValidated = false;
				}
			});
		} else {
			// not enough values in array yet
			changeValidated = false;
		}
		// console.log(this.lastStates);
		return changeValidated;
	};


	/**
	* update the pickup status of this Thingy
	* @returns {undefined}
	*/
	_updateOrientation(detail) {
		this.roll = detail.roll;
		this.pitch = detail.pitch;
		this.yaw = detail.yaw;
		this.relativeYaw = this.yaw - this.yawCorrection;

		const detailToSend = {
			thingy: this.thingy,
			relativeYaw: this.relativeYaw
		};
		thingyEvent.sendThingyEvent('relativeyawchange', detailToSend);
	}


	/**
	* calibrate the yaw
	* @returns {undefined}
	*/
	_calibrateYaw(e) {
		e.preventDefault();
		this.yawCorrection = this.yaw;
		const details = {roll: this.roll, pitch: this.pitch, yaw: this.yaw}
		this._updateOrientation(details);
	};

	/**
	* initialize button for calibrating the yaw-direction
	* @returns {undefined}
	*/
	_initCalibrationButton() {
		const cBtn = document.getElementById(`pickup-watcher-calibration-btn`);
		if (cBtn) {
			cBtn.addEventListener('click', (e) => this._calibrateYaw(e));
		}
	};

}
