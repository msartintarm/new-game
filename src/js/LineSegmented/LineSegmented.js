// @flow

import vec2 from 'gl-matrix/src/gl-matrix/vec2';

import type {Frame, Vector} from './Types';

const ZERO_VEC = vec2.fromValues(0, 0);

/*
    takes two input frames with line segments that are matched up
    Returns array of frames with line-interpolated values
*/
const lerpLineSegments = (frame1: Frame, frame2: Frame, numFrames: number) => {
    const retArr = new Array( numFrames );
    const lenFrame = frame1.length;
    for (let frameCount = 0; frameCount < numFrames; ++frameCount) {
        const lerpAmount = frameCount / (numFrames - 1);
        const oneFrame = new Array( lenFrame );

        for (let i = 0; i < lenFrame; ++i) {
            const newSeg = new Array( frame1[i].length );

            vec2.forEach2(newSeg, frame1[i], frame2[i],
                0, 0, 0, vec2.lerp, lerpAmount);

            oneFrame[i] = newSeg;
        }
        retArr[frameCount] = oneFrame;
    }
    return retArr;
};

export type Options = {
    translate?: number[],
    numFrames?: number,
    setToFrame?: number,
    fillStyle?: CanvasPattern | string,
    fillFrames?: boolean[],
    collisionIndex?: number
};


class LineSegmented {

    lineSegments: Frame;
    collisionIndex: number;
    fillStyle: CanvasPattern | string;
    fillFrames: boolean[];
    pos: number[];
    frames: (Frame)[];
    static lerp = lerpLineSegments;

    /*
        opts.numFrames: amount of frames to interpolate between
        opts.setToFrame: initial frame to set to (default 0)
        frameEnd: optional, if present and structure mirrors frameStart
            allow interpolarion.
    */
    constructor(opts?: Options, frameOrSeg: Frame, frameEnd?: Frame) {

        const _opts = opts || {};

        const _t = _opts.translate;

        const _nF = _opts.numFrames;
        const _sF = _opts.setToFrame;
        const _fS = _opts.fillStyle;
        const _fF = _opts.fillFrames;

        if (_fS) { this.fillStyle = _fS; }
        if (_fF) { this.fillFrames = _fF; }

        this.pos = vec2.clone(ZERO_VEC);

        // either one line segment or multipleframes
        if (frameEnd) {
            if (_nF) {
                this.frames = this.constructor.lerp(frameOrSeg, frameEnd, _nF);
            } else {
                this.frames = [ frameOrSeg, frameEnd ];
            }
            this.setToFrame(_sF || 0); // Load this.lineSegments
        } else {
            this.lineSegments = [...frameOrSeg];
        }

        if (_opts.collisionIndex) {
            this.collisionIndex = _opts.collisionIndex;
        }

        this.translate(_t || ZERO_VEC);

        return this;
    }

    /* Select frame index and copy it to this.lineSegments array
        Negativve index means offset index from end */
    setToFrame(num: number) {
        const index = (num >= 0)? num: this.frames.length + num;
        if (index >= this.frames.length) return;
        this.lineSegments = [];
        for (const vecs of this.frames[index]) {
            const destVec = [];
            for (const theNum of vecs) {
                destVec.push(theNum);
            }
            this.lineSegments.push(destVec);
        }
        this._translateNoCopy(this.pos);
        return this;
    }


    turnAround (x_axis: number) {
        if (this.frames) {
            for (const oneSegment of this.frames) {
                for (const oneLine of oneSegment) {
					console.log(oneLine);
//                    vec2.forEach(oneLine, 0, 0, 0, vec2.multiply, [ -1, 1 ]);
  //                  vec2.forEach(oneLine, 0, 0, 0, vec2.add, [ 2 * x_axis, 0 ]);

                }
            }
        } else {
            for (const oneLine of this.lineSegments) {
                vec2.forEach(oneLine, 0, 0, 0, vec2.multiply, [ -1, 1 ]);
                vec2.forEach(oneLine, 0, 0, 0, vec2.add, [ 2 * x_axis, 0 ]);

            }
        }
    }

    translate (vec: Vector) {
        this._translateNoCopy(vec);
        vec2.add(this.pos, this.pos, vec);
        return this;
    }

    _translateNoCopy (vec: Vector) {
        if (vec2.equals(vec, ZERO_VEC)) {
            return this; // nothing to translate here
        }
        for (const oneLine of this.lineSegments) {
            vec2.forEach(oneLine, 0, 0, 0, vec2.add, vec);
        }
    }

    getLines (): Frame {
        return this.lineSegments;
    }

    getCollisionLines(): Frame {
        if (!this.collisionIndex) {
            throw "Collision lines do not exist for this object."
        }
        return [this.lineSegments[this.collisionIndex]];
    }

    draw (ctx: CanvasRenderingContext2D) {
        const ls = this.lineSegments;
        ctx.save();
        ctx.beginPath();
        let count = -1;
        for (const line of ls) {
            if (line.length < 2) break;
            ++count;
            ctx.moveTo( line[0], line[1] );
            for (let i = 2; i < line.length; i += 2) {
                ctx.lineTo( line[i], line[i+1] );
            }
            if (this.fillStyle && (
                !this.fillFrames || !!this.fillFrames[count])) {
                ctx.fillStyle = this.fillStyle;
                ctx.fill();
            }
        }
        ctx.stroke();
        ctx.restore();
    }

}

export default LineSegmented;
