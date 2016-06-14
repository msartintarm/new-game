import vec2 from 'gl-matrix/src/gl-matrix/vec2';

let ROOM_SIZE = 800; // can be made smaller
let MAP_SIZE = 6400; // max size of game map

/* 
	This is all internal to the
	add / lookup functions and could
	be changed

	The lookup function looks for the smallest
	matching box in the map.

	coord numbering system (outdated already):

 0 1 2 3 4 5 6 7   64  65   66   67
 8            17                      80      81
16            25   68  69   70   71
24            33
32            41   72  73   74   75
40            49                      82      83
48            57   76  77   78   79
56            65
 
*/

let coordMaps = [{
	boxSize: 800,
	0: {
		0: 1
	}
}, {
	boxSize: 1600,
	0: {
		0: 0.5
	}
}, {
	boxSize:3200, 
	0: {
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

		let realPos = vec2.sub(vec2.create(), pos, this.playerOffset);

		// lookup coord map
		let size = ROOM_SIZE;
		let zoomLev = null;
		let x, y, a, arr;
		for (let map of coordMaps) {
			x = Math.floor(realPos[0] / map.boxSize);
			y = Math.floor(realPos[1] / map.boxSize);
			zoomLev = (arr = map[x]) && arr[y] || null;
			if (zoomLev) { break; }
		}
		this.zoom = zoomLev || 1;
	}

	getZoom () { return this.zoom; }
}

export default ZoomController
