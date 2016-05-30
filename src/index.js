/*
class PolygonCanvas extends React.Component {

	lineEndKey: KEYS.mRight
} 
*/
class App extends React.Component {

	constructor () {
		super();
		this.state = { frameNum: 0 };
	}

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

(() => {

console.log("Index Start");

ReactDOM.render(<App />, document.body.firstElementChild);

console.log("Index Done");

}) ();
