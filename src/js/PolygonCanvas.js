import Component from './Component';
import EventButton from './EventButton';
import TheCanvas from './TheCanvas';

const player = {
	foot: {
		points: [
			[ [10, 20], [30, 20], [30, 30] ]
		]
	}
};

const KEYS = {
	mLeft: 79,
	mRight: 80
};

class DisplayArray extends Component {
	render () {
		return(
			<div className="display_array" >
				<b className="display_label">Coords for {this.props.line_label}</b>
				{this.props.text}
			</div>
		);
	}
}

/* Tells canvas what to draw */
class PolygonCanvas extends Component {

	constructor () {
		super();

		this.state = {
			polygon_arr: [[]],
			polygon_arr_text: 'no coords bro',
			example_line: [],
			example_line_text: 'no coords bro',
			mouseDownElem: this
		};

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
		this.recordMouseDown(e, newState);

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

	/* record mouse down; if called with new state, append to it instead */
	recordMouseDown (e, newState) {
		if (!newState) {
			this.setState({ mouseDownElem: e.target });
		} else {
			newState.mouseDownElem = e.target;
		}
		console.log(e.target);
		console.log(e.target.className);
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
		return (
		<div className="container" >
			<EventButton name="line drop" ref="line drop" />
			<EventButton name="line end" ref="line end" />
			<EventButton name="line loop" ref="line loop" />
		
			<div>
				<TheCanvas className="canvas"
					frameNum={this.props.frameNum}
					lineSegments={[...this.state.polygon_arr, this.state.example_line ]} />
				<TheCanvas className="canvas"
					frameNum={this.props.frameNum}
					lineSegments={[ this.state.example_line ]} />
			</div>
			<DisplayArray text={this.state.polygon_arr_text} line_label="all lines"/>
			<DisplayArray text={this.state.example_line_text} line_label="new line"/>
		</div>
		);
	}
}

export default PolygonCanvas;
