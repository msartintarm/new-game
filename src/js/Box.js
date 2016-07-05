import LineSegmented from './LineSegmented/LineSegmented';

const boxLines = [ 100,200,200,200,200,100,100,100 ];

/* A box to bash your head into. */
class Box {

    static boxList = {};
    static _id = -1;
    static getId () { return ++Box._id; }

    constructor(opts) {
        this.box = new LineSegmented(opts, boxLines);
        this.showBubble = true;
        this.id = Box.getId();
        Box.boxList[ this.id ] = this;
    }

    translate(vec) {
        this.box.translate(vec);
    }

    draw (ctx) {
        this.box.draw(ctx);
    }

}

export default Box;
