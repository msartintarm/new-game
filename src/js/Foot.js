import vec2 from 'gl-matrix/src/gl-matrix/vec2';

/* The Foot */
class Foot { 

    constructor(props) {
        this.lineSegments = [[31,188],[30,175],[49,171],[97,178],[98,187],[31,187]];
    }

    translate (vec) {
        for(var i = 0; i < this.lineSegments.length; ++i) {
            vec2.add(this.lineSegments[i], this.lineSegments[i], vec);
        }
        return this;
    }

    getLines () {
        return this.lineSegments;
    }
}

export default Foot;
