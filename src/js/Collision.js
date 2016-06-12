const NON_LINE_WARNING = "You need a 2d line to detect collisions. [1, 99, 3, 97]. Kapisch please.";

import lineIntersection from './LineSegmented/lineIntersection';

/*
	Contains lines and checks for collisions between them and env.
	Does this create a circular dependency?
	- Player -> CollisionLine -> Stuff -> Hook -> LineSegmented
	- DrawCanvas -> Stuff -> Hook -> LineSegmented
	The player could import Stuff directly I guess and it would still be okay.
*/
let detectCollision = (theLine, theSegs) => {

	if (theLine.length !== 4) { throw (NON_LINE_WARNING); }
	let lnAX = theLine[0];
	let lnAY = theLine[1];
	let lnBX = theLine[2];
	let lnBY = theLine[3];
	for (var line of theSegs) {
		if (line.length < 4) { break; } // no segs here
        let aX = line[0];
        let aY = line[1];
    	let bX, bY;
        for (let i = 2; i < line.length; i += 2) {
        	bX = line[i];
        	bY = line[i+1];
			if (lineIntersection(lnAX, lnAY, lnBX, lnBY, aX, aY, bX, bY)) {
				return true;
			}
			aX = bX; aY = bY;
        }
	}
	return false;
};

export default detectCollision
