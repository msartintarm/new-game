import LineSegmented from './LineSegmented';

const HandWithScissors1 = [
	[28,4,40,21],
	[30,19,47,5],
	[25,18,23,16,24,10,26,9,31,10,32,16,25,19],
		[24,17,6,18,0,10],
	[0,4,8,13,24,12]
];
const HandWithScissors2 = [
	[28,4,40,21],
	[30,19,47,5],
	[25,18,23,16,24,10,26,9,31,10,32,16,25,19],
		[24,17,6,18,0,10],
	[0,4,8,13,24,12]
];

class Hand {
    constructor(opts) {
        return new LineSegmented(
            opts, HandWithScissors1, HandWithScissors2);
    }
}

export default Hand;
