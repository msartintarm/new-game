import vec2 from 'gl-matrix/src/gl-matrix/vec2';

import { registerHandler } from './EventHandler';

import TheCanvas from './TheCanvas';

/* Tells canvas what to draw */
class GameCanvas extends React.Component {

	constructor (props) {
		super(props);

	}

	render () {

		this.props.zoom.setZoom(
			this.props.player.getPos()
		);

		let zoom = this.props.zoom.getZoom();
		let offset = this.props.zoom.getOffset();

		vec2.negate(offset, offset);
		vec2.scale(offset, offset, zoom);

		let drawObjs = [this.props.stuff, this.props.player];

		return (
			<div className="canvas_real_container">
				<TheCanvas scale={zoom}
					offset={ offset }
					drawObjs={ drawObjs } />
				<div> Play!
					<textarea className="play_area"></textarea>
				</div>
			</div>
		);
	}
}

export default GameCanvas
