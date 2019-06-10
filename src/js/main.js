import Thingy from "./vendor/thingy/index.js";
import ThingyConnector from  "../components/thingy-connector/ThingyConnector.js";
import BatteryStatus from  "../components/battery-status/BatteryStatus.js";
import ThingyPickupWatcher from "../components/thingy-pickup-watcher/ThingyPickupWatcher.js";

const thingyA = {
	thingy: new Thingy({logEnabled: true}),
	id: 'a',
	name: 'Thingy A'
};

const thingyB = {
	thingy: new Thingy({logEnabled: true}),
	id: 'b',
	name: 'Thingy B'
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
}


/**
* 
* @returns {undefined}
*/
const initDummy = function() {
	const products = document.getElementById(`products`);
	const cbA = document.getElementById('cb-a');
	const cbB = document.getElementById('cb-b');

	cbA.addEventListener('click', (e) => {
		if (e.target.checked) {
			products.classList.add('products--a-active');
		} else {
			products.classList.remove('products--a-active');
		}
	});

	cbB.addEventListener('click', (e) => {
		if (e.target.checked) {
			products.classList.add('products--b-active');
		} else {
			products.classList.remove('products--b-active');
		}
	});
};


/**
* initialize all
* @param {string} varname Description
* @returns {undefined}
*/
const init = function() {
	new ThingyConnector(thingyA.thingy, {id: thingyA.id, name: thingyA.name, elm:document.getElementById(`connect-box-a`)});
	new ThingyConnector(thingyB.thingy, {id: thingyB.id, name: thingyB.name, elm:document.getElementById(`connect-box-b`)});

	// new BatteryStatus();
	new ThingyPickupWatcher(thingyA.thingy);
	new ThingyPickupWatcher(thingyB.thingy);


	document.body.addEventListener('pickupstatechange', e => pickupstatechangeHandler(e.detail));

	initDummy();
};

// kick of the script when all dom content has loaded
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
