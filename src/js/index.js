import * as React from 'react';
import ReactDOM from 'react-dom';

import ZoomController from './ZoomController';
import Player from './Player';
import Stuff from './Stuff';
import GameController from './GameController';

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

		const props = {
			player: this.player,
			stuff: this.stuff,
			zoom: this.zoom
		};

		const game_canvas = this.showGame?
			<GameCanvas {...props} />: null;
		const draw_canvas = this.showDraw?
			<DrawCanvas {...props} />: null;
	    const game_controller = this.showGame?
			<GameController {...props} />: null;
		return (
<div>
	<div className="container">
		{game_canvas}
	</div>
	<div className="container">
		{draw_canvas}
	</div>
	<div className="container">
		{game_controller}
	</div>
</div>
		);
	}
}

ReactDOM.render(<App />, document.body.firstElementChild);
