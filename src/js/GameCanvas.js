import * as React from 'react';

import vec2 from 'gl-matrix/src/gl-matrix/vec2';

import { registerHandler } from './EventHandler';

import TheCanvas from './TheCanvas';
import Background from './Background';

const GAME_SIZE = 800;

const cMD = "mousedown";
const cPFB = "play_focuser_big";
const cPFS = "play_focuser_small";
const cPA = "play_area";

const CANVAS_CONTAINER_CLASS = "canvas_real_container";

/* Tells canvas what to draw */
class GameCanvas extends React.Component {

    constructor(props) {
        super(props);
        this.background = new Background({ size: GAME_SIZE });

        this.state = { show_game_canvas: false };
        registerHandler(cMD, cPFB, this.focusOnPlayArea);
        registerHandler(cMD, cPFS, this.focusOnPlayArea);
	registerHandler("mouseup", CANVAS_CONTAINER_CLASS, this.preventDefocus);
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
		() => {
		    this.refs.play_area.focus();
 //		    registerHandler(cMD, CANVAS_CONTAINER_CLASS, this.preventDefocus);
		    console.log("Registered.");
		}: null
        ));
    };

    /** Block page level elements from removing focus on the textbox */
    preventDefocus = (e) => {
	console.log("Hey there you're preventing defocus");
	e.preventDefault();
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
            className: CANVAS_CONTAINER_CLASS,
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
                cPFS: cPFB
        )};
        const playAreaAttrs = {
            className: cPA, ref: cPA
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
