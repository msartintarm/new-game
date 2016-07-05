import LineSegmented from './LineSegmented';
import lineIntersection from './lineIntersection';

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

const join = (thingA, thingB) => {
    if (!thingA.knotPoint || !thingB.knotPoint) return;
    this.translate(thingA.knotPoint);
    _ropeList.push(this);
};

/*
    The Rope
    Joins two objects
    Can be severed with scissors
*/
class Rope {
    constructor(opts, thingA, thingB) {
        opts.translate = [ -682, -256 ];
        return (new LineSegmented(
            // two knots and a connector
            opts,
            [ ..._theKnot, ..._theKnot ],
            [[ 0,0 ]]
        )).join(thingA, thingB);
//        this.knot = new Knot();
    }

    join = join;

    /* Take snip event, if rope has been cut than create new object and init drop */
    checkSnip(lineSeg) {


        // I would just like to add, as an alternative/compliment to a
        // bounding box test, you could also test to see if the distance
        // between the median points of the lines are greater than half
        // of the combined length of the lines. If so, the lines can't
        // possibly intersect.

        if (lineIntersection(lineSeg[0], lineSeg[1])) {
            return false;
        }


    }

}

export default Rope;
