import vec2 from 'gl-matrix/src/gl-matrix/vec2';

/*
    takes two input frames with line segments that are matched up
    Returns array of frames with line-interpolated values
*/
let lerpLineSegments = (frame1, frame2, numFrames) => {
    let retArr = new Array( numFrames );
    for (let frameCount = 0; frameCount < numFrames; ++frameCount) {
        let lerpAmount = frameCount / (numFrames - 1);
        let lenFrame = frame1.length;
        let oneFrame = new Array( lenFrame );

        for (let i = 0, lenFr = frame1.length; i < lenFr; ++i) {
            let seg1 = frame1[i];
            let seg2 = frame2[i];
            let newSeg = new Array( lenFr );
            let tmpVec = vec2.create();

            for (let j = 0, lenSeg = seg1.length; j < lenSeg; j += 2) {
                vec2.lerp(tmpVec,
                    [ seg1[j], seg1[j+1] ],
                    [ seg2[j], seg2[j+1] ],
                    lerpAmount
                );
                newSeg[j] = tmpVec[0];
                newSeg[j+1] = tmpVec[1];
            }
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
