import Thingy from "./vendor/thingy/index.js";
import ThingyConnector from  "../components/thingy-connector/ThingyConnector.js";
import BatteryStatus from  "../components/battery-status/BatteryStatus.js";
import ThingyOrientationWatcher from "../components/thingy-orientation-watcher/ThingyOrientationWatcher.js";

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
* initialize all
* @param {string} varname Description
* @returns {undefined}
*/
const init = function() {
	new ThingyConnector(thingyA.thingy, {id: thingyA.id, name: thingyA.name, elm:document.getElementById(`connect-box-a`)});
	new ThingyConnector(thingyB.thingy, {id: thingyB.id, name: thingyB.name, elm:document.getElementById(`connect-box-b`)});

	// new BatteryStatus();
	new ThingyOrientationWatcher(thingyA.thingy);
	new ThingyOrientationWatcher(thingyB.thingy);


	document.body.addEventListener('pickupstatechange', e => pickupstatechangeHandler(e.detail));
};

// kick of the script when all dom content has loaded
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
