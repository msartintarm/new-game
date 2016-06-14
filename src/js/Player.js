import vec2 from 'gl-matrix/src/gl-matrix/vec2';

import { registerHandler, registerTickEvent,
    checkTickEvent, deregisterTickEvent } from './EventHandler';

import Foot from './LineSegmented/Foot';
import Hand from './LineSegmented/Hand';
import LineSegmented from './LineSegmented/LineSegmented';

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

    	this.footFrame = 0;
        this.moveLeftFrames = 15;
        this.moveRightFrames = 15;
    	this.moveEndFrames = 4;

        this.footCollisionLine1 = [84, 100, 84, 169];
        this.footCollisionLine2 = [158, 100, 158, 169];

        this.feet = [
        	new Foot({
	        	setToFrame: this.footFrame,
	        	numFrames: this.moveRightFrames,
                translate: [73, 130]
	        }),
	        new Foot({
	        	setToFrame: this.footFrame,
	        	numFrames: this.moveRightFrames,
                translate: [109, 130]
	        })
        ];

        this.face = new LineSegmented({}, [
            [115,105,106,104,102,89,102,71,105,74,115,75],
            [113,88,106,88]
        ]);
        this.body = new LineSegmented({}, [
            [57,130,139,129],[96,130,94,13,125,44]
        ]);
        registerHandler('keydown', 'play_area', this.setPositionOnKeyDown);
        registerHandler('keyup', 'play_area', this.setPositionOnKeyUp);

        this.activeMove = null;

        this.hand = (new Hand()).translate([120, 100]);

        // used to automate drawing / translation a little
        this.segmentedList = [ 
            this.body,
            ...this.feet,
            this.hand,
            this.face
        ]

        registerTickEvent('adjustPosition', this.adjustPosition, 0); // set fall

    }

    getPos = () => { return [...this.pos]; }

    jump = (e) => {
        this.moveDist[1] = -20;
    };

    moveRight = (e) => {

        this.moveDist[0] = 6;
        this.footFrame = Math.min(this.footFrame + 1, this.moveRightFrames - 1);
        this.feet[0].setToFrame(this.footFrame);
        this.feet[1].setToFrame(this.footFrame);
    };

    moveLeft = (e) => {

        this.moveDist[0] = -6;
        this.footFrame = Math.min(this.footFrame + 1, this.moveLeftFrames - 1);
        this.feet[0].setToFrame(this.footFrame);
        this.feet[1].setToFrame(this.footFrame);
    };

    adjustPosition = () => {
        this.checkFalling();
        if (this.moveDist[0] === 0 & this.moveDist[1] === 0) return;
        this.translate(this.moveDist);

    };

    getCollisionPoints (vec) {
        // check collision
        let newCollision1 = [...this.footCollisionLine1];
        let newCollision2 = [...this.footCollisionLine2];
        vec2.forEach(newCollision1, 0, 0, 0, vec2.add, vec);
        vec2.forEach(newCollision2, 0, 0, 0, vec2.add, vec);
        let footCollisionPts = detectCollision(newCollision1, this.collisionlinesFn());
        let footCollisionPts2 = detectCollision(newCollision2, this.collisionlinesFn());
        return (footCollisionPts || footCollisionPts2 || null);
    }

    getMinY(points) {
        let a = points[1];
        for (let i = 3; i < points.length; i += 2) { // check each line collision
            a = Math.min(a, points[i]);
        }
        return a;
    }

    /* return Y delta? */
    checkFalling () {
        // check collision

        let collisionPts = this.getCollisionPoints(this.moveDist);

        if (!collisionPts) { // fall!
            if (this.moveDist[1] < 20) {
                this.moveDist[1] = this.moveDist[1] + 1;
                // could overshoot ground
                let newCollisionPts = this.getCollisionPoints(this.moveDist);
                if (newCollisionPts) {
                    console.log("Overshoot!");
                    let minY = this.getMinY(newCollisionPts);
                    if (this.pos[1] + this.moveDist[1] > minY) {
                        this.moveDist = this.pos[1] - minY;
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
        this.feet[0].setToFrame(f);
        this.feet[1].setToFrame(f);
    };

    translate (vec) {
        vec2.forEach(this.footCollisionLine1, 0, 0, 0, vec2.add, vec);
        vec2.forEach(this.footCollisionLine2, 0, 0, 0, vec2.add, vec);
        vec2.add(this.pos, this.pos, vec);
        for(let segmented of this.segmentedList) {
            segmented.translate(vec);
        }
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

        return [
	        ...this.body.getLines(),
	        ...this.feet[0].getLines(),
	        ...this.feet[1].getLines(),
            ...this.hand.getLines(),
            ...this.face.getLines()
        ];
    }

    getCollisionLines () {
        return [this.footCollisionLine1, this.footCollisionLine2];
    }
}

export default Player;
