import lineIntersection from './LineSegmented/lineIntersection';

import Stuff from './Stuff';

/*
	Contains lines and checks for collisions between them and env.
	Does this create a circular dependency?
	- Player -> CollisionLine -> Stuff -> Hook -> LineSegmented
	- DrawCanvas -> Stuff -> Hook -> LineSegmented
	The player could import Stuff directly I guess and it would still be okay.
*/
class CollisionLine {

	constructor(points) {
		this.line = vec2.fromValues(points);
	}


	detectCollision() {
		for (var line of Stuff.getFloorLines()) {
			if (lineIntersection(
				this.line[0], this.line[1], line[0], line[1]
			)) {
				return true;
			}
		}
		return false;
	}

}

export default CollisionLine
