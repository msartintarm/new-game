import vec2 from 'gl-matrix/src/gl-matrix/vec2';

const ZERO_VEC = vec2.fromValues(0, 0);

/*
    takes two input frames with line segments that are matched up
    Returns array of frames with line-interpolated values
*/
let lerpLineSegments = (frame1, frame2, numFrames) => {
    let retArr = new Array( numFrames );
    let lenFrame = frame1.length;
    for (let frameCount = 0; frameCount < numFrames; ++frameCount) {
        let lerpAmount = frameCount / (numFrames - 1);
        let oneFrame = new Array( lenFrame );

        for (let i = 0; i < lenFrame; ++i) {
            let newSeg = new Array( frame1[i].length );

            vec2.forEach2(newSeg, frame1[i], frame2[i],
                0, 0, 0, vec2.lerp, lerpAmount);

            oneFrame[i] = newSeg;
        }
        retArr[frameCount] = oneFrame;
    }
    return retArr;
};

class LineSegmented {

	lerp = lerpLineSegments;

    /*
        opts.numFrames: amount of frames to interpolate between
        opts.setToFrame: initial frame to set to (default 0)
        frameEnd: optional, if present and structure mirrors frameStart
            allow interpolarion.
    */
	constructor(opts, frameOrSeg, frameEnd) {

        let _opts = opts || {};
        let _t = _opts.translate;
        let _nF = _opts.numFrames;
        let _sF = _opts.setToFrame;

        this.pos = vec2.clone(ZERO_VEC);

        // either one line segment or multipleframes
        if (!frameEnd) {
            this.lineSegments = [...frameOrSeg];
        } else {
            this.frames = _nF?
                this.lerp(frameOrSeg, frameEnd, _nF):
                [frameOrSeg, frameEnd];
            this.setToFrame(_sF || 0); // Load this.lineSegments
        }

        if (_t) { this.translate(_t); }

        return this;
    }

    /* Select frame index and copy it to this.lineSegments array
        Negativve index means offset index from end */
    setToFrame(num) {
        let index = (num >= 0)? num: this.frames.length + num;
        if (index >= this.frames.length) return;
        this.lineSegments = [];
        for (let vecs of this.frames[index]) {
            let destVec = [];
            for (let theNum of vecs) {
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
        for (let oneLine of this.lineSegments) {
            vec2.forEach(oneLine, 0, 0, 0, vec2.add, vec);
        }
    }

    getLines () {
        return this.lineSegments;
    }

    draw (ctx) {
        let ls = this.lineSegments;
        ctx.save();
        ctx.beginPath();
        for (let line of ls) {
            if (line.length < 2) break;
            ctx.moveTo( line[0], line[1] );
            for (let i = 2; i < line.length; i += 2) {
                ctx.lineTo( line[i], line[i+1] );
            }
        }
        ctx.stroke();
        ctx.restore();
    }

}

export default LineSegmented
