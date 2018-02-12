// @flow
import LineSegmented from './LineSegmented';
import type {Options} from './Types';
//import lineIntersection from './lineIntersection';

type Knot = {
	knotPoint: number[]
};

const _theKnot = [
    [ 690,258,682,256,685,250,691,257,695,251,699,256,693,258 ]
];

const _ropeList = []; // used in cut event

/*
class Knot {
    constructor(opts) {
        opts.knotPoint = theFrame[6][2][1]; // highest point of the triangle
        return new LineSegmented(opts, _theHook);
    }
}
*/

const join = (Segment: LineSegmented, thingA: Knot, thingB: Knot): LineSegmented => {
    if (!thingA.knotPoint || !thingB.knotPoint) {
		throw "what are you doing brah this knot is invalid";
	}
    Segment.translate(thingA.knotPoint);
    _ropeList.push(Segment);
	return Segment;
};

/* Take snip event, if rope has been cut than create new object and init drop */
//const checkSnip = (lineSeg: Segment) => {


    // I would just like to add, as an alternative/compliment to a
    // bounding box test, you could also test to see if the distance
    // between the median points of the lines are greater than half
    // of the combined length of the lines. If so, the lines can't
    // possibly intersect.

//    if (lineIntersection(lineSeg[0], lineSeg[1], 3, 4, 5, 6, 7, 8)) {
//        return false;
//    }


//};


/*
    The Rope
    Joins two objects
    Can be severed with scissors
*/
class Rope {
    static create(opts: Options, thingA: Knot, thingB: Knot): LineSegmented {
        opts.translate = [ -682, -256 ];
        return join((new LineSegmented(
            // two knots and a connector
            opts,
            [ ..._theKnot, ..._theKnot ],
            [[ 0,0 ]]
        )), thingA, thingB);
//        this.knot = new Knot();
    }
}

export default Rope;
