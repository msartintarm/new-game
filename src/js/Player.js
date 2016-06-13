import vec2 from 'gl-matrix/src/gl-matrix/vec2';

import { registerHandler, registerTickEvent,
    checkTickEvent, deregisterTickEvent } from './EventHandler';

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
        this.moveLeftFrames = 15;
        this.moveRightFrames = 15;
    	this.moveEndFrames = 4;

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

        this.face = new LineSegmented({},
            [
                [115,105,106,104,102,89,102,71,105,74,115,75],
                [113,88,106,88]
            ]
        );


        this.body = new LineSegmented({}, 
            [[57,130,139,129],[96,130,94,13,125,44]]);
        registerHandler('keydown', 'play_area', this.setPositionOnKeyDown);
        registerHandler('keyup', 'play_area', this.setPositionOnKeyUp);

        this.activeMove = null;

        this.hand = (new Hand()).translate(this.handPt);

        // used to automate drawing / translation a little
        this.segmentedList = [ 
            this.body,
            ...this.feet,
            this.hand,
            this.face
        ]

        registerTickEvent('adjustPosition', this.adjustPosition, 0); // set fall

    }

    jump = (e) => {
        this.moveDist[1] = -20;
    };

    moveRight = (e) => {

        this.moveDist[0] = 6;
        this.footFrame = Math.min(this.footFrame + 1, this.moveRightFrames - 1);
        this.feet[0].setToFrame(this.footFrame).translate(this.footPt1);
        this.feet[1].setToFrame(this.footFrame).translate(this.footPt2);
    };

    moveLeft = (e) => {

        this.moveDist[0] = -6;
        this.footFrame = Math.min(this.footFrame + 1, this.moveLeftFrames - 1);
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
                for (let i = 1; i < thePts.length; i += 2) {
                    this.moveDist[1] = Math.min(0, thePts[i] - this.pos[1], this.moveDist[1]);
                }
                if (this.moveDist[1] < 0) this.isFalling = false;
                if (this.moveDist[1] < 0) this.isFalling = false;
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
