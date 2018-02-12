// @flow
import vec2 from 'gl-matrix/src/gl-matrix/vec2';

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

type State = {
	frameNum: number;
};

class App extends React.Component<{}, State> {

	stuff: Stuff;
	player: Player;
	zoom: ZoomController;
	showGame: boolean;
	showDraw: boolean;

    constructor () {
        super();
        this.state = { frameNum: 0 };

		const hook_offset = vec2.fromValues( -582, 202 );
		const weight_offset = vec2.fromValues(597, 227);
		vec2.add(weight_offset, weight_offset, hook_offset);
        this.stuff = new Stuff({
			hooks: [
				hook_offset
			],
			weights: [
				weight_offset
			],
			floors: [
				[]
			]
		});

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

const body = document.body;
const theElement = body && body.firstElementChild;
if (theElement instanceof Element) {
	ReactDOM.render(<App />, theElement);
}
