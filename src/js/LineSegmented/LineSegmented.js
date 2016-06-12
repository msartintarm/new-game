import vec2 from 'gl-matrix/src/gl-matrix/vec2';

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
	constructor(opts, frameStart, frameEnd) {

        if (!frameEnd) {
            this.lineSegments = [...frameStart];
            return;
        }

		let _opts = opts || {};
	    this.frames = _opts.numFrames?
	        this.lerp(frameStart, frameEnd, _opts.numFrames):
	        [frameStart, frameEnd];
	    this.setToFrame((_opts.setToFrame || 0)); // Load this.lineSegments
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
        return this;
    }

    translate (vec) {
        for (let oneLine of this.lineSegments) {
            vec2.forEach(oneLine, 0, 0, 0, vec2.add, vec);
        }
        return this;
    }

    getLines () {
        return this.lineSegments;
    }

}

export default LineSegmented
