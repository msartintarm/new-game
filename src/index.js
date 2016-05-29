class App extends React.Component {

	componentDidMount () {
		requestAnimationFrame(this.tick);
	}

	tick () {
		this.setState({ frameNum: this.state.frameNum + 1 });
		requestAnimationFrame(this.tick);
	}

	render () {
		console.log("maINrENDER");
		return <div>
			<PolygonCanvas frameNum={this.state.frameNum} />
		</div>
	}
}


App.initialState = { frameNum: 0 };

(function() {

console.log("Index Start");

ReactDOM.render(<App />, document.body.firstElementChild);

console.log("Index Done");

})();
