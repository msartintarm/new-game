import LineSegmented from './LineSegmented';
import lineIntersection from './lineIntersection';

let _theKnot = [
	[690,258,682,256,685,250,691,257,695,251,699,256,693,258]
];

let _ropeList = []; // used in cut event

class Knot {
    constructor(opts) {
    	this.ls = new LineSegmented(opts, _theKnot);
    	this.knotPoint = theFrame[6][2][1]; // highest point of the triangle
    }
    setToFrame(num) { return this.ls.setToFrame(num); }
    translate (vec) { return this.ls.translate(vec); }
    getLines () { return this.ls.getLines(); }
}

/* 
	The Rope 
	Joins two objects
	Can be severed with scissors
*/
class Rope { 
    constructor(opts, thingA, thingB) {
        this.ls = new LineSegmented(
        	opts,
        	[..._theKnot, ..._theKnot,
        	[[0,0]]
    	]); // two knots and a connector
    	this.ls.translate([-682, -256]);
        this.join(thingA, thingB);
    }

    setToFrame(num) { return this.ls.setToFrame(num); }
    translate (vec) { return this.ls.translate(vec); }
    getLines () { return this.ls.getLines(); }

    join(thingA, thingB) {
    	if (!thingA.knotPoint || !thingB.knotPoint) return;
    	this.translate(thingA.knotPoint);
    	_ropeList.push(this);
    }

    /* Take snip event, if rope has been cut than create new object and init drop */
    checkSnip(lineSeg) {
		

    	// I would just like to add, as an alternative/compliment to a 
    	// bounding box test, you could also test to see if the distance
    	// between the median points of the lines are greater than half 
    	// of the combined length of the lines. If so, the lines can't
    	// possibly intersect.

    	if (lineIntersection(lineSeg[0], lineSeg[1])) {
    		
    	}


    }

}

export default Rope
