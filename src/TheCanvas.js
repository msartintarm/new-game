var c2;

var nullFn = function(){};

console.log("yo!");


/* Errors once for each key to avoid console pollution */

let consoleErrOnce = (() => {
	var theList = {};
	return (key, err) => {
		if (!theList[key]) {
			theList[key] = true;
			return console.err(key, err.stackTrace);
		}
	}
}());

/*
	Canvas class that binds passed-down line segments with DOM canvas

	Supports line segments and mouse / touch events as props

*/
class TheCanvas extends React.Component { 

	componentDidMount () {
		c2 = this.refs.theCanvas.getContext('2d');
	}

	componentDidUpdate () {
		this._paint();
	}

	_paintLineSegment (points) {
		if (!points || points.length < 2) {
			return consoleErrOnce('Tried to paint empty line seg bro');
		}
		c2.beginPath();
		c2.moveTo.apply(c2, points[0]);
		for (var i = 1; i < points.length; ++i) {
			c2.lineTo.apply(c2, points[i]);
		}
		c2.closePath();
		c2.stroke();
	}

	_paint () {

		c2.save();
		c2.clearRect(0, 0, 200, 200);

		c2.translate(100, 100);

		c2.save();
		c2.fillStyle = '#F00';
		c2.fillRect(-50, -50, 100, 100);
		c2.restore();

		for (var i in this.props.lineSegments) {
			c2.save();
			this._paintLineSegment(this.props.lineSegments[i]);
			c2.restore();
		}
		c2.restore();

	}

	_getCanvasProps () {
		return {
			ref: "theCanvas",
			onMouseDown: this.props.onMouseDown,
			onTouchDown: this.props.onTouchDown,
			width: 200,
			height: 200
		};
	}

	render () {
		<div>
			<canvas {...this._getCanvasProps} />
		</div>
	}
}

TheCanvas.defaultProps = {
	onMouseDown: nullFn,
	onTouchDown: nullFn,
	lineSegments: []
};
