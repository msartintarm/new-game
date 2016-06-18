import vec2 from 'gl-matrix/src/gl-matrix/vec2';

import { registerHandler, registerTickEvent,
    checkTickEvent, deregisterTickEvent } from './EventHandler';

import Body from './LineSegmented/Body';

import Stuff from './Stuff'
import detectCollision from './Collision'

/* Has its own line segments and manages connections to feet and arms
    @collisionlinesFn: type [function] 
        Returns array of collision lines (arrays of 4 pts) when invoked.
*/
class Player { 

    constructor(collisionRetrievalFunction) {

        this.collisionlinesFn = collisionRetrievalFunction;

        this.moveDist = [0, 0];


    	this.pos = [99,165];

        this.body = new Body();

    	this.footFrame = 0;
        this.moveLeftFrames = 15;
        this.moveRightFrames = 15;
    	this.moveEndFrames = 4;

        this.footCollisionLine1 = [84, 100, 84, 169];
        this.footCollisionLine2 = [158, 100, 158, 169];

        this.bodyCollisionLine = [91,12,93,129];

        registerHandler('keydown', 'play_area', this.setPositionOnKeyDown);
        registerHandler('keyup', 'play_area', this.setPositionOnKeyUp);
        registerTickEvent('adjustPosition', this.adjustPosition, 0); // set fall
    }

    getPos = () => { return [...this.pos]; }

    jump = (e) => {
        this.moveDist[1] = -20;
    };

    moveRight = (e) => {
        this.moveDist[0] = 6;
        this.footFrame = Math.min(this.footFrame + 1, this.moveRightFrames - 1);
        this.body.setFeetToFrame(this.footFrame);
    };

    moveLeft = (e) => {
        this.moveDist[0] = -6;
        this.footFrame = Math.min(this.footFrame + 1, this.moveLeftFrames - 1);
        this.body.setFeetToFrame(this.footFrame);
    };

    adjustPosition = () => {
        this.checkFalling();
        this.checkPushing();
        if (this.moveDist[0] === 0 & this.moveDist[1] === 0) return;
        this.translate(this.moveDist);
    };

    getCollisionPoints (line, vec) {
        // check collision
        let newCollision = [...line];
        vec2.forEach(newCollision, 0, 0, 0, vec2.add, vec);
        return detectCollision(newCollision, this.collisionlinesFn());
    }

    getFootCollisionPoints(vec) {
        return 
            this.getCollisionPoints(this.footCollisionLine1, vec) ||
            this.getCollisionPoints(this.footCollisionLine2, vec) ||
            null;
    }

    getBodyCollisionPoints() {
        return 
            this.getCollisionPoints(this.bodyCollisionLine, this.moveDist);
    }

    getMinY(points) {
        let a = points[1];
        for (let i = 3; i < points.length; i += 2) { // check each line collision
            a = Math.min(a, points[i]);
        }
        return a;
    }

    getMinX(points) {
        let a = points[0];
        for (let i = 2; i < points.length; i += 2) { // check each line collision
            a = Math.min(a, points[i]);
        }
        return a;
    }

    getMaxX(points) {
        let a = points[0];
        for (let i = 2; i < points.length; i += 2) { // check each line collision
            a = Math.max(a, points[i]);
        }
        return a;
    }

    /* return Y delta? */
    checkFalling () {
        // check collision 

        let collisionPts = this.getFootCollisionPoints(this.moveDist);
        if (!collisionPts) { // fall!
            if (this.moveDist[1] < 20) { // accelerate
                this.moveDist[1] = this.moveDist[1] + 1;
                // could overshoot ground
                let newCollisionPts = this.getFootCollisionPoints(this.moveDist);
                if (newCollisionPts) {
                    console.log("Overshoot!");
                    let minY = this.getMinY(newCollisionPts);
                    if (this.moveDist[1] > minY - this.pos[1]) {
                        this.moveDist[1] = this.pos[1] - minY;
                    }
                }
            }
        } else {
            // are we falling (y positive)? if so, set to line intercept
            if (this.moveDist[1] >= -1) {
                let minY = this.getMinY(collisionPts);
                this.moveDist[1] = minY - this.pos[1];
            }
        }
    }

    /* return X delta? */
    checkPushing () {
        // check collision
        let collisionPts = this.getBodyCollisionPoints();
        if (collisionPts) { // fall!
            if (this.moveDist[0] < 0) { // moving left.. check left collision
                let minX = this.getMinX(newCollisionPts);
                if (this.moveDist[0] > minX - this.pos[0]) {
                console.log("OvershootX!");
                    this.moveDist[0] = this.pos[0] - minX;
                }
            } else {
                let maxX = this.getMaxX(newCollisionPts);
                if (this.moveDist[0] > this.pos[0] - maxX) {
                console.log("Undershoot!");
                    this.moveDist[0] = this.pos[0] - maxX;
                }
            }
        }
    }

    setupMoveEnd (event_name, num_frames) {
        this.moveDist[0] = 0;
		// set up ending of move right
		let index = Math.min(
			this.footFrame, 
			Math.floor(num_frames / 2));
		this.moveEndIndexMap = [
			Math.round(index),
			Math.round(index / 1.5),
			Math.round(index / 3 ),
			0
		]
		this.footFrame = 0;
		registerTickEvent(event_name, this.moveEnd, this.moveEndFrames, true);
    }

    moveEnd = (e) => { 
        let f = this.moveEndIndexMap[this.footFrame];
        this.footFrame += 1;
        this.body.setFeetToFrame(f);
    };

    translate (vec) {
        vec2.forEach(this.footCollisionLine1, 0, 0, 0, vec2.add, vec);
        vec2.forEach(this.footCollisionLine2, 0, 0, 0, vec2.add, vec);
        vec2.forEach(this.bodyCollisionLine, 0, 0, 0, vec2.add, vec);
        vec2.add(this.pos, this.pos, vec);
        this.body.translate(vec);
        return this;
    }

    setPositionOnKeyDown = (e) => {
    	switch (e.keyCode) {
            case 37: // 'Right'
                deregisterTickEvent('moveright');
                registerTickEvent('moveleft', this.moveLeft, 0);
                break;
            case 38: // 'Up'
                registerTickEvent('jump', this.jump, 1);
                break;
            case 39: // 'Right'
                deregisterTickEvent('moveleft');
                registerTickEvent('moveright', this.moveRight, 0);
                break;
    		default: ;
    	}
    };

    setPositionOnKeyUp = (e) => {
    	switch (e.keyCode) {
            case 37: // 'Left'
                if (checkTickEvent('moveright')) break;
                this.setupMoveEnd('moveleft', this.moveLeftFrames);
                break;
            case 39: // 'Right'
                if (checkTickEvent('moveleft')) break;
                this.setupMoveEnd('moveright', this.moveRightFrames);
                break;
    		default: ;
    	}
    };

    getLines () {
        return this.body.getLines();
    }

    getCollisionLines () {
        return [this.footCollisionLine1, this.footCollisionLine2];
    }
}

export default Player;
