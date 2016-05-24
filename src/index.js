(function() {

var ctx;

var TheCanvas = React.createClass({ 

	componentDidMount: function() {
		ctx = this.refs.theCanvas.getContext('2d');
	},

	componentDidUpdate: function() {
		ctx.clearRect(0, 0, 200, 200);
		this.paint(ctx);
	},

	paint: function(context) {
		ctx.save();
		ctx.translate(100, 100);
		ctx.rotate(this.props.rotation, 100, 100);
		ctx.fillStyle = '#F00';
		ctx.fillRect(-50, -50, 100, 100);
		ctx.restore();
	},

	render: function() {

		return <div>
			<canvas ref="theCanvas" width={200} height={200} />
		</div>;

	}

});

var App = React.createClass({

	getInitialState: function() {
		return { rotation: 0 };
	},

	componentDidMount: function() {
		requestAnimationFrame(this.tick);
	},

	tick: function() {
		this.setState({ rotation: this.state.rotation + .01 });
		requestAnimationFrame(this.tick);
	},

	render: function() {
		return <div>
			<TheCanvas rotation={this.state.rotation} />
		</div>
	}

});

ReactDOM.render(<App />, document.body.firstElementChild);

})();
