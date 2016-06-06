import vec2 from 'gl-matrix/src/gl-matrix/vec2';

import { registerHandler, registerTickEvent } from './EventHandler';

import Foot from './Foot';

/* Has its own line segments and manages connections to feet and arms */
class Body { 

    constructor(props) {


    	this.footPt1 = [73,130];
    	this.footPt2 = [109,130];

    	this.pos = [0, 0];

    	this.footFrame = 0;
    	this.totalFootFrames = 15;

        this.feet = [
        	(new Foot({
	        	setToFrame: this.footFrame,
	        	numFrames: this.totalFootFrames
	        })).translate(this.footPt1),
	        (new Foot({
	        	setToFrame: this.footFrame,
	        	numFrames: this.totalFootFrames
	        })).translate(this.footPt2)
        ];
        this.lineSegments = [[[57,130],[139,129]],[[96,130],[94,13],[125,44]]];
        registerHandler('keydown', 'play_area', this.setPositionOnKeyDown);

        this.activeMove = null;
    }

    moveRight = (e) => {

    	var moveDist = [3, 0];
    	var newPos = vec2.add(vec2.create(), this.pos, moveDist);
    	if (newPos[0] > 700) {
    		moveDist = [-this.pos[0], 100];
    		vec2.add(newPos, this.pos, moveDist);
    	}

		this.pos = newPos;
		this.translate(moveDist);

    	this.footFrame = this.footFrame + 1 % this.totalFootFrames;
		this.feet[0].setToFrame(this.footFrame, vec2.add([], this.pos, this.footPt1));
		this.feet[1].setToFrame(this.footFrame, vec2.add([], this.pos, this.footPt2));

    };

    translate (vec) {
        if (vec) this.translateVec = vec;
        if (!this.translateVec) return;
        for (let oneLine of this.lineSegments) {
            for (let theVec of oneLine) {
                vec2.add(theVec, theVec, this.translateVec);
            }
        }
        return this;
    }

    setPositionOnKeyDown = (e) => {
    	switch (e.keyCode) {
    		case 39: // 'Right'
    			registerTickEvent('moveright', this.moveRight, this.moveRightFrames);
    			break;
    		default: ;
    	}
    };

    getLines () {
        return [
	        ...this.lineSegments,
	        ...this.feet[0].getLines(),
	        ...this.feet[1].getLines()
        ];
    }
}

export default Body;
