import * as React from 'react';

import { registerHandler } from './EventHandler';

/* Tells canvas what to draw */
class GameController extends React.Component {

	static BUTTONS_CONTAINER = "bc";
    static LEFT_BUTTON = "lb";
    static RIGHT_BUTTON = "rb";
    static JUMP_BUTTON = "jb";

 	static CONTAINER_STYLE = {
		position: "relative",
		width: "100%",
		textAlign: "center",
		height: "300px",
		userSelect: "none"
	};

	static LEFT_BUTTON_STYLE = {
		position: "absolute",
		top: "0px",
		left: "0px",
		height: "100%",
		width: "30%",
		backgroundColor: "rgb(3,22,5)"
	};

	static RIGHT_BUTTON_STYLE = {
		position: "absolute",
		top: "0px",
		right: "0px",
		height: "100%",
		width: "30%",
		backgroundColor: "rgb(4,3,35)"
	};

	static JUMP_BUTTON_STYLE = {
		height: "100%",
		width: "40%",
		backgroundColor: "rgb(24,2,3)"
	};

	constructor (props) {
		super(props);

 		this.state = {
			left_button_pressed: false,
			right_button_pressed: false,
			jump_button_pressed: false
		};

		for(const argList of [
 			[ "mousedown", GameController.LEFT_BUTTON, this.onLeftButtonMouseDown ],
			[ "mousedown", GameController.RIGHT_BUTTON, this.onRightButtonMouseDown ],
			[ "mousedown", GameController.JUMP_BUTTON, this.onJumpButtonMouseDown ],

            [ "mouseup", GameController.LEFT_BUTTON, this.endPlayerMove ],
			[ "mouseup", GameController.RIGHT_BUTTON, this.endPlayerMove ],

			[ "touchstart", GameController.LEFT_BUTTON, this.onLeftButtonMouseDown ],
			[ "touchstart", GameController.RIGHT_BUTTON, this.onRightButtonMouseDown ],
			[ "touchstart", GameController.JUMP_BUTTON, this.onJumpButtonMouseDown ],

			[ "touchend", GameController.BUTTONS_CONTAINER, this.preventTouchMouseEvents ],

			[ "mousemove", GameController.LEFT_BUTTON, this.onButtonMouseMove ],
			[ "mousemove", GameController.RIGHT_BUTTON, this.onButtonMouseMove ],
			[ "mousemove", GameController.JUMP_BUTTON, this.onButtonMouseMove ]
		]) { registerHandler(...argList); }
	}

	/* Control the player's moves. */
	onLeftButtonMouseDown = () => {
		this.props.player.startMoveLeft();
		this.setState({ left_button_pressed: true });
	};

	onRightButtonMouseDown = () => {
		this.props.player.startMoveRight();
		this.setState({ right_button_pressed: true });
	};

	onJumpButtonMouseDown = () => {
		this.props.player.startJump();
		this.setState({ jump_button_pressed: true });
	};

    /* Control the player's moves. */
	endPlayerMove = () => {
		this.props.player.startMoveEnd();
	};

	preventTouchMouseEvents = (e) => {
		e.preventDefault();
		this.props.player.startMoveEnd();
	};

	/* Draws example line with last point */
	onButtonMouseMove = (e) => { return e; }

	/* Todo: something cool */
	onButtonMouseOver = (e) => { return e; }
	onButtonTouchDown = (e) => { return e; }

	render () {

		return (
	<div className={GameController.BUTTONS_CONTAINER}
		style={GameController.CONTAINER_STYLE}>
	<div className={GameController.JUMP_BUTTON}
		style={GameController.JUMP_BUTTON_STYLE}>
		Jump!
	</div>
	<div className={GameController.LEFT_BUTTON}
		style={GameController.LEFT_BUTTON_STYLE}>
		Left!
	</div>
	<div className={GameController.RIGHT_BUTTON}
		style={GameController.RIGHT_BUTTON_STYLE}>
		Right!
	</div>
</div>
		);
	}
}

export default GameController;
