import LineSegmented from './LineSegmented/LineSegmented';

import TextCanvas from './textCanvas';

let bubbleLines = [100,200,200,200,200,100,100,100];

const TEXT_SIZE = 25;

/* Draws the speech bubble and the text. */
class SpeechBubble { 

    constructor(opts) {
        if (!opts.text) { return null; }
        this.textCanvases = opts.text.split('\n').map(
            (text) => {
                return new TextCanvas({
                    textSize: TEXT_SIZE,
                    text: text
            });
        });
        this.bubble = new LineSegmented(opts, bubbleLines);

    }

    translate(vec) {
        this.bubble.translate(vec);
    }

    draw (ctx) {
        ctx.save();
        let [ x, y ] = this.bubble.pos;
        for (let c of this.textCanvases) {
            ctx.drawImage(c.getCanvas(), x, y);
            y += TEXT_SIZE;
        }
        ctx.restore();
    }

}

export default SpeechBubble;
