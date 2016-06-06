import Component from './Component';
import DrawCanvas from './DrawCanvas';
import { onTick } from './EventHandler';

class App extends Component {

	constructor () {
		super();
		this.state = { frameNum: 0 };
	}

	tick = () => {
		this.setState({ frameNum: this.state.frameNum + 1 });
		requestAnimationFrame(this.tick);
		onTick();
	};

	componentDidMount () {
		requestAnimationFrame(this.tick);
	}

	render () {
		return (
			<div>
				<DrawCanvas frameNum={this.state.frameNum} />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.body.firstElementChild);
