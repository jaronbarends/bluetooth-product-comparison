import Thingy from "./vendor/thingy/index.js";
import ThingyConnector from  "../components/thingy-connector/ThingyConnector.js";
import BatteryStatus from  "../components/battery-status/BatteryStatus.js";
import ThingyPickupWatcher from "../components/thingy-pickup-watcher/ThingyPickupWatcher.js";

const products = document.getElementById(`products`);

const thingyA = {
	thingy: new Thingy({logEnabled: true}),
	id: 'a',
	name: 'Blue Box'
};

const thingyB = {
	thingy: new Thingy({logEnabled: true}),
	id: 'b',
	name: 'Orange Box'
};

/**
* handle change in pickup state
* @returns {undefined}
*/
const pickupstatechangeHandler = function(detail) {
	console.log(`state change for ${detail.name} - new state: ${detail.state}`);
	const elmId = `pickup-state-${detail.id}`;
	console.log(elmId);
	const elm = document.getElementById(elmId);
	elm.textContent = detail.state;

	const className = `products--${detail.id}-active`;
	if (detail.state === 'active') {
		products.classList.add(className);
	} else {
		products.classList.remove(className);
	}
}


/**
* 
* @returns {undefined}
*/
const initDummy = function() {
	const products = document.getElementById(`products`);
	const cbA = document.getElementById('cb-a');
	const cbB = document.getElementById('cb-b');
	const classA = 'products--a-active';
	const classB = 'products--b-active';

	if (products.classList.contains(classA)) {
		cbA.checked = true;
	}
	if (products.classList.contains(classB)) {
		cbB.checked = true;
	}

	cbA.addEventListener('click', (e) => {
		if (e.target.checked) {
			products.classList.add(classA);
		} else {
			products.classList.remove(classA);
		}
	});

	cbB.addEventListener('click', (e) => {
		if (e.target.checked) {
			products.classList.add(classB);
		} else {
			products.classList.remove(classB);
		}
	});
};


/**
* initialize all
* @param {string} varname Description
* @returns {undefined}
*/
const init = function() {
	const connectBox = document.getElementById(`connect-box`);
	new ThingyConnector(thingyA.thingy, {id: thingyA.id, name: thingyA.name, elm: connectBox});
	new ThingyConnector(thingyB.thingy, {id: thingyB.id, name: thingyB.name, elm: connectBox});

	// new BatteryStatus();
	new ThingyPickupWatcher(thingyA.thingy);
	new ThingyPickupWatcher(thingyB.thingy);


	document.body.addEventListener('pickupstatechange', e => pickupstatechangeHandler(e.detail));

	initDummy();
};

// kick of the script when all dom content has loaded
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
