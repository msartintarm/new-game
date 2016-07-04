import LineSegmented from './LineSegmented';
    
const frameStart = [
    [13,32, 16,13, 6,0, 5,0, 0,0, 10,15],
    [10,15, 7,38, 32,38, 42,38, 52,38, 31,34, 18,33, 8,33]
];
const frameEnd = [
    [-2,20, 9,12, 5,0, 5,0, 0,0, 2,13],
    [2,13, -17,23, 3,26, 3,38, 21,38, 8,33, 7,22, -8,19]
];

/* The Foot */
let FootSegment = (opts) => {
	opts.fillColor = [100, 100, 40];
	opts.fillFrames = [false, true];
    return new LineSegmented(opts, frameStart, frameEnd);
};

export default FootSegment;
