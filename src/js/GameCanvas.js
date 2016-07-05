import Component from './Component';

import vec2 from 'gl-matrix/src/gl-matrix/vec2';

import { registerHandler } from './EventHandler';

import TheCanvas from './TheCanvas';
import Background from './Background';

const GAME_SIZE = 800;

/* Tells canvas what to draw */
class GameCanvas extends Component {

    constructor(props) {
        super(props);
        this.background = new Background({ size: GAME_SIZE });

        this.state = { show_game_canvas: false };
        registerHandler('mousedown', "play_focuser_big",
            this.focusOnPlayArea);
        registerHandler('mousedown', "play_focuser_small",
            this.focusOnPlayArea);
    }

    toggleGameCanvasOnMouseDown = () => {
        const newState = {
            show_game_canvas: (!this.state.show_game_canvas)
        };
        this.setState(newState);
    };

    focusOnPlayArea = (e) => {
        e.preventDefault();
        const newState = { show_game_canvas: (!this.state.show_game_canvas) };
        this.setState(newState, (
            newState.show_game_canvas?
            () => { this.refs.play_area.focus(); }: null
        ));
    };

    render () {

        this.props.zoom.setZoom(
            this.props.player.getPos()
        );

        const zoom = this.props.zoom.getZoom();
        const offset = this.props.zoom.getOffset();

        vec2.negate(offset, offset);
        vec2.scale(offset, offset, zoom);

        const containerAttrs = {
            className: "canvas_real_container",
            style: {
                width: GAME_SIZE + 4,
                height: GAME_SIZE + 4,
                position: "relative"
            }
        };
        const commonCanvasAttrs = {
            show_canvas: this.state.show_game_canvas,
            positionAbsolute: true,
            scale: zoom,
            size: GAME_SIZE,
            offset
        };
        const dynamicCanvasAttrs = {
            drawObjs: [this.props.player]
        };
        const staticCanvasAttrs = {
            drawObjs: [this.props.stuff],
            backgroundObj: this.background
        };
        const playFocuserAttrs = {
            className: (this.state.show_game_canvas?
                "play_focuser_small": "play_focuser_big"
        )};
        const playAreaAttrs = {
            className: "play_area", ref: "play_area"
        };

        return (
<div {...containerAttrs}>
    <TheCanvas {...commonCanvasAttrs} {...staticCanvasAttrs} />
    <TheCanvas {...commonCanvasAttrs} {...dynamicCanvasAttrs} />
    <div {...playFocuserAttrs}>
        <textarea {...playAreaAttrs}></textarea>
    </div>
</div>
        );
    }
}

export default GameCanvas;
