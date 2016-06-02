const player = {
	foot: {
		points: [
			[ [10, 20], [30, 20], [30, 30] ]
		]
	}
};

const KEYS = {
	mLeft: 79,
	mRight: 80
};

// for keys that fromCharCode doesn't define
const keyCodeMap = {
	16: 'Left Shift',
	32: 'Space',
	37: 'Left',
	38: 'Up',
	39: 'Right',
	40: 'Down'
};

const handlerList = [
	[ 'keydown', 'keyDownHandler'],
	[ 'mousedown', 'mouseDownHandler'],
	[ 'mousemove', 'mouseMoveHandler'],
	[ 'mouseover', 'mouseOverHandler'],
	[ 'touchdown', 'touchDownHandler']
];


class DisplayArray extends React.Component {
	render () {
		return(
			<div className="display_array" >
				<b className="display_label">Coords for {this.props.line_label}</b>
				{this.props.text}
			</div>
		);
	}
}

class EventButton extends React.Component {
	constructor(props) {
		super(props);
		this.key_val = 55;
		this.state = {
			button_text: 'Set ' + this.props.name + ' keycode (currently '
				+ this.getKeycodeName() + ')'
		};
		this.addStartButtonText(this.state);
		this.setKey = this.setKey.bind(this);
	}

	/* Edits provided object and adds key / val pair for button text */
	addStartButtonText (obj) {
		let keyName = this.getKeycodeName();
		obj.button_text = 'Set ' + (this.props.name || 'the')
			+ ' keycode (currently ' + keyName + ')';
	}

	/* Edits provided object and adds key / val pair for button text */
	addSetButtonText (obj) {
		let keyName = this.getKeycodeName();
		obj.button_text = 'The ' + (this.props.name || 'event')
			+ ' set to ' + keyName;
	}

	getKeycodeName () {
	return keyCodeMap[this.key_val]
		|| String.fromCharCode(this.key_val).trim()
		|| '\'' + this.key_val + '\'';
	}

	/* Returns function indexed by key that can be bound
		to DOM elements and deletes itself after execution
	*/
	setKey (ev) {
		let theCode = ev.keyCode;
		this.key_val = theCode;
		let newState = {};
		this.addSetButtonText(newState);
		this.setState(newState);
		document.body.removeEventListener('keydown', this.setKey);
	}

	/* Returns function indexed by key that can be bound to DOM elements */
	buttonMouseDown (e) {
		let newState = { button_text: 'next key down..' };
		this.recordMouseDown(e, newState);
		this.setState(newState);
		document.body.addEventListener('keydown', this.setKey);
	}

	render () {
		return (
			<button className={(this.props.name + ' button').replace(/ /g,"-")} >
				{this.state.button_text} 
			</button>
		)
	}

}

/* Tells canvas what to draw */
class PolygonCanvas extends React.Component {

	constructor () {
		super();

		this.state = ({
			polygon_arr: [[]],
			polygon_arr_text: 'no coords bro',
			example_line: [],
			example_line_text: 'no coords bro',
			mouseDownElem: this
		})

		// ES6 React auto bind alternatives:
		// http://egorsmirnov.me/2015/08/16/react-and-es6-part3.html
		for (let [key, val] of handlerList) {
			this[val] = this[val].bind(this);
			console.log(key + "," + val);
			document.addEventListener(key, this[val]);
		}

//		this.keyList = {};		/* Key code for this event key */
//		this.setKey = {};		/* Set key functions */
//		let k = 36; // char code of 0
//		for (let entry of ['line end', 'line loop', 'line drop']) {
//			this.setKey[entry] = this.setKeyGen(entry);
//			this.keyList[entry] = ++k;
//			this.addStartButtonText(this.state, entry);
//		}
	}

//	getKeycodeName (key) {
//		return keyCodeMap[key]
//			|| String.fromCharCode(key).trim()
//			|| '\'' + key + '\'';
//	}

	/* Edits provided object and adds key / val pair for button text */
/*	addStartButtonText (obj, name) {
		let keyName = this.getKeycodeName(this.keyList[name]);
		let textName = name + ' button_text';
		obj[textName] = 'Set ' + (name || 'the')
			+ ' keycode (currently ' + keyName + ')';
	}
*/
	/* Edits provided object and adds key / val pair for button text */
/*	addSetButtonText (obj, name) {
		let keyName = this.getKeycodeName(this.keyList[name]);
		let textName = name + ' button_text';
		obj[textName] = 'The ' + (name || 'event') + ' set to ' + keyName;
	}
*/
	/* Determine which polygon to print for this frame */
	paintFrame (frame) {
		var num = this.props.index;
		if (num)
		this.paintPolygon(frame[num]);
	}

	/* Returns function indexed by key that can be bound
		to DOM elements and deletes itself after execution
	*//*
	setKeyGen (key) {
		let a = (ev) => {
			let theCode = ev.keyCode;
			this.keyList[key] = theCode;
			let newState = {};
			this.addSetButtonText(newState, key);
			this.setState(newState);
			document.body.removeEventListener('keydown', a);
		}.bind(this);
		return a;
	}
*/
	/* return array from event with offset relative to target */
	getCoords(e) {
		let t = e.target;
		let x = e.pageX - t.offsetLeft;
		let y = e.pageY - t.offsetTop;
		return [x, y];
	}

