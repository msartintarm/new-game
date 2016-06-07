
/* 
	Determines precedence of elements in handler map
	1. target element class name -- example the_button
	2. target element tag name (uppercase) -- for example Canvas
*/
let getElemKey = (elem) => { return elem.className || elem.tagName; };

/* Looks for handler defined in mapping for target element */
let handler = (e, map) => {
	let theFunction = map[getElemKey(e.target)];
	return theFunction? theFunction(e):
		map['default']? map['default'](e):
			null;
};

let eventmap = {
	tick: {}	
};
let registeredHandlerMap = { 'tick': {} };
let tickCountMap = {};

let registerHandler = (evName, key, theFunction) => {

	// invoke page level function if it doesn't exist already
	if (!(evName in registeredHandlerMap)) {
		eventmap[evName] = {};
		registeredHandlerMap[evName] = 
			(e) => { handler(e, eventmap[evName]) };
		document.addEventListener(evName, registeredHandlerMap[evName]);
	}
	eventmap[evName][key] = theFunction;
};

/* unique key for function,
	function itself, 
	num times to run (0 if unlimited),
	replace if should override previous function */
let registerTickEvent = (key, theFunction, numTimes, replace) => {
	if (key in registeredHandlerMap['tick']) {
		if (!replace) return; // no duplicate functions
	}

	eventmap['tick'][key] = theFunction;
	tickCountMap[key] = 0;

	registeredHandlerMap['tick'][key] = () => {
		if (numTimes > 0 && ++tickCountMap[key] >= numTimes ) {
			delete registeredHandlerMap['tick'][key];
			return;
		}
		eventmap['tick'][key]();
	};
};

let onTick = () => { // call after requesting animation frame
	var theList = registeredHandlerMap['tick'];
	for (let name in theList) {
		theList[name]();
	}
}

export { registerHandler, registerTickEvent, onTick };
