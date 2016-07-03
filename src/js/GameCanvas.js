import vec2 from 'gl-matrix/src/gl-matrix/vec2';

import { registerHandler } from './EventHandler';

import TheCanvas from './TheCanvas';
import Background from './Background';

const GAME_SIZE = 800;

let canvasNum = 0;


/* Tells canvas what to draw */
class GameCanvas extends React.Component {

	constructor(props) {
		super(props);
		this.background = new Background({ size: GAME_SIZE });

		this.state = { show_game_canvas: false };
        this.button_classname = "zzz toggle_canvas" + canvasNum;
        canvasNum += 1;
        registerHandler('mousedown', this.button_classname,
            this.toggleGameCanvasOnMouseDown);
        registerHandler('mousedown', "play_focuser_big",
            this.focusOnPlayArea);
        registerHandler('mousedown', "play_focuser_small",
            this.focusOnPlayArea);
	};

    toggleGameCanvasOnMouseDown = (e) => {
	    let newState = {
	    	show_game_canvas: (!this.state.show_game_canvas)
	    };
        this.setState(newState);
    };

    focusOnPlayArea = (e) => {
    	e.preventDefault();
	    let newState = { show_game_canvas: true };
        this.setState(newState, () => { this.refs.play_area.focus(); });
    };

	render () {

		this.props.zoom.setZoom(
			this.props.player.getPos()
		);

		let zoom = this.props.zoom.getZoom();
		let offset = this.props.zoom.getOffset();

		vec2.negate(offset, offset);
		vec2.scale(offset, offset, zoom);

		let containerAttrs = {
			className: "canvas_real_container",
			width: (GAME_SIZE + 100),
			height: (GAME_SIZE + 100)  };
		let commonCanvasAttrs = {
			show_canvas: this.state.show_game_canvas,
			positionAbsolute: true,
			scale: zoom,
			size: GAME_SIZE,
			offset: offset  };
		let dynamicCanvasAttrs = {
				drawObjs: [ this.props.player ]  };
		let staticCanvasAttrs = {
				drawObjs: [ this.props.stuff ],
				backgroundObj: this.background };

		let playFocuserAttrs = {
			className: (this.state.show_game_canvas?
				"play_focuser_small": "play_focuser_big"
		)};
		let playAreaAttrs = {
			className: "play_area", ref: "play_area"
		};

		return (<div {...containerAttrs}>
	<TheCanvas {...commonCanvasAttrs} {...staticCanvasAttrs} />
	<TheCanvas {...commonCanvasAttrs} {...dynamicCanvasAttrs} />
	<div {...playFocuserAttrs}>
		Play!
		<textarea {...playAreaAttrs}></textarea>
	</div>
    <div className={this.button_classname}>
    	Toggle Canvas!
	</div>
</div>
		);
	}
}

export default GameCanvas