	/* Returns function indexed by key that can be bound to DOM elements *//*
	buttonMouseDownGen (key) {
		let textKey = key + ' button_text';
		return (e) => {

			let newState = {};
			newState[textKey] = 'next key down..';
			this.recordMouseDown(e, newState);
			this.setState(newState);
			document.body.addEventListener('keydown', this.setKey[key]);
		}.bind(this);
	}
*/
	/* Update polygon array with point from latest canvas click. */
	onCanvasMouseDown (e) {
		let newArr = [...this.state.polygon_arr]; // make copy
		newArr[0].push(this.getCoords(e));
		let newState = {
			polygon_arr: newArr,
			polygon_arr_text: JSON.stringify(newArr)
		};
		this.recordMouseDown(e, newState);

		this.setState(newState);
	}

	/* Cut off this line. Only for a given key and if canvas was last clicked
		Takes it directly from last draw of example line */
	onCanvasKeyDown (e) {
		if (this.getElemKey(this.state.mouseDownElem) !== 'CANVAS') { return; }
		if (this.state.example_line.length < 2) { return; }

		let newArr = [[], ...this.state.polygon_arr]; // add entry

console.log(this.refs['line end'].key_val);
/*
		if (e.keyCode === this.keyList['line end']) {
			// Copy entry from example line to end of latest segment
			newArr[1].push([...this.state.example_line[1]]);
		} else if (e.keyCode === this.keyList['line loop']){
			newArr[1].push([...this.state.example_line[1]]);
			newArr[1].push([...newArr[1][0]]);
		} else if (e.keyCode === this.keyList['line drop']) { 
		} else {
			return;
		}
*/			
		let newState = {
			polygon_arr: newArr,
			polygon_arr_text: JSON.stringify(newArr),
			example_line: [],
			example_line_text: 'no coords bro'
		};
		this.setState(newState);
	}

	/* record mouse down; if called with new state, append to it instead */
	recordMouseDown (e, newState) {
		if (!newState) {
			this.setState({ mouseDownElem: e.target });
		} else {
			newState.mouseDownElem = e.target;
		}
		console.log(e.target);
		console.log(e.target.className);
	}

	/* Draws example line with last point */
	onCanvasMouseMove (e) {
		if (this.state.polygon_arr.length < 1) { return; }
		let theArr = this.state.polygon_arr[0];
		if (theArr.length < 1) { return; }
		let newArr = [
			[...theArr[theArr.length - 1]], // copy last coord in line
			this.getCoords(e)
		];
		let newState = {
			example_line: newArr,
			example_line_text: JSON.stringify(newArr)
		};
		this.setState(newState);
	}

	/* Todo: something cool */
	onCanvasMouseOver (e) {}

	getElemKey (elem) { return elem.className || elem.tagName; }

	/* Looks for handler defined in mapping
		- Checks in order 
		  1. target element class name
		  2. target element tag name
	*/
	handler(e, map) {
		let mapKey = this.getElemKey(e.target);
		let fn = map[mapKey];
		return fn? fn.call(this, e): 
			map['default']? map['default'].call(this, e): null;
	}

	mouseOverHandler (e) { this.handler(e, {
			"CANVAS": this.onCanvasMouseOver
		});
	}

	mouseMoveHandler (e) { this.handler(e, {
			"CANVAS": this.onCanvasMouseMove
		});
	}

	mouseDownHandler (e) { this.handler(e, {
			"CANVAS": this.onCanvasMouseDown,
			"line-end-button": this.refs['line end'].buttonMouseDown,
			"line-loop-button": this.refs['line loop'].buttonMouseDown,
			"line-drop-button": this.refs['line drop'].buttonMouseDown,
			default: this.recordMouseDown
		});
	}

	touchDownHandler (e) { this.handler(e, {
			"CANVAS": this.onCanvasTouchDown 
		});
	}
	
	keyDownHandler (e) { this.handler(e, {
			default: this.onCanvasKeyDown 
		});
	}

	onCanvasTouchDown (e) {}

	render () {
		return (
		<div className="container" >
			<EventButton name="line drop" ref="line drop" />
			<EventButton name="line end" ref="line end" />
			<EventButton name="line loop" ref="line loop" />
		
			<div>
				<TheCanvas className="canvas"
					frameNum={this.props.frameNum}
					lineSegments={[...this.state.polygon_arr, this.state.example_line ]} />
				<TheCanvas className="canvas"
					frameNum={this.props.frameNum}
					lineSegments={[ this.state.example_line ]} />
			</div>
			<DisplayArray text={this.state.polygon_arr_text} line_label="all lines"/>
			<DisplayArray text={this.state.example_line_text} line_label="new line"/>
		</div>
		);
	}
}
