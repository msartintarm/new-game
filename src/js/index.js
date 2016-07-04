import ZoomController from './ZoomController';
import Player from './Player';
import Stuff from './Stuff';

import DrawCanvas from './DrawCanvas';
import GameCanvas from './GameCanvas';
import { onTick } from './EventHandler';

const drawHash = window.location.hash.includes("draw");

class App extends React.Component {

	constructor () {
		super();
		this.state = { frameNum: 0 };

		this.stuff = new Stuff();
		this.player = new Player(
			this.stuff.getCollisionLines
		);
		this.zoom = new ZoomController(this.player.getPos());

		this.showGame = !drawHash;
		this.showDraw = drawHash;
	}

	tick = () => {
		requestAnimationFrame(this.tick);
		this.setState({ frameNum: this.state.frameNum + 1 }, onTick);
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

		let hideProp = { style: { display: "none" } };
		let gameHideProp = this.showGame? null: hideProp;
		let drawHideProp = this.showDraw? null: hideProp;

		return (
<div>
	<div className="container" {...gameHideProp}>
		<GameCanvas {...props} />
	</div>
	<div className="container" {...drawHideProp}>
		<DrawCanvas {...props} />
	</div>
</div>
		);
	}
}

ReactDOM.render(<App />, document.body.firstElementChild);
