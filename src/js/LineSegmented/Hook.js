import LineSegmented from './LineSegmented';

var theHook = [
	[692,12,687,13,683,9,692,6,700,6,706,9,701,12,698,13],
	[693,9,693,24,684,24,678,32,685,41,703,41,
		708,33,708,33,709,33,702,33,700,37,688,37,
		683,32,688,27,698,27,698,9,697,10,697,10]
	];

/* The Hook. Converted to using composition*/
class Hook {
    constructor(opts) {
    	this.ls = new LineSegmented(opts, theHook);
    	this.knotPoint = [694, 37]; // lowest point of the hook

    }

    setToFrame(num) { return this.ls.setToFrame(num); }

    translate (vec) {
    	return this.ls.translate(vec);
    }

    getLines () {
        return this.ls.getLines();
    }
} 

export default Hook
