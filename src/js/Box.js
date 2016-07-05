import LineSegmented from './LineSegmented/LineSegmented';

const boxLines = [ 100,200,200,200,200,100,100,100 ];

const TEXT_SIZE = 16;

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

    hide () {
        this.showBubble = false;
    }
    show () {
        this.showBubble = true;
    }

    draw (ctx) {

        if (!this.showBubble) { return; }
        this.bubble.draw(ctx);
        let [ x, y ] = this.bubble.pos;
        x += 230;
        y += 35;
        for (let c of this.textCanvases) {
            ctx.drawImage(c.getCanvas(), x, y);
            y += TEXT_SIZE;
        }
//        ctx.restore();
    }

}

export default Box;
