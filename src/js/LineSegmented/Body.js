import LineSegmented from './LineSegmented';
import FootSegment from './Foot';
import Hand from './Hand';






class Body {
	constructor() {

	    this.face = new LineSegmented({}, [
	        [115,105,106,104,102,89,102,71,105,74,115,75],
	        [113,88,106,88],
	        [110,63,107,60,107,56,109,51,111,54,111,60,110,63] // eyeball
	    ]);
	    this.body = new LineSegmented({}, [
	        [57,130,139,129],[96,130,94,13,125,44]
	    ]);
	    this.hand = (new Hand()).translate([120, 100]);
	    this.feet = [
	    	FootSegment({
	        	setToFrame: this.footFrame,
	        	numFrames: 15,
	            translate: [73, 130]
	        }),
	        FootSegment({
	        	setToFrame: this.footFrame,
	        	numFrames: 15,
	            translate: [109, 130]
	        })
	    ];

	    // used to automate drawing / translation a little
	    this.partList = [ 
	        this.face,
	        this.body,
	        this.hand,
	        ...this.feet,
	    ];
	}

    translate (vec) {
        this.partList.map((a) => a.translate(vec));
    }

    /* Sets only object that supports multiple frames (the foot) */
    setFeetToFrame (theFrame) {
        this.feet[0].setToFrame(theFrame);
	    this.feet[1].setToFrame(theFrame);
    }

    getLines () {
        return [
	        ...this.body.getLines(),
	        ...this.feet[0].getLines(),
	        ...this.feet[1].getLines(),
            ...this.hand.getLines(),
            ...this.face.getLines()
        ];
    }

    draw (ctx) {
        this.partList.map((a) => a.draw(ctx));
    }

}



export default Body
