import vec2 from 'gl-matrix/src/gl-matrix/vec2';

import { registerHandler, registerTickEvent } from './EventHandler';

import Foot from './LineSegmented/Foot';
import Hand from './LineSegmented/Hand';
import LineSegmented from './LineSegmented/LineSegmented';

import Stuff from './Stuff'
import CollisionLine from './Collision'

/* Has its own line segments and manages connections to feet and arms */
class Player { 

    constructor(props) {

//        this.footCollisionSeg = []]

    	this.footPt1 = [73, 130];
    	this.footPt2 = [109, 130];
    	this.handPt = [120, 100];

    	this.pos = [0, 0];

    	this.footFrame = 0;
    	this.moveRightFrames = 15;
    	this.moveRightEndFrames = 4;

        this.feet = [
        	(new Foot({
	        	setToFrame: this.footFrame,
	        	numFrames: this.moveRightFrames
	        })).translate(this.footPt1),
	        (new Foot({
	        	setToFrame: this.footFrame,
	        	numFrames: this.moveRightFrames
	        })).translate(this.footPt2)
        ];
        this.body = new LineSegmented({}, [[57,130,139,129],[96,130,94,13,125,44]]);
        registerHandler('keydown', 'play_area', this.setPositionOnKeyDown);
        registerHandler('keyup', 'play_area', this.setPositionOnKeyUp);

        this.activeMove = null;

        this.hand = (new Hand()).translate(this.handPt);
    }

    moveRight = (e) => {

    	var moveDist = [6, 0];
    	var newPos = vec2.add(vec2.create(), this.pos, moveDist);
    	if (newPos[0] > 700) {
    		moveDist = [-this.pos[0], 100];
    		vec2.add(newPos, this.pos, moveDist);
    	}

		this.pos = newPos;

    	this.footFrame = Math.min(this.footFrame + 1, this.moveRightFrames - 1);
        this.feet[0].setToFrame(this.footFrame);
        this.feet[1].setToFrame(this.footFrame);
        this.translate(moveDist);

//		if (this.footFrame === this.moveRightFrames - 1) {
//			this.setupMoveRightEnd();
//		}
    };

    checkContact() {

        for (let zz of Stuff) {
            console.log("Wow!", zz);
        }
    }

    setupMoveRightEnd () {
		// set up ending of move right
		let index = Math.min(
			this.footFrame, 
			Math.floor(this.moveRightFrames / 2));
		this.moveEndIndexMap = [
			Math.round(index),
			Math.round(index / 1.5),
			Math.round(index / 3 ),
			0
		]
		this.footFrame = 0;
		registerTickEvent('moveright', this.moveRightEnd, this.moveRightEndFrames, true);
    }

    moveRightEnd = (e) => {
    	let f = this.moveEndIndexMap[this.footFrame];
		this.footFrame += 1;
		this.feet[0].setToFrame(f).translate(this.footPt1);
		this.feet[1].setToFrame(f).translate(this.footPt2);
//		this.hand.translate(moveDist);
    };

    translate (vec) {
        vec2.add(this.footPt1, vec, this.footPt1);
        vec2.add(this.footPt2, vec, this.footPt2);
        vec2.add(this.handPt, vec, this.handPt);

        this.feet[0].translate(this.footPt1);
        this.feet[1].translate(this.footPt2);
        this.hand.translate(vec);
        this.body.translate(vec);
        return this;
    }

    setPositionOnKeyDown = (e) => {
    	switch (e.keyCode) {
    		case 39: // 'Right'
				registerTickEvent('moveright', this.moveRight, 0);
    			break;
    		default: ;
    	}
    };

    setPositionOnKeyUp = (e) => {
    	switch (e.keyCode) {
    		case 39: // 'Right'
			    this.setupMoveRightEnd();
    			break;
    		default: ;
    	}
    };

    getLines () {
        return [
	        ...this.body.getLines(),
	        ...this.feet[0].getLines(),
	        ...this.feet[1].getLines(),
	        ...this.hand.getLines()
        ];
    }
}

export default Player;
