import vec2 from 'gl-matrix/src/gl-matrix/vec2';

import { registerHandler, registerTickEvent } from './EventHandler';

import Foot from './LineSegmented/Foot';
import Hand from './LineSegmented/Hand';
import LineSegmented from './LineSegmented/LineSegmented';

import Stuff from './Stuff'
import detectCollision from './Collision'

/* Has its own line segments and manages connections to feet and arms */
class Player { 

    constructor(collisionRetrievalFunction) {

        this.collisionlinesFn = collisionRetrievalFunction;

        this.isFalling = false;

        this.moveDist =[0, 0];

    	this.footPt1 = [73, 130];
    	this.footPt2 = [109, 130];
    	this.handPt = [120, 100];

    	this.pos = [99,165,99,167];

    	this.footFrame = 0;
    	this.moveRightFrames = 15;
    	this.moveRightEndFrames = 4;

        this.footCollisionLine1 = [84, 100, 84, 169];
        this.footCollisionLine2 = [158, 100, 158, 169];

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
        this.body = new LineSegmented({}, 
            [[57,130,139,129],[96,130,94,13,125,44]]);
        registerHandler('keydown', 'play_area', this.setPositionOnKeyDown);
        registerHandler('keyup', 'play_area', this.setPositionOnKeyUp);

        this.activeMove = null;

        this.hand = (new Hand()).translate(this.handPt);

        registerTickEvent('adjustPosition', this.adjustPosition, 0); // set fall

    }

    moveRight = (e) => {

    	this.moveDist[0] = 6;
    	let newPos = vec2.add(vec2.create(), this.pos, this.moveDist);
    	this.footFrame = Math.min(this.footFrame + 1, this.moveRightFrames - 1);
        this.feet[0].setToFrame(this.footFrame).translate(this.footPt1);
        this.feet[1].setToFrame(this.footFrame).translate(this.footPt2);
    };

    adjustPosition = () => {
        this.checkFalling();
        if (this.moveDist[0] === 0 & this.moveDist[1] === 0) return;
        this.translate(this.moveDist);

    };

    checkFalling () {
        // check collision

        let footCollisionPts = detectCollision(
            this.footCollisionLine1, this.collisionlinesFn());
        let footCollisionPts2 = detectCollision(
            this.footCollisionLine2, this.collisionlinesFn());

        if (footCollisionPts || footCollisionPts2) {
            if (this.isFalling) {
                var thePts = footCollisionPts || footCollisionPts2;
                // check how much more 'up' we need to go -- correction is 
                // part of the fall
                console.log(JSON.stringify(thePts));
                for (let i = 1; i < thePts.length; i += 2)
                this.moveDist[1] = Math.min(0, thePts[i] - this.pos[1]);
                if (this.moveDist[1] !== 0) this.isFalling = false;
            }
            if (footCollisionPts && footCollisionPts2) {
                console.log("On solid ground.");
            } else {
                console.log("Hanging..")
            }
        } else {
            console.log("Falling!!1");
            if (!this.isFalling) {
                this.isFalling = true;
                this.fallCount = 0;
            } else if (this.fallCount < 20) {
                this.fallCount += 1;
            }
            this.moveDist[1] = Math.floor(
//                this.moveDist[1] + (this.fallCount / 10)
                this.moveDist[1] + (1)
            );
        }
    }

    setupMoveRightEnd () {
        this.moveDist[0] = 0;
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
    };

    translate (vec) {
        vec2.forEach(this.footCollisionLine1, 0, 0, 0, vec2.add, vec);
        vec2.forEach(this.footCollisionLine2, 0, 0, 0, vec2.add, vec);
        vec2.add(this.pos, this.pos, vec);
        vec2.add(this.footPt1, this.footPt1, vec);
        vec2.add(this.footPt2, this.footPt2, vec);
        vec2.add(this.handPt, this.handPt, vec);

        this.feet[0].translate(vec);
        this.feet[1].translate(vec);
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

    getCollisionLines () {
        return [this.footCollisionLine1, this.footCollisionLine2];
    }
}

export default Player;
