import * as React from 'react';

import { registerHandler } from './EventHandler';

import EventButton from './EventButton';
import TheCanvas from './TheCanvas';
import DisplayArray from './DisplayArray';
import GameSettings from './GameSettings';

/* Tells canvas what to draw */
class DrawCanvas extends React.Component {

	constructor (props) {
		super(props);

		this.state = {
			status: 'hovering',
			polygon_arr: [],
			polygon_arr_text: 'no coords bro',
			example_line: [],
			example_line_text: 'no coords bro',
			polygon_arr_committed: 0,
			offset: [ 0,0 ],
			scale: 1
		};

		for(const argList of [
			[ "mousedown", TheCanvas.CLASS, this.onCanvasMouseDown ],
			[ "touchdown", TheCanvas.CLASS, this.onCanvasTouchDown ],
			[ "keydown", "default", this.onCanvasKeyDown ],
			[ "mouseover", TheCanvas.CLASS, this.onCanvasMouseOver ],
			[ "mousemove", TheCanvas.CLASS, this.onCanvasMouseMove ]
		]) { registerHandler(...argList); }
	}

	/* return array from event with offset relative to target */
	getCoords (e) {
		const t = e.target;
		const x = e.pageX - t.offsetLeft - this.state.offset[0];
		const y = e.pageY - t.offsetTop - this.state.offset[1];
		console.log(JSON.stringify([ x, y ]));
		return [ x, y ];
	}

	/* Update polygon array with point from latest canvas click. */
	onCanvasMouseDown = (e) => { // ES2016 auto bind syntax
		const newArr = [ ...this.state.polygon_arr, ...this.getCoords(e) ]; // make copy
		const newState = {
			status: 'new point added',
			polygon_arr: newArr,
			polygon_arr_text: JSON.stringify(newArr)
		};
		this.setState(newState);
	}
/*
	handleMove(keyCode) {

	}
*/
	/* Cut off this line. Only for a given key and if canvas was last clicked
		Takes it directly from last draw of example line */
	onCanvasKeyDown = (e) => {
		e.preventDefault();

		if (this.state.example_line.length < 2) { return; }

		const newArr = [...this.state.polygon_arr]; // add entry

		const le = this.refs['line end'].key_val;
		const ll = this.refs['line loop'].key_val;
		const ld = this.refs['line drop'].key_val;

		const offs = [...this.state.offset];

		if (e.keyCode === le) {
			// Copy entry from example line to end of latest segment
			newArr.push(this.state.example_line[2]);
			newArr.push(this.state.example_line[3]);
		} else if (e.keyCode === ll){
			newArr.push([...this.state.example_line[1]]);
			newArr.push([...newArr[1][0]]);
		} else if (e.keyCode === ld) {
			null;
		} else if (e.keyCode === 37) {
			offs[0] -= 800;
		} else if (e.keyCode === 38) {
			offs[1] -= 800;
		} else if (e.keyCode === 39) {
			offs[0] += 800;
		} else if (e.keyCode === 40) {
			offs[1] += 800;
		} else {
			return;
		}

		const newState = {
			polygon_arr: newArr,
			polygon_arr_text: JSON.stringify(newArr),
			example_line: [],
			example_line_text: 'no coords bro',
			polygon_arr_committed: newArr.length,
			offset: offs
		};
		this.setState(newState);
	}

	/* Draws example line with last point */
	onCanvasMouseMove = (e) => {
		const len = this.state.polygon_arr.length;
		if (len - this.state.polygon_arr_committed < 2) { return; }
		const newArr = [
			this.state.polygon_arr[len - 2], // copy last coord in line
			this.state.polygon_arr[len - 1], // copy last coord in line
			...this.getCoords(e)
		];
		const newState = {
			status: 'new line being drawn',
			example_line: newArr,
			example_line_text: JSON.stringify(newArr)
		};
		this.setState(newState);
	}

	increaseScale = () => { this.setState({ scale: this.state.scale * 1.25 }); };
	decreaseScale = () => { this.setState({ scale: this.state.scale * 0.8 }); };

	render () {

		const polygon = this.state.polygon_arr;
		const example = this.state.example_line;
		const player = this.props.player.getLines(),
			collisionLines = this.props.player.getCollisionLines(),
			stuff = this.props.stuff.getLines();

		const playerPos = this.props.player.getPos();

		const arrayToDraw = [
			polygon, example, ...player, ...stuff, ...collisionLines ];

		return (
			<div className="canvas_real_container"
				style={{backgroundColor: "red"}} >
				<TheCanvas
			size={3200}
			scale={this.state.scale}
					offset={ this.state.offset }
					lineSegments={ arrayToDraw } />
				<GameSettings scale={this.state.scale}
			increaseScale={this.increaseScale}
			decreaseScale={this.decreaseScale}
			status={this.state.status}
				>
				<EventButton
					name="line drop"
					ref="line drop" />
				<EventButton
					name="line end" ref="line end" />
				<EventButton
					name="line loop"
					ref="line loop" />
					<DisplayArray array={[playerPos]} line_label="Playuh"/>
					<DisplayArray array={polygon} line_label="polygon"/>
					<DisplayArray array={example} line_label="new line"/>
				</GameSettings>
			</div>
		);
	}
}

export default DrawCanvas;
