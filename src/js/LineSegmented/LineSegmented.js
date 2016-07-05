import vec2 from 'gl-matrix/src/gl-matrix/vec2';

const ZERO_VEC = vec2.fromValues(0, 0);

/*
    takes two input frames with line segments that are matched up
    Returns array of frames with line-interpolated values
*/
const lerpLineSegments = (frame1, frame2, numFrames) => {
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

class LineSegmented {

	static lerp = lerpLineSegments;

    /*
        opts.numFrames: amount of frames to interpolate between
        opts.setToFrame: initial frame to set to (default 0)
        frameEnd: optional, if present and structure mirrors frameStart
            allow interpolarion.
    */
	constructor(opts, frameOrSeg, frameEnd) {

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
            this.frames = _nF?
                this.constructor.lerp(frameOrSeg, frameEnd, _nF):
                [ frameOrSeg, frameEnd ];
            this.setToFrame(_sF || 0); // Load this.lineSegments
        } else {
            this.lineSegments = [...frameOrSeg];
        }

        if (_t) { this.translate(_t); }

        return this;
    }

    /* Select frame index and copy it to this.lineSegments array
        Negativve index means offset index from end */
    setToFrame(num) {
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

    translate (vec) {
        this._translateNoCopy(vec);
        vec2.add(this.pos, this.pos, vec);
        return this;
    }

    _translateNoCopy (vec) {
        if (vec2.equals(vec, ZERO_VEC)) {
            return this; // nothing to translate here
        }
        for (const oneLine of this.lineSegments) {
            vec2.forEach(oneLine, 0, 0, 0, vec2.add, vec);
        }
    }

    getLines () {
        return this.lineSegments;
    }

    draw (ctx) {
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
