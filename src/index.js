(function() {

var c2;

const player = {
	foot: {
		points: [
			[ [10, 20], [30, 20], [30, 30] ]
//			[ [12, 22], [32, 22], [32, 32] ]
		]
	}, example: {
		points: []
	}
};

var nullFn = function(){};

var TheCanvas = React.createClass({ 

	getDefaultProps: function() {
		return {
			onMouseDown: nullFn,
			onTouchDown: nullFn
		}
	},

	componentDidMount: function() {
		c2 = this.refs.theCanvas.getContext('2d');
	},

	componentDidUpdate: function() {
		c2.clearRect(0, 0, 200, 200);
		this.paint(c2);
	},

	/*
		Keep calling the function to store points
		Call it with r button click to print points stored
		To be used as points generator to paste into data file
	*/
	genPolygonString: function(event, srcElem) {
		if (event.button !== 0) {
			console.log(JSON.stringify(this.polygonArr));
			this.polygonArr = [];
		} else {
			if (!this.polygonArr) this.polygonArr = [];
			this.polygonArr.push([
				srcElem.offsetWidth - event.pageX,
				srcElem.offsetHeight -event.pageY
			]);
			player.example.points = this.polygonArr;
		}
	},

	paintPolygon: function(points) {
		console.log(points);
		if (!points || points.length < 2) { return; }
		c2.beginPath();
		c2.moveTo.apply(c2, points[0]);
		for (var i = 1; i < points.length; ++i) {
			c2.lineTo.apply(c2, points[i]);
		}
		c2.closePath();
		c2.stroke();
	},

	/* Determine which polygon to print for this frame */
	paintFrame: function(frame) {
		var num = Math.round(this.props.frameNum / 30) % frame.length;
		this.paintPolygon(frame[num]);
	},

	paint: function(context) {

		c2.save();

		c2.translate(100, 100);

		c2.save();
		c2.fillStyle = '#F00';
		c2.fillRect(-50, -50, 100, 100);
		c2.restore();

		for (var i in player) {
			c2.save();
			this.paintFrame(player[i].points);
			c2.restore();
		}
		c2.restore();

	},

	_getCanvasProps: function() {
		return {
			ref: "theCanvas",
			onMouseDown: this.props.onMouseDown,
			onTouchDown: this.props.onTouchDown,
			width: 200,
			height: 200
		};
	},

	render: function() {
		return <div>
			<canvas {...this._getCanvasProps} />
		</div>;
	}

});

/* Tells canvas what to draw */
var PolygonCanvas = React.createClass({

	onMouseDown: function(e) {
		this.genPolygonString(e, this.refs.theCanvas);
	},

	onTouchDown: function(e) {},


	render: function() {
		return
			<div>
			<TheCanvas
				lines=
				frameNum={this.state.frameNum}/>
		</div>
	}
});

var App = React.createClass({

	getInitialState: function() {
		return { frameNum: 0 };
	},

	componentDidMount: function() {
		requestAnimationFrame(this.tick);
	},

	tick: function() {
		this.setState({ frameNum: this.state.frameNum + 1 });
		requestAnimationFrame(this.tick);
	},

	render: function() {
		return <div>
			<TheCanvas frameNum={this.state.frameNum} />
		</div>
	}

});

ReactDOM.render(<App />, document.body.firstElementChild);

})();
