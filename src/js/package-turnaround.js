
let thingy;
const stateElm = document.getElementById(`pickupState`);

const logPickupState = function(detail) {
	if (detail.thingy === thingy) {
		stateElm.textContent = detail.state;
	} else {
		console.log('pickup state change for other Thingy');
	}
}



/**
* 
* @returns {undefined}
*/
const initTurnaround = function(e) {
	thingy = e.detail.thingy;

	document.body.addEventListener('pickupstatechange', e => logPickupState(e.detail));

	// const method = "rotationmatrixorientation";
	// thingy[method].start()
	// thingy.addEventListener(method, e => console.log(e.detail));
};


/**
* initialize all
* @returns {undefined}
*/
const init = function() {
	document.body.addEventListener('connect.thingyConnector', initTurnaround);
};

// kick of the script when all dom content has loaded
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
