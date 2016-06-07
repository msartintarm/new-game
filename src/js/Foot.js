import vec2 from 'gl-matrix/src/gl-matrix/vec2';

/* The Foot */
class Foot { 

    constructor(opts) {

        var frameStart = [
            [[13,32],[16,13],[6,0],[5,0]],
            [[0,0],[10,15],[7,38],[32,38],[42,38],[52,38],[31,34],[18,33],[8,33]]
        ];
        var frameEnd = [
            [[-2,20],[9,12],[5,0],[5,0]],
            [[0,0],[2,13],[-17,23],[3,26],[3,38],[21,38],[8,33],[7,22],[-8,19]],
        ];

        this.frames = [];

        let footFrameCount = opts.numFrames || 2;

        for (let frameCount = 0; frameCount < footFrameCount; ++frameCount) {
            let lerpAmount = frameCount / (footFrameCount - 1);
            let oneFrame = [];

            for (let i = 0, l1 = frameStart.length; i < l1; ++i) {
                let seg1 = frameStart[i];
                let seg2 = frameEnd[i];
                let ret = [];

                for (let j = 0, l2 = seg1.length; j < l2; ++j) {
                    ret.push(vec2.lerp(
                        vec2.create(), seg1[j], seg2[j], lerpAmount)
                    );
                }
                oneFrame.push(ret);
            }
            this.frames.push(oneFrame);
        }
        this.setToFrame((opts.setToFrame || 0));
    }

    setToFrame(num, newTranslate) {
        console.log("sET to Frame", num, JSON.stringify(newTranslate));
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
        this.translate( (newTranslate || undefined) );
    }

    translate (vec) {
        if (!!vec) this.translateVec = vec2.clone(vec);
        if (!this.translateVec) return;
        console.log("yo", this.lineSegments[0][0][0], this.translateVec);
        for (let oneLine of this.lineSegments) {
            for (let theVec of oneLine) {
                vec2.add(theVec, theVec, this.translateVec);
            }
        }
        console.log(this.lineSegments[0][0][0]);
        return this;
    }

    getLines () {
        return this.lineSegments;
    }
}

export default Foot;
