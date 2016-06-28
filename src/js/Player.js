import vec2 from 'gl-matrix/src/gl-matrix/vec2';

import { registerHandler, registerTickEvent,
    checkTickEvent, deregisterTickEvent } from './EventHandler';

import Body from './LineSegmented/Body';

import Stuff from './Stuff'
import { DetectCollision } from './Collision'

// Returns function for max / min of all X or Y collision points
let getMaxMinFn = (fn, offset) => {
    return (collisionPts) => {
        let pt = collisionPts[0];
        let a = pt.coords[offset];
        let _a = null;  // terrible naming i know
        let _pt = null; // temp storage for vars
        for (let i = 1; i < collisionPts.length; ++i) { // check each line collision
            _pt = collisionPts[i];
            _a = fn(a, _pt.coords[offset]);
            if (_a !== a) {
                pt = _pt; // this check is done to capture the point not number alone
                a = _a;
            }
        }
        return pt;
    };
};

let getMinY = getMaxMinFn(Math.min, 1);
let getMinX = getMaxMinFn(Math.min, 0);
let getMaxX = getMaxMinFn(Math.max, 0);
let getMaxY = getMaxMinFn(Math.max, 1);

const MOVE_LR_DEC = 1;
const MOVE_LR_ACC = 0.4;
const MOVE_LR_TOP = 16;

let _n = -1; // poor man's enum
const MOVING = {
    NOT: (++_n),
    LEFT: (++_n),
    RIGHT: (++_n),
    END: (++_n),
};

// stringz
const MOVE = 'move';
const JUMP = 'jump';

/* Has its own line segments and manages connections to feet and arms
    @collisionlinesFn: type [function] 
        Returns array of collision lines (arrays of 4 pts) when invoked.
*/
class Player { 

