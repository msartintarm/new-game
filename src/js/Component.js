

let getElemKey = (elem) => { return elem.className || elem.tagName; };

const handlerList = [ 'keydown', 'mousedown', 
		'mousemove', 'mouseover', 'touchdown'];

/* Looks for handler defined in mapping
	- Checks in order 
	  1. target element class name
	  2. target element tag name
*/
let handler = (e, map) => {
	let mapKey = getElemKey(e.target);
	let fn = map[mapKey];
	return fn? fn(e):
		map['default']? map['default'](e): null;
};

let mouseDownMap = { default: function() {} };

let eventmap = {
	keydown: {},
	mousedown: {},
	mousemove: {},
	mouseover: {},
	touchdown: {}
};

let handlerMap = {
	keydown: (e) => { handler(e, eventmap['keydown']) },
	mousedown: (e) => { handler(e, eventmap['mousedown']) },
	mousemove: (e) => { handler(e, eventmap['mousemove']) },
	mouseover: (e) => { handler(e, eventmap['mouseover']) },
	touchdown: (e) => { handler(e, eventmap['touchdown']) }
};

let registeredHandlerMap = {};

class Component extends React.Component {

	// will save a bound version of function
	// ES6 React auto bind alternatives:
	// http://egorsmirnov.me/2015/08/16/react-and-es6-part3.html
	registerHandler (evName, key, fn, ctx) {

		console.log(arguments);
		console.log(evName in registeredHandlerMap);
		// invoke page level function if it doesn't exist already
		if (!(evName in registeredHandlerMap) &&
			evName in handlerMap) {
			registeredHandlerMap[evName] = true;
		console.log(key);
		console.log(handlerMap[evName]);
		document.addEventListener(evName, handlerMap[evName]);
		}

		eventmap[evName][key] = fn.bind(this);
	}
}

export default Component;