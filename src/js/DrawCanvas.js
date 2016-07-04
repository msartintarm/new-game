import vec2 from 'gl-matrix/src/gl-matrix/vec2';

import { registerHandler } from './EventHandler';

import EventButton from './EventButton';
import TheCanvas from './TheCanvas';
import DisplayArray from './DisplayArray';


/* return array from event with offset relative to target */
let getCoords = (e) => {
	let t = e.target;
	let x = e.pageX - t.offsetLeft;
	let y = e.pageY - t.offsetTop;
	return [x, y];
};

/* Tells canvas what to draw */
class DrawCanvas extends React.Component {

	constructor (props) {
		super(props);

		this.state = {
			polygon_arr: [],
			polygon_arr_text: 'no coords bro',
			example_line: [],
			example_line_text: 'no coords bro',
			polygon_arr_committed: 0

		};

		for(let argList of [
			["mousedown", TheCanvas.CLASS, this.onCanvasMouseDown],
			["touchdown", TheCanvas.CLASS, this.onCanvasTouchDown],
			["keydown", "default", this.onCanvasKeyDown],
			["mouseover", TheCanvas.CLASS, this.onCanvasMouseOver],
			["mousemove", TheCanvas.CLASS, this.onCanvasMouseMove]
		]) { registerHandler(...argList); }
	}

	/* Update polygon array with point from latest canvas click. */
	onCanvasMouseDown = (e) => { // ES2016 auto bind syntax
		let newArr = [...this.state.polygon_arr, ...getCoords(e)]; // make copy
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

		let newArr = [...this.state.polygon_arr]; // add entry

		var le = this.refs['line end'].key_val;
		var ll = this.refs['line loop'].key_val;
		var ld = this.refs['line drop'].key_val;

		if (e.keyCode === le) {
			// Copy entry from example line to end of latest segment
			newArr.push(this.state.example_line[2]);
			newArr.push(this.state.example_line[3]);
		} else if (e.keyCode === ll){
			newArr.push([...this.state.example_line[1]]);
			newArr.push([...newArr[1][0]]);
		} else if (e.keyCode === ld) { 
		} else {
			return;
		}
			
		let newState = {
			polygon_arr: newArr,
			polygon_arr_text: JSON.stringify(newArr),
			example_line: [],
			example_line_text: 'no coords bro',
			polygon_arr_committed: newArr.length
		};
		this.setState(newState);
	}

	/* Draws example line with last point */
	onCanvasMouseMove = (e) => { // ES2016 auto bind syntax
		let len = this.state.polygon_arr.length;
		if (len - this.state.polygon_arr_committed < 2) { return; }
		let newArr = [
			this.state.polygon_arr[len - 2], // copy last coord in line
			this.state.polygon_arr[len - 1], // copy last coord in line
			...getCoords(e)
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
			player = this.props.player.getLines(),
			collisionLines = this.props.player.getCollisionLines(),
			stuff = this.props.stuff.getLines();

		let playerPos = this.props.player.getPos();

		let arrayToDraw = [ polygon, example, 
			...player, ...stuff, ...collisionLines];



		return (
			<div className="canvas_real_container" style={{backgroundColor: "red"}} >
				<TheCanvas size={ 150 }
					lineSegments={ [ example ] } />
				<TheCanvas size={3200} lineSegments={ arrayToDraw } />
				<EventButton name="line drop" ref="line drop" />
				<EventButton name="line end" ref="line end" />
				<EventButton name="line loop" ref="line loop" />
				<div>
					<DisplayArray array={[playerPos]} line_label="Playuh"/>
					<DisplayArray array={polygon} line_label="polygon"/>
					<DisplayArray array={example} line_label="new line"/>
				</div>
			</div>
		);
	}
}

export default DrawCanvas
