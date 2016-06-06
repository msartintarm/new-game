import vec2 from 'gl-matrix';

import { registerHandler } from './EventHandler';

import Component from './Component';
import EventButton from './EventButton';
import TheCanvas from './TheCanvas';
import DisplayArray from './DisplayArray';

import Body from './Body';

/* return array from event with offset relative to target */
let getCoords = (e) => {
	let t = e.target;
	let x = e.pageX - t.offsetLeft;
	let y = e.pageY - t.offsetTop;
	return [x, y];
};

/* Tells canvas what to draw */
class DrawCanvas extends Component {

	constructor () {
		super();

		this.state = {
			polygon_arr: [[]],
			polygon_arr_text: 'no coords bro',
			example_line: [],
			example_line_text: 'no coords bro'
		};

		this.body = new Body();

		for(let argList of [
			["mousedown", "CANVAS", this.onCanvasMouseDown],
			["touchdown", "CANVAS", this.onCanvasTouchDown],
			["keydown", "default", this.onCanvasKeyDown],
			["mouseover", "CANVAS", this.onCanvasMouseOver],
			["mousemove", "CANVAS", this.onCanvasMouseMove]
		]) { registerHandler(...argList); }
	}

	/* Update polygon array with point from latest canvas click. */
	onCanvasMouseDown = (e) => { // ES2016 auto bind syntax
		let newArr = [...this.state.polygon_arr]; // make copy
		newArr[0].push(getCoords(e));
		let newState = {
			polygon_arr: newArr,
			polygon_arr_text: JSON.stringify(newArr)
		};
		this.setState(newState);
	}

	/* Cut off this line. Only for a given key and if canvas was last clicked
		Takes it directly from last draw of example line */
	onCanvasKeyDown = (e) => { // ES2016 auto bind syntax
		if (this.state.example_line.length < 2) { return; }

		let newArr = [[], ...this.state.polygon_arr]; // add entry

		var le = this.refs['line end'].key_val;
		var ll = this.refs['line loop'].key_val;
		var ld = this.refs['line drop'].key_val;

		if (e.keyCode === le) {
			// Copy entry from example line to end of latest segment
			newArr[1].push([...this.state.example_line[1]]);
		} else if (e.keyCode === ll){
			newArr[1].push([...this.state.example_line[1]]);
			newArr[1].push([...newArr[1][0]]);
		} else if (e.keyCode === ld) { 
		} else {
			return;
		}
			
		let newState = {
			polygon_arr: newArr,
			polygon_arr_text: JSON.stringify(newArr),
			example_line: [],
			example_line_text: 'no coords bro'
		};
		this.setState(newState);
	}

	/* Draws example line with last point */
	onCanvasMouseMove = (e) => { // ES2016 auto bind syntax
		if (this.state.polygon_arr.length < 1) { return; }
		let theArr = this.state.polygon_arr[0];
		if (theArr.length < 1) { return; }
		let newArr = [
			[...theArr[theArr.length - 1]], // copy last coord in line
			getCoords(e)
		];
		let newState = {
			example_line: newArr,
			example_line_text: JSON.stringify(newArr)
		};
		this.setState(newState);
	}

	/* Todo: something cool */
	onCanvasMouseOver = (e) => {}
	onCanvasTouchDown = (e) => {}

	render () {

		let polygon = this.state.polygon_arr,
			example = this.state.example_line,
			player = this.body.getLines();

		let arrayToDraw = [...polygon, example, ...player ];

		return (
		<div className="container" >
			<EventButton name="line drop" ref="line drop" />
			<EventButton name="line end" ref="line end" />
			<EventButton name="line loop" ref="line loop" />
			<div>
				Play!
				<textarea className="play_area"></textarea>
			</div>


			<div>
				<TheCanvas lineSegments={ player }/>
				<TheCanvas lineSegments={ arrayToDraw } />
			</div>
			<DisplayArray array={polygon} line_label="polygon"/>
			<DisplayArray array={example} line_label="new line"/>
			<DisplayArray array={player} line_label="the player!"/>
		</div>
		);
	}
}

export default DrawCanvas
