const player = {
	foot: {
		points: [
			[ [10, 20], [30, 20], [30, 30] ]
//			[ [12, 22], [32, 22], [32, 32] ]
		]
	}, example: {
		points: []
	}
};

/* Tells canvas what to draw */
class Player extends React.Component {

	onMouseDown (e) {
		this.genPolygonString(e, this.refs.theCanvas);
	}

	onTouchDown (e) {}


	render () {
		return
			<div>
			<TheCanvas
				lineSegments={player.points}
				frameNum={this.state.frameNum}/>
		</div>
	}
}