    constructor(collisionRetrievalFunction) {

        this.collisionlinesFn = collisionRetrievalFunction;

        this.moveDist = [0, 0];
        this.groundSpeed = 0; // speed at which player is going along ground
    	this.pos = [99,165];
        this.correctionDist = vec2.create();
        this.body = new Body();
        this.jumpFlag = false;
        this.secondJumpFlag = false;
        this.movingFlag = MOVING.NOT;
    	this.footFrame = 0;
        this.footMoveFrames = 15;
        this.moveRightFrames = 15;
    	this.moveEndFrames = 4;

        this.collisionLineList = []; // stores registered collision lines

        // trying to think up a better way to abstract this
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

    addCollisionLine(nums) { // registers lines in a useful list
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

    decel = () => {
        if (this.moveDist < 0) { 
            this.moveDist = Math.min(this.moveDist + 0.25, 0);
        } else if (this.moveDist > 0) { 
            this.moveDist = Math.max(this.moveDist - 0.25, 0);
        }
    };

    moveRight = () => {
        this.movingFlag = MOVING.RIGHT;

        let x = this.moveDist[0];
        if (x < 0) { // going left.. accelerate right!
            x = Math.min(x + MOVE_LR_DEC, 0);
        } else {
            x = Math.min(x + MOVE_LR_ACC, MOVE_LR_TOP);
        }
        this.moveLR(x);
    };

    moveLeft = () => {
        this.movingFlag = MOVING.LEFT;

        let x = this.moveDist[0];
        if (x > 0) { // going right.. accelerate left!
            x = Math.max(x - MOVE_LR_DEC, 0);
        } else {
            x = Math.max(x - MOVE_LR_ACC, -MOVE_LR_TOP)
        }
        this.moveLR(x);
    };

    moveLR (x) { // do things needed by both methods
        this.moveDist[0] = x;
        this.footFrame = Math.min(this.footFrame + 1, this.footMoveFrames - 1);
        this.body.setFeetToFrame(this.footFrame);
    }

    /* Called each tick. Makes adjustments to next distance 
        based on environment. Then changes player to position */
    adjustPosition = () => {
        this.moveDist = this.checkPushing(this.moveDist);
        this.moveDist = this.checkFalling(this.moveDist);
        this.moveDist = this.checkCeiling(this.moveDist);
        this.moveDist = this.checkEscaped(this.moveDist); // lol
        if (this.correctionDist[0] !== 0 && this.correctionDist[1] !== 0) {
            this.translate(this.correctionDist);
            vec2.set(this.correctionDist, 0, 0);
        }
        if (this.moveDist[0] === 0 && this.moveDist[1] === 0) return;
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

    /* Returns modified moveDist array that preserves ground speed
        Only sets X coord in current implementation
        - line: line that is being collided with
        - moveDist: original distance (is modified)
    */
    preserveGroundSpeed (line, moveDist) {

        let lineVec = [  // get direction of line.
            line[2] - line[0], line[3] - line[1]
        ];
        // direction-only, not magnitude
        vec2.normalize(lineVec, lineVec);
        // make sure vector points in positive-y direction
        if (lineVec[1] < 0) { vec2.negate(lineVec, lineVec); }

        // preserve groundspeed
        let gSpd = vec2.dot(moveDist, lineVec);
        if (Math.abs(gSpd) > 0.01) {
            vec2.scale(moveDist, lineVec, gSpd);
        } else {
            vec2.set(moveDist, 0, 0);
        }
    }

    /* add some fall distance in freefall */
    accelerateGravity (moveVec) {
        let dY = moveVec[1];
        if (this.jumpFlag && dY >= 0 && dY < 5) { // accelerate
            moveVec[1] = dY + .25;
        } else if (dY >= 0 && dY < 15) { // accelerate more
            moveVec[1] = dY + 0.5;
        } else if (dY < 20) { // accelerate more
            moveVec[1] = dY + 1;
        }
    }

    /* checks if you'd be falling into objects and sets dist accordingly */
    checkFalling (moveDist) {

        // check collision 
        let collisionPts = this.getFootCollisionPoints(moveDist);
        if (collisionPts) { // bam. hit ground
            if (!!this.jumpFlag) { this.jumpFlag = false; } // reset powerups
            if (!!this.secondJumpFlag) { this.secondJumpFlag = false; }
            if (!this.onGround) { this.onGround = true; }

            // are we falling (y positive)? if so, set to line intercept
            if (moveDist[1] > 0  || (moveDist[1] === 0 && moveDist[0] !== 0)) {
                let minYLine = getMinY(collisionPts);
                let minY = minYLine.coords[1];
                this.correctionDist[1] = minY - this.pos[1];

//                console.log()                

                // after changing it, preserve ground speed
                this.preserveGroundSpeed(minYLine.line, moveDist);
            }
        } else {
            if (!!this.onGround) { this.onGround = false; }
            this.accelerateGravity(moveDist);
            let newCollisionPts = this.getFootCollisionPoints([moveDist]);
            if (newCollisionPts) { // could overshoot ground
                let minY = getMinY(newCollisionPts).coords[1];
                if (moveDist[1] > minY - this.pos[1]) {
                    moveDist[1] = this.pos[1] - minY;
                }
            }
        }
        return moveDist;
    }

//    /* figures out a better value for the angle 
//    preserveGroundSpeed(currSpeed, line, newSpeed)

    /* checks if you'd hit object with head and sets dist accordingly */
    checkCeiling (moveDist) {
        let dist = [...moveDist];

        // check collision 

        let collisionPts = this.getHeadCollisionPoints(dist);
        if (collisionPts) { // bam. hit ceiling
            // are we going up (y negative)? if so, set to line intercept
            if (dist[1] < 0 || dist[1] === 0 && dist[0] !== 0) {
                let maxY = getMaxY(collisionPts).coords[1];
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
            // have to be careful here, since the character will jump wildly 
            //  if the wrong detection is applied
            // A couple options are:
            // 1. Detect direction player is moving in
            // 2. Detect whether a change would cause player to jump
            // 3. Detect how close collision is to edges of line

            if (dist[0] > 0) {
                // check right collision.
                let minX = getMinX(collisionPts).coords[0];
                if (dist[0] + this.bodyCollisionLine[2] > minX) {
                    this.correctionDist[0] = minX - this.bodyCollisionLine[2] - 1;
                    console.log("Collision moving right! From / to: ",
                        dist[0], this.correctionDist[0]);
                    dist[0] = 0;
                }

            } else if (dist[0] < 0) { // moving left .. check right collision
                let maxX = getMaxX(collisionPts).coords[0];
                if (dist[0] + this.bodyCollisionLine[0] < maxX) {
                    this.correctionDist[0] = maxX - this.bodyCollisionLine[0] + 1;
                    console.log("Collision moving left! From / to: ",
                        dist[0], this.correctionDist[0]);
                    dist[0] = 0;
                }
            } 
            //else if (dist[0] === 0 && dist[1] !== 0) {
            //    let minX = getMinX(collisionPts).coords[0];
            //    let maxX = getMaxX(collisionPts).coords[0];
            //    if (dist[0] + this.bodyCollisionLine[2] > minX) {
            //        dist[0] = minX - this.bodyCollisionLine[2] - 1;
            //    }
//            } 
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

    moveEndInitialSpeed = null;
    moveEnd = (e) => { // lose `1 velocity per second`

        // set up things if first run
        if (this.movingFlag !== MOVING.END) {
            this.moveEndInitialSpeed = this.moveDist[0];
            this.movingFlag = MOVING.END;
        }

        let newX = this.moveDist[0];

        if (newX === 0 ) {
            this.footFrame = 0;
            deregisterTickEvent(MOVE);
        } else if (newX > 0 ) {
            newX = Math.max(0, newX - 0.5);
        } else { // newX < 0
            newX = Math.min(0, newX + 0.5);
        }

        this.moveDist[0] = newX;

        let f = (this.moveEndInitialSpeed === 0)? 0:
            Math.floor(
                this.footMoveFrames * Math.abs(
                    newX / this.moveEndInitialSpeed));
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

    keydownList = {};

    setPositionOnKeyDown = (e) => {
        this.keydownList[e.keyCode] = true;
    	switch (e.keyCode) {
            case 37: // 'left'
                registerTickEvent(MOVE, this.moveLeft, 0, true);
                break;
            case 38: // 'Up'
                registerTickEvent(JUMP, this.jump, 1);
                break;
            case 39: // 'Right'
                registerTickEvent(MOVE, this.moveRight, 0, true);
                break;
    		default: ;
    	}
        e.preventDefault();
    };

    setPositionOnKeyUp = (e) => {
        this.keydownList[e.keyCode] = false;
    	switch (e.keyCode) {
            case 37: // 'Left'
                if (!!this.keydownList[39]) {
                    registerTickEvent(MOVE, this.moveRight, 0, true);
                } else {
                    registerTickEvent(MOVE, this.moveEnd, 0, true);
                }
                break;
            case 39: // 'Right'
                if (!!this.keydownList[37]) {
                registerTickEvent(MOVE, this.moveLeft, 0, true);
                } else {
                    registerTickEvent(MOVE, this.moveEnd, 0, true);
                }
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
