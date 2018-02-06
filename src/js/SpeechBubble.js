// @flow
import LineSegmented from './LineSegmented/LineSegmented';
import type {Options, Frame} from './LineSegmented/LineSegmented';

import TextCanvas from './TextCanvas';

//let bubbleLines = [100,200,200,200,200,100,100,100];
const bubbleLines: Frame = [[ 225,69,224,38,208,23 ],
    [ 213,17,227,30,360,31,376,17 ],
    [ 383,24,364,37,365,106,383,117 ],
    [ 377,124,359,110,234,108,220,123 ],
    [ 214,117,226,105,225,69 ]];

const TEXT_SIZE = 16;

/* Draws the speech bubble and the text. */
class SpeechBubble {

	textCanvases: TextCanvas[];
	bubble: LineSegmented;
	showBubble: boolean;

    constructor(text: string, opts?: Options) {
        if (!text) { return null; }
        this.textCanvases = text.split('\n').map(
            (aText) => {
                return new TextCanvas({
                    textSize: TEXT_SIZE,
                    text: aText
            });
        });
        this.bubble = new LineSegmented(opts, bubbleLines);
        this.showBubble = true;
    }

    translate(vec: number[]) {
        this.bubble.translate(vec);
    }

    hide () {
        this.showBubble = false;
    }
    show () {
        this.showBubble = true;
    }

    draw (ctx: CanvasRenderingContext2D) {

        if (!this.showBubble) { return; }
        this.bubble.draw(ctx);
        let [ x, y ] = this.bubble.pos;
        x += 230;
        y += 35;
        for (const c of this.textCanvases) {
            ctx.drawImage(c.getCanvas(), x, y);
            y += TEXT_SIZE;
        }
//        ctx.restore();
    }

}

export default SpeechBubble;
