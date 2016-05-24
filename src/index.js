(function() {

document.onContextMenu = function() { return false; };

var c2;

var player = {
	foot: {
		points: [
			[ [10, 20], [30, 20], [30, 30] ]
//			[ [12, 22], [32, 22], [32, 32] ]
		]
	}
};

var TheCanvas = React.createClass({ 

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
				console.log(event.pageX, srcElem.clientWidth,event.pageY, srcElem.clientHeight);
			this.polygonArr.push([
				event.pageX - srcElem.offsetWidth,
				event.pageY - srcElem.offsetHeight
			]);
		}
	},

	paintPolygon: function(points) {
		if (!points) { return; }
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
		c2.fillStyle = '#F00';
		c2.fillRect(-50, -50, 100, 100);
		c2.restore();

		for (var i in player) {
			c2.save();
			this.paintFrame(player[i].points);
			c2.restore();
		}

	},

	onMouseDown: function(e) {
		this.genPolygonString(e, this.refs.theCanvas);
	},

	onTouchDown: function(e) {

	},

	render: function() {
		return <div>
			<canvas 
				ref="theCanvas"
				onMouseDown={this.onMouseDown}
				onTouchDown={this.onTouchDown}
				width={200}
				height={200} />
		</div>;

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
