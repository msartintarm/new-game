import vec2 from 'gl-matrix/src/gl-matrix/vec2';

const ROOM_SIZE = 800; // can be made smaller

/*
	The lookup function looks for the smallest
	matching box in the map.
*/

const coordMaps = [{
	boxSize: ROOM_SIZE,
	0: {
		0: 1
	},
	2: {
		0: 1
	}
}, {
	boxSize: (ROOM_SIZE * 2),
	0: {
		0: 0.5
	},
	1: {
		0: 0.5
	}
}, {
	boxSize: (ROOM_SIZE * 4),
	"-1": {
		0: 0.25
	},
	0: {
		"-1": 0.25,
		0: 0.25
	}
}];

/*  Decides everything about the way the field
		should be presented
	Updates itself based on player position
	Smaller zoom boxes override large ones
*/
class ZoomController {

	/* Calculates box based on player position */
	constructor (initialPos) {
		this.playerOffset = [...initialPos];
		this.setZoom(initialPos);
	}

	setZoom (pos) {

///		let realPos = vec2.sub(vec2.create(), pos, this.playerOffset);
		const realPos = pos;

		// lookup coord map
		let zoomLev = null;
		let x, y, a, arr;
		for (const map of coordMaps) {
			a = map.boxSize;
			x = Math.floor(realPos[0] / a);
			y = Math.floor(realPos[1] / a);
			zoomLev = (arr = map[x]) && arr[y] || null;
			if (zoomLev) { break; }
		}
		this.zoom = zoomLev || 1;
		vec2.scale(this.playerOffset, [ x,y ], a);
	}

	getZoom () { return this.zoom; }
	getOffset () { return this.playerOffset; }
}

export default ZoomController
