// @flow
import LineSegmented from './LineSegmented';
import type {Options} from './LineSegmented';

const theExterior = [ 20,117,174,118,94,30,20,117 ];

const theFrame = [
    [ 122,96,117,90,110,98,121,105,114,113,109,105 ],
    [ 91,109,91,89,104,111,104,94 ],
    [ 78,107,73,100,80,92,87,100,78,107 ],
    [ 49,93,72,93 ],
    [ 59,109,60,93 ],
    [ 85,49,94,39,101,49,85,63,104,63 ],
    theExterior
];

/* The Two Ton Weight */
class TwoTonWeight {
    static create (opts: Options): LineSegmented {
		opts.collisionIndex = theFrame.length - 1;
        const ls = new LineSegmented(opts, theFrame);
        return ls;
    }
}

export default TwoTonWeight;
