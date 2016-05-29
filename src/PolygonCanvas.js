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

/* Tells canvas what to draw */
class PolygonCanvas extends React.Component {

	lineEndKey: KEYS.mRight

	/* Determine which polygon to print for this frame */
	paintFrame (frame) {
		var num = this.props.index;
		if (num)
		this.paintPolygon(frame[num]);
	}

	/*
		Keep calling the function to store points
		Call it with r button click to print points stored
		To be used as points generator to paste into data file
	*/
	_genPolygonString (event, srcElem) {
		if (event.button !== 0) {
			console.log(JSON.stringify(this.polygonArr));
			this.polygonArr = [];
		} else {
			if (!this.polygonArr) this.polygonArr = [];
			this.polygonArr.push([
				srcElem.offsetWidth - event.pageX,
				srcElem.offsetHeight -event.pageY
			]);
		}
	}

	setLineEndKey (theKey) {
		this.lineEndKey = e.keyCode;
		document.body.removeEventListener
	}

	addSetLineEndKeyFn (e) {
		let theSetFn = this.setLineEndKey;
		let oneClickFn = (e) => {
			if (e.keyCode !== KEYS.mLeft) {
				theSetFn(e.keyCode);
			}
		};
		console.log("document.body.addEvent");
	}

	onButtonMouseDown (e) {
		if (e.keyCode === KEYS.mLeft) {

		}
	}

	onCanvasMouseDown (e) {
		this.genPolygonString(e, this.refs.theCanvas);
	}

	onCanvasTouchDown (e) {}

	render () {
		<div>
			<input 
				type="button"
				onMouseDown={this.changeLineEndKey} />
			<TheCanvas
				onMouseDown={this.onCanvasMouseDown}
				onTouchDown={this.onCanvasTouchDown}
				lineSegments={player.points} />
		</div>
	}
}
		console.log("PoplyonoinCanvas");
