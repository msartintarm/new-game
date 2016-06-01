var c2;

const nullFn = function(){};

const SIZE = 200;

/* Errors once for each key to avoid console pollution */

let consoleErrOnce = (() => {
	let theList = {};
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

	/*
		points format: array of arrays
		[[0,1], [1,2],[2,3]]
	*/
	_paintLineSegment (points) {
		if (!points || points.length < 2 || points[0].length < 2) {
			return;
		}
		c2.beginPath();
		c2.moveTo.apply(c2, points[0]);
		for (var i = 1; i < points.length; ++i) {
			c2.lineTo.apply(c2, points[i]);
		}
		c2.stroke();
	}

	_paint () {

		c2.clearRect(0, 0, SIZE, SIZE);
		c2.fillStyle = '#F00';

		let s_2 = SIZE / 2;
		c2.save();
		c2.fillRect(0, 0, SIZE, SIZE);
		c2.restore();

/*
		if (this.props.lineSegments.length > 0) {
			c2.save();
			this._paintLineSegment(this.props.lineSegments);
			c2.restore();
		}
		*/
		for (let i = 0; i < this.props.lineSegments.length; ++i) {
			c2.save();
			this._paintLineSegment(this.props.lineSegments[i]);
			c2.restore();
		}

	}

	_getCanvasProps () {
		return {
			ref: "theCanvas",
			width: SIZE,
			height: SIZE
		};
	}

	render () {
		return (
			<div>
				<canvas {...this._getCanvasProps()} />
			</div>
		);
	}
}

TheCanvas.defaultProps = {
	// format array of array of 2D array: 
	// [ [[10, 20], [20, 30], [30, 40]], [[10, 30], [20, 30]] ]
	lineSegments: [],
	// format: array of 2D array (same as lineSegments[0])
	// [[10, 20], [20, 30], [30, 40]]
	lineSegment: []
};
