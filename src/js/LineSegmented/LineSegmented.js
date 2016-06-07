import vec2 from 'gl-matrix/src/gl-matrix/vec2';

/*
    takes two input frames with line segments that are matched up
    Returns array of frames with line-interpolated values
*/
let lerpLineSegments = (frame1, frame2, numFrames) => {
    let retArr = [];
    for (let frameCount = 0; frameCount < numFrames; ++frameCount) {
        let lerpAmount = frameCount / (numFrames - 1);
        let oneFrame = [];

        for (let i = 0, l1 = frame1.length; i < l1; ++i) {
            let seg1 = frame1[i];
            let seg2 = frame2[i];
            let newSeg = [];

            for (let j = 0, l2 = seg1.length; j < l2; ++j) {
                newSeg.push(vec2.lerp(
                    vec2.create(), seg1[j], seg2[j], lerpAmount)
                );
            }
            oneFrame.push(newSeg);
        }
        retArr.push(oneFrame);
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

    /* Select frame index and copy it to this.lineSegments array */
    setToFrame(num) {
        let index = (num >= 0)? num: this.frames.length + num;
        if (index >= this.frames.length) return;
        this.lineSegments = [];
        for (let vecs of this.frames[index]) {
            let destVec = [];
            for (let theVec of vecs) {
                destVec.push(vec2.clone(theVec));
            }
            this.lineSegments.push(destVec);
        }
        return this;
    }

    translate (vec) {
        for (let oneLine of this.lineSegments) {
            for (let theVec of oneLine) {
                vec2.add(theVec, theVec, vec);
            }
        }
        return this;
    }

    getLines () {
        return this.lineSegments;
    }

}

export default LineSegmented
