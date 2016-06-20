import vec2 from 'gl-matrix/src/gl-matrix/vec2';

import { registerHandler, registerTickEvent,
    checkTickEvent, deregisterTickEvent } from './EventHandler';

import Body from './LineSegmented/Body';

import Stuff from './Stuff'
import DetectCollision from './Collision'

// Returns function for max / min of all X or Y points
let getMaxMinFn = (fn, start) => {
    return (points) => {
        let a = points[start];
        for (let i = start + 2; i < points.length; i += 2) { // check each line collision
            a = fn(a, points[i]);
        }
        return a;
    };
};

let getMinY = getMaxMinFn(Math.min, 1);
let getMinX = getMaxMinFn(Math.min, 0);
let getMaxX = getMaxMinFn(Math.max, 0);
let getMaxY = getMaxMinFn(Math.max, 1);

const MOVE_LR_DEC = 1;
const MOVE_LR_ACC = 0.4;
const MOVE_LR_TOP = 16;

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

        this.jumpFlag = false;
        this.secondJumpFlag = false;

    	this.footFrame = 0;
        this.moveLeftFrames = 15;
        this.moveRightFrames = 15;
    	this.moveEndFrames = 4;

        this.collisionLineList = []; // stores registered collision lines

        this.footCollisionLine1 = this.addCollisionLine(84, 100, 84, 169);
        this.footCollisionLine2 = this.addCollisionLine(158, 100, 158, 169);
        this.bodyCollisionLine = this.addCollisionLine(82, 120, 160, 120);
        this.headCollisionLine1 = this.addCollisionLine(92, 37, 92, 67);
        this.headCollisionLine2 = this.addCollisionLine(131, 37, 131, 67);
 
        this.body_offset_x_l = this.bodyCollisionLine[0] - this.pos[0];
        this.body_offset_x_2 = this.bodyCollisionLine[2] - this.pos[0];
        this.head_offset_y = this.headCollisionLine1[1] - this.pos[1];

        registerHandler('keydown', 'play_area', this.setPositionOnKeyDown);
        registerHandler('keyup', 'play_area', this.setPositionOnKeyUp);
        registerTickEvent('adjustPosition', this.adjustPosition, 0); // set fall
    }

    addCollisionLine(nums) {
        let newLine = Array.from(arguments);
        this.collisionLineList.push(newLine);
        return newLine;
    }

    getPos = () => { return [...this.pos]; };

    jump = (e) => {
        // check if we have already initiated a jump
        if (!!this.jumpFlag && !!this.secondJumpFlag) {
            return;
        }
        if (!!this.jumpFlag) {
            this.secondJumpFlag = true;
            this.moveDist[1] = -17;
        } else {
            this.jumpFlag = true;
            this.moveDist[1] = -20;
        }
    };

    moveRight = (e) => {
        let x = this.moveDist[0];
        if (x < 0) { // going left.. accelerate right!
            x = Math.min(x + MOVE_LR_DEC, 0);
        } else {
            x = Math.min(x + MOVE_LR_ACC, MOVE_LR_TOP);
        }
        this.moveLR(x, this.moveRightFrames);
    };

    moveLeft = (e) => {
        let x = this.moveDist[0];
        if (x > 0) { // going right.. accelerate left!
            x = Math.max(x - MOVE_LR_DEC, 0);
        } else {
            x = Math.max(x - MOVE_LR_ACC, -MOVE_LR_TOP)
        }
        this.moveLR(x, this.moveLeftFrames);
    };

    moveLR (x, maxFrames) { // do things needed by both methods
        this.moveDist[0] = x;
        this.footFrame = Math.min(this.footFrame + 1, maxFrames - 1);
        this.body.setFeetToFrame(this.footFrame);
    }

    /* Called each tick. Makes adjustments to next distance 
        based on environment. Then changes player to position */
    adjustPosition = () => {
        this.moveDist = this.checkPushing(this.moveDist);
        this.moveDist = this.checkFalling(this.moveDist);
        this.moveDist = this.checkCeiling(this.moveDist);
        this.moveDist = this.checkEscaped(this.moveDist); // lol
        if (this.moveDist[0] === 0 & this.moveDist[1] === 0) return;
        this.translate(this.moveDist);
    };

    getCollisionPoints (line, vec) {
        // check collision
        let newCollision = [...line];
        vec2.forEach(newCollision, 0, 0, 0, vec2.add, vec);
        return DetectCollision(newCollision, this.collisionlinesFn());
    }

    getFootCollisionPoints(vec) {
        let a = [
            ...this.getCollisionPoints(this.footCollisionLine1, vec),
            ...this.getCollisionPoints(this.footCollisionLine2, vec)
        ];
        return (a.length < 1)? null: a;
    }

    getHeadCollisionPoints(vec) {
        let a = [
            ...this.getCollisionPoints(this.headCollisionLine1, vec),
            ...this.getCollisionPoints(this.headCollisionLine2, vec)
        ];
        return (a.length < 1)? null: a;
    }

    getBodyCollisionPoints(vec) {
        let a = this.getCollisionPoints(this.bodyCollisionLine, vec);
        return (a.length < 1)? null: a;
    }

    /* checks if you'd be falling into objects and sets dist accordingly */
    checkFalling (moveDist) {
        let dY = moveDist[1];
        // check collision 

        let collisionPts = this.getFootCollisionPoints(moveDist);
        if (collisionPts) { // bam. hit ground
            if (!!this.jumpFlag) { this.jumpFlag = false; } // reset powerups
            if (!!this.secondJumpFlag) { this.secondJumpFlag = false; }

            // are we falling (y positive)? if so, set to line intercept
            if (dY > 0  || (dY === 0 && moveDist[0] !== 0)) {
                let minY = getMinY(collisionPts);
                dY = Math.max(-collisionPts.length, minY - this.pos[1]);
            }
        } else {
            if (this.jumpFlag && dY >= 0 && dY < 5) { // accelerate
                dY = dY + .25;
            } else if (dY >= 0 && dY < 15) { // accelerate more
                dY = dY + 0.5;
            } else if (dY < 20) { // accelerate more
                dY = dY + 1;
            }
            let newCollisionPts = this.getFootCollisionPoints([moveDist[0], dY]);
            if (newCollisionPts) { // could overshoot ground
                let minY = getMinY(newCollisionPts);
                if (dY > minY - this.pos[1]) {
                    let _dY = dY;
                    dY = this.pos[1] - minY;
                    console.log("Overshoot! Change: ", dY - _dY);
                }
            }
        }
        return [moveDist[0], dY];
    }

    /* checks if you'd hit object with head and sets dist accordingly */
    checkCeiling (moveDist) {
        let dist = [...moveDist];

        // check collision 

        let collisionPts = this.getHeadCollisionPoints(dist);
        if (collisionPts) { // bam. hit ceiling
            // are we going up (y negative)? if so, set to line intercept
            if (dist[1] < 0 || dist[1] === 0 && dist[0] !== 0) {
                let maxY = getMaxY(collisionPts);
                dist[1] = maxY - (this.pos[1] + this.head_offset_y);
            }
        }
        return dist;
    }

    /* sets dist so you don't run into objects */
    checkPushing (moveDist) {
        let dist = [...moveDist];

        // check collision
        let collisionPts = this.getBodyCollisionPoints(dist);
        if (collisionPts) { // fall!
            if (dist[0] > 0) { // moving right.. check right collision
                let minX = getMinX(collisionPts);
                if (dist[0] + this.bodyCollisionLine[2] > minX) {
                    dist[0] = minX - this.bodyCollisionLine[2] - 1;
                }
            } else if (dist[0] < 0) { // moving left .. check right collision
                let maxX = getMaxX(collisionPts);
                if (dist[0] + this.bodyCollisionLine[0] < maxX) {
                    dist[0] = maxX - this.bodyCollisionLine[0] + 1;
                }
            } else if (dist[0] === 0 && dist[1] !== 0) {
                let minX = getMinX(collisionPts);
                let maxX = getMaxX(collisionPts);
                if (dist[0] + this.bodyCollisionLine[2] > minX) {
                    dist[0] = minX - this.bodyCollisionLine[2] - 1;
                }
            } 
        }
        return dist;
    }

    /* checks if you've escaped the world..? */
    checkEscaped (moveDist) {
        let dist = [...moveDist];
        if (Math.abs(this.pos[0]) > 5000 || 
            Math.abs(this.pos[1]) > 5000 ||
            Math.abs(dist[0]) > 1500 || // happens on the backswing ticks
            Math.abs(dist[1]) > 1500) {
            dist = [90 - this.pos[0], 90 - this.pos[1]];
        }
        return dist;
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
        for (let oneLine of this.collisionLineList) {
            vec2.forEach(oneLine, 0, 0, 0, vec2.add, vec);
        }
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
        return this.collisionLineList;
    }

    draw (ctx) {
        this.body.draw(ctx);
    }

}

export default Player;
