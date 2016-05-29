console.log("Index Start");
(function() {

console.log("Index Start");
var c2;

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
console.log("Index Start");

ReactDOM.render(<App />, document.body.firstElementChild);

console.log("Index Done");

})();
