// @flow
import LineSegmented from './LineSegmented/LineSegmented';
import type {Options, Frame} from './LineSegmented/Types';

const boxLines: Frame = [[ 100,200,200,200,200,100,100,100 ]];

/* A box to bash your head into. */
class Box {

	box: LineSegmented;
	showBubble: boolean;
	id: number;

    static boxList = {};
    static _id = -1;
    static getId () { return ++Box._id; }

    constructor(opts: Options) {
        this.box = new LineSegmented(opts, boxLines);
        this.showBubble = true;
        this.id = Box.getId();
        Box.boxList[ this.id ] = this;
    }

    translate(vec: number[]) {
        this.box.translate(vec);
    }

    draw (ctx: CanvasRenderingContext2D) {
        this.box.draw(ctx);
    }

}

export default Box;
