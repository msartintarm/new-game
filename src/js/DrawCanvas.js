import vec2 from 'gl-matrix';

import Component from './Component';
import EventButton from './EventButton';
import TheCanvas from './TheCanvas';
import DisplayArray from './DisplayArray';

import Body from './Body';

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


		this.registerHandler("mousedown", "CANVAS", this.onCanvasMouseDown);
		this.registerHandler("touchdown", "CANVAS", this.onCanvasTouchDown);
		this.registerHandler("keydown", "default", this.onCanvasKeyDown);
		this.registerHandler("mouseover", "CANVAS", this.onCanvasMouseOver);
		this.registerHandler("mousemove", "CANVAS", this.onCanvasMouseMove);
	}

	/* Determine which polygon to print for this frame */
	paintFrame (frame) {
		var num = this.props.index;
		if (num)
		this.paintPolygon(frame[num]);
	}

	/* return array from event with offset relative to target */
	getCoords(e) {
		let t = e.target;
		let x = e.pageX - t.offsetLeft;
		let y = e.pageY - t.offsetTop;
		return [x, y];
	}

	/* Update polygon array with point from latest canvas click. */
	onCanvasMouseDown (e) {
		let newArr = [...this.state.polygon_arr]; // make copy
		newArr[0].push(this.getCoords(e));
		let newState = {
			polygon_arr: newArr,
			polygon_arr_text: JSON.stringify(newArr)
		};
		this.setState(newState);
	}

	/* Cut off this line. Only for a given key and if canvas was last clicked
		Takes it directly from last draw of example line */
	onCanvasKeyDown (e) {
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
	onCanvasMouseMove (e) {
		if (this.state.polygon_arr.length < 1) { return; }
		let theArr = this.state.polygon_arr[0];
		if (theArr.length < 1) { return; }
		let newArr = [
			[...theArr[theArr.length - 1]], // copy last coord in line
			this.getCoords(e)
		];
		let newState = {
			example_line: newArr,
			example_line_text: JSON.stringify(newArr)
		};
		this.setState(newState);
	}

	/* Todo: something cool */
	onCanvasMouseOver (e) {}
	onCanvasTouchDown (e) {}

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
				<TheCanvas className="canvas" lineSegments={ player }/>
				<TheCanvas className="canvas" lineSegments={ arrayToDraw } />
			</div>
			<DisplayArray array={polygon} line_label="polygon"/>
			<DisplayArray array={example} line_label="new line"/>
			<DisplayArray array={player} line_label="the player!"/>
		</div>
		);
	}
}

export default DrawCanvas;
