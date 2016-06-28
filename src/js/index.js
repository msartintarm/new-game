import ZoomController from './ZoomController';
import Player from './Player';
import Stuff from './Stuff';

import DrawCanvas from './DrawCanvas';
import GameCanvas from './GameCanvas';
import { onTick } from './EventHandler';

class App extends React.Component {

	constructor () {
		super();
		this.state = { frameNum: 0 };

		this.stuff = new Stuff();
		this.player = new Player(
			this.stuff.getCollisionLines
		);
		this.zoom = new ZoomController(this.player.getPos());


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

		let props = {
			player: this.player,
			stuff: this.stuff,
			zoom: this.zoom,
			frameNum: this.state.frameNum // change on tick
		};		

		return (
			<div className="container">
				<GameCanvas {...props} />
				<DrawCanvas {...props} />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.body.firstElementChild);
