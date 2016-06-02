import Component from './Component';
import PolygonCanvas from './PolygonCanvas';

class App extends Component {

	constructor () {
		super();
		this.state = { frameNum: 0 };
		this.tick = this.tick.bind(this);
	}

	tick () {
		this.setState({ frameNum: this.state.frameNum + 1 });
		requestAnimationFrame(this.tick);
	}

	componentDidMount () {
		requestAnimationFrame(this.tick);
	}

	render () {
		return (
			<div>
				<PolygonCanvas frameNum={this.state.frameNum} />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.body.firstElementChild);
