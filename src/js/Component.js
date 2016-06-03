

let getElemKey = (elem) => { return elem.className || elem.tagName; };

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

let eventmap = {};
let registeredHandlerMap = {};

class Component extends React.Component {

	// will save a bound version of function
	// ES6 React auto bind alternatives:
	// http://egorsmirnov.me/2015/08/16/react-and-es6-part3.html
	registerHandler (evName, key, fn, ctx) {

		// invoke page level function if it doesn't exist already
		if (!(evName in registeredHandlerMap)) {
			eventmap[evName] = {};
			registeredHandlerMap[evName] = 
				(e) => { handler(e, eventmap[evName]) };
			document.addEventListener(evName, registeredHandlerMap[evName]);
		}
		eventmap[evName][key] = fn.bind(this);
	}
}

export default Component;