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
	37: 'Left',
	38: 'Up',
	39: 'Right',
	40: 'Down'
};


/* Tells canvas what to draw */
class PolygonCanvas extends React.Component {

	constructor () {
		super();

		this.lineEndKey = KEYS.mRight;
		this.state = ({ 
			button_text: 'Set keycode',
			polygon_arr: [],
			polygon_arr_text: ''
		});
		// ES6 React auto bind alternatives:
		// http://egorsmirnov.me/2015/08/16/react-and-es6-part3.html
	
		this.keyDownHandler = this.keyDownHandler.bind(this);
		this.mouseDownHandler = this.mouseDownHandler.bind(this);
		this.touchDownHandler = this.touchDownHandler.bind(this);

		this.setLineEndKey = this.setLineEndKey.bind(this);

	}

	getKeycodeName (key) {
		return keyCodeMap[key] || String.fromCharCode(key).trim() || key;
	}

	/* Determine which polygon to print for this frame */
	paintFrame (frame) {
		var num = this.props.index;
		if (num)
		this.paintPolygon(frame[num]);
	}

	setLineEndKey (ev) {
		let theKey = ev.keyCode;
		let newText = 'Set to ' + this.getKeycodeName(theKey);
		console.log(newText);
		this.lineEndKey = theKey;
		this.setState({ button_text: newText });
		document.body.removeEventListener('keydown', this.setLineEndKey);
	}

	onButtonMouseDown (e) {
		this.setState({ button_text: 'next key down..' });
		document.body.addEventListener('keydown', this.setLineEndKey);
	}

	/*
		Keep calling the function to store points
		Call it with r button click to print points stored
		To be used as points generator to paste into data file
	*/
	onCanvasMouseDown (e) {
		let newState = {};
		newState.polygon_arr = [
			...this.state.polygon_arr, [
				event.pageX,
				event.pageY
		]];
		newState.polygon_arr_text = JSON.stringify(newState.polygon_arr);
		this.setState(newState);
	}

	handler(e, map) {
		var target = e.target;
		var mapKey = target.className || target.tagName;
		var fn = ret[map];
		return fn? fn(e): null;
	}

	mouseDownHandler (e) {
		var map = {
			"CANVAS": this.onCanvasMouseDown,
			"button": this.onButtonMouseDown
		};

		return handler(e, map)

		console.log("Mouse Down!");
		console.log(e.target);
		switch(e.target.className) {
			case "CANVAS":
				return this.onCanvasMouseDown(e);
			case "button":
				return this.onButtonMouseDown(e);
			default:
				break;
		}
	}

	touchDownHandler (e) {
		switch(e.target.className) {
			case "CANVAS":
				return this.onCanvasTouchDown(e);
			default:
				break;
		}
	}

	keyDownHandler (e) {
		switch(e.target.className) {
			case "":
				return this.onCanvasKeyDown(e);
			default:
				break;
		}
	}

	onCanvasTouchDown (e) {}

	render () {
		return (
		<div className="container"
			onMouseDown={this.mouseDownHandler}
			onTouchDown={this.touchDownHandler}
			onKeyDown={this.keyDownHandler}
		>
			<button className="button" >
				{this.state.button_text} 
			</button>
			<div >
				>
				<TheCanvas className="canvas"
					frameNum={this.props.frameNum}
					lineSegments={this.state.polygon_arr} />
			</div>
			<div className="polygon_arr_text">
				{this.state.polygon_arr_text}
			</div>
		</div>
		);
	}
}
