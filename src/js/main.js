import Thingy from "./vendor/thingy/index.js";
import ThingyConnector from  "../components/thingy-connector/ThingyConnector.js";
import BatteryStatus from  "../components/battery-status/BatteryStatus.js";
import pickupWatcher from "../components/pickup-watcher/pickup-watcher.js";

const thingyA = new Thingy({logEnabled: true});
// const thingyB = new Thingy({logEnabled: true});



/**
* initialize all
* @param {string} varname Description
* @returns {undefined}
*/
const init = function() {
	new ThingyConnector(thingyA, {id: 'Thingy A', elm:document.getElementById(`connect-box-a`)});
	// new ThingyConnector(thingyA, 'Thingy B');
	new BatteryStatus();
	new pickupWatcher();
};

// kick of the script when all dom content has loaded
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
