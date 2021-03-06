// @flow

import LineSegmented from './LineSegmented';
import type {Frame, Options} from './Types';
import FootSegment from './Foot';
import Hand from './Hand';

const face: Frame = [
    [ 115,105,106,104,102,89,102,71,105,74,115,75 ],
    [ 113,88,106,88 ],
    [ 110,63,107,60,107,56,109,51,111,54,111,60,110,63 ] // eyeball
];

const body: Frame = [
    [ 57,130,139,129 ],[ 96,130,94,13,125,44 ]
];


class Body {

	face: LineSegmented;
	body: LineSegmented;
	hand: LineSegmented;
	feet: LineSegmented[];
	partList: LineSegmented[];

    constructor() {

		const footOptions1: Options = {
            numFrames: 15,
            translate: [ 73, 130 ]
        };
		const footOptions2: Options = {
            numFrames: 15,
            translate: [ 109, 130 ]
		};

        this.face = new LineSegmented({}, face);
        this.body = new LineSegmented({}, body);
        this.hand = Hand.create().translate([ 120, 100 ]);
        this.feet = [
            FootSegment.create(footOptions1),
            FootSegment.create(footOptions2)
        ];

        // used to automate drawing / translation a little
        this.partList = [
            this.face,
            this.body,
            this.hand,
            ...this.feet
        ];
    }

    translate (vec: number[]) {
        this.partList.map((a) => a.translate(vec));
    }

	turnAround (x_axis: number) {
        this.partList.map((a) => a.turnAround(x_axis));
	}

    /* Sets only object that supports multiple frames (the foot) */
    setFeetToFrame (theFrame: number) {
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

    draw (ctx: CanvasRenderingContext2D) {
        this.partList.map((a) => a.draw(ctx));
    }

}



export default Body;
